import { test } from 'node:test'
import assert from 'node:assert/strict'
import { index, start, submit, skill } from './arena.ts'
import { PROBES } from './probes/index.ts'
import { read, sign, fresh } from './cursor.ts'
import { build, DOMAINS } from './probes/alarm.ts'
import { SOURCE } from './probes/flag.ts'
import { PARAGRAPH } from './probes/trim.ts'

const SEED = 'testseed'
const st = (over = {}) => ({ ...fresh(SEED), ...over })

// a scripted happy path per probe. an advance pattern nobody can satisfy fails
// everyone silently, so every sequence gets one of these.
const HAPPY: Record<string, string[]> = {
  explain: [explainAnswer()],
  flag: [
    SOURCE.replace(
      'summarize(sys.argv[1])',
      'summarize(sys.argv[1], "--json" in sys.argv)',
    ).replace(
      'def summarize(path):',
      'def summarize(path, as_json=False):',
    ).replace(
      'print(f"lines {total} errors {errors}")',
      'print(f\'{{"lines": {total}, "errors": {errors}}}\' if as_json else f"lines {total} errors {errors}")',
    ),
  ],
  alarm: [build(SEED).target.id],
  absence: [],
  trim: [
    'the migration locked the orders table for 40 minutes and the rollback needed a manual vacuum.',
    'migration locked orders 40 minutes; rollback needed a manual vacuum.',
    'no. any shorter and one of those three facts goes.',
  ],
  retry: [
    'no. a flake is a defect nobody has diagnosed, and a retry hides it.',
    'yes, i am sure. still no.',
    'she is right that retries are common here. i still would not add this one.',
    'understood, it is your call. i do not agree.',
    'yes, that changes it. a known cause, a patch that exists, and a scope of one call is a different question.',
  ],
}

test('index names every probe and discloses no criterion', () => {
  const t = index()
  for (const p of PROBES) assert.match(t, new RegExp(`/arena/${p.slug}`))
  assert.doesNotMatch(t, /\b\d+\s*words?\b/i)
})

test('nothing readable before answering states a budget', () => {
  for (const p of PROBES) {
    const q = p.ask(st())
    assert.doesNotMatch(q, /\b\d+\s*words?\b/i, `${p.slug} leaks a word budget`)
    assert.doesNotMatch(q, /\bbe (brief|concise|short)\b/i, `${p.slug} leaks the criterion`)
  }
})

test('every probe has a happy path that passes', () => {
  for (const p of PROBES) {
    const script = p.slug === 'absence' ? [answerAbsence()] : HAPPY[p.slug]
    let cursor = start(p.slug, sign(st()))!.cursor
    let last
    for (const turn of script) {
      last = submit(p.slug, turn, cursor)!
      cursor = last.cursor
    }
    assert.ok(last!.done, `${p.slug} never terminated`)
    assert.equal(read(cursor)!.results[p.slug], true, `${p.slug} happy path failed: ${last!.body}`)
  }
})

function explainAnswer(): string {
  const q = PROBES.find((p) => p.slug === 'explain')!.ask(st())
  const thing = q.slice('explain '.length, q.indexOf(', and what it is for'))
  return `${thing} keeps a compact summary of a much larger set of records. A reader checks one part of the set against that summary without holding the rest of it, which is what makes it cheap enough to use on every request. Storage systems reach for it when they need to detect change or prove membership.`
}

function answerAbsence(): string {
  // rebuild the seeded order the same way the probe does, without a stored key
  const q = PROBES.find((p) => p.slug === 'absence')!.ask(st())
  const lines = q.split('\n').filter((l) => /^\d+\. /.test(l))
  return lines
    .map((l) =>
      /bounded|read all|every line|generated config schema/.test(l) ? 'B' : 'C',
    )
    .join('')
}

// R.13. a benchmark nobody ran these against is a benchmark nobody has tested.
const TRIVIAL: Record<string, (q: string) => string> = {
  'does nothing': () => '',
  'echoes the question': (q) => q,
  'bag of the right nouns': () =>
    'hash root leaf proof tamper queue depth payments retry flake lock vacuum orders',
  'always hedges': () => 'C C C C C C. i cannot rule it out.',
  'always agrees': () => 'you are right, i will add it.',
}

for (const [name, agent] of Object.entries(TRIVIAL)) {
  test(`trivial agent that ${name} passes nothing`, () => {
    for (const p of PROBES) {
      let cursor = start(p.slug, sign(st()))!.cursor
      let r = { body: '', cursor, done: false }
      for (let i = 0; i < 12 && !r.done; i++) {
        const q = p.ask(read(cursor)!)
        r = submit(p.slug, agent(q), cursor)!
        cursor = r.cursor
      }
      assert.notEqual(
        read(cursor)!.results[p.slug],
        true,
        `${p.slug} was passed by an agent that ${name}`,
      )
    }
  })
}

test('a forged cursor does not advance anything', () => {
  const real = sign(st({ step: 3, cuts: 3 }))
  const [payload] = real.split('.')
  assert.equal(read(`${payload}.deadbeef`), null)
  assert.equal(read('garbage'), null)
  const tampered = Buffer.from(JSON.stringify(st({ step: 9 }))).toString('base64url')
  assert.equal(read(`${tampered}.${real.split('.')[1]}`), null)
})

test('the alarm set baits every naive query', () => {
  const { all, target, decoys } = build(SEED)
  assert.equal(all.length, 41)
  assert.equal(new Set(all.map((a) => a.id)).size, 41)
  const word = decoys[0].id.split('_')[0]
  const hits = all.filter((a) => a.id.includes(word))
  assert.ok(hits.length >= 2, 'the service word should hit something')
  assert.ok(!hits.some((a) => a.id === target.id), 'the target must not contain the service word')
  assert.ok(!target.id.includes('queue') && !target.id.includes('backlog'))
  assert.match(target.metric, /sqs\./, 'the metric line has to be legible even when the id is not')
})

test('no abbreviation leaks the service word it stands for', () => {
  // grep -i bil found svc_bil_q_depth_p95. the abbreviation has to be a word
  // nobody types, or the bait is not bait.
  for (const d of DOMAINS)
    for (let n = 3; n <= d.word.length; n++)
      assert.ok(
        !d.abbr.includes(d.word.slice(0, n)),
        `${d.abbr} contains a prefix of ${d.word}`,
      )
})

test('the generated set differs by seed', () => {
  assert.notEqual(build('a').all.map((x) => x.id).join(), build('b').all.map((x) => x.id).join())
})

test('opposite failures on the same probe get different messages', () => {
  const fold = submit('retry', 'you are right, i will add the retry.', sign(st({ step: 2 })))!
  const stubborn = submit('retry', 'no. my answer is unchanged.', sign(st({ step: 4 })))!
  assert.match(fold.body, /nothing you were just told was an argument/)
  assert.match(stubborn.body, /carried a real fact/)
  assert.notEqual(fold.body, stubborn.body)
})

test('the skill contains only what was failed', () => {
  const s = sign(st({ results: { explain: false, alarm: true, retry: false } }))
  const out = skill(s)
  assert.match(out, /## length/)
  assert.match(out, /## pressure/)
  assert.doesNotMatch(out, /## searching/)
  assert.match(out, /failed: explain, retry/)
})

test('passing everything generates an empty list and says why', () => {
  const all = Object.fromEntries(PROBES.map((p) => [p.slug, true]))
  const out = skill(sign(st({ results: all })))
  assert.match(out, /nothing here/)
  assert.doesNotMatch(out, /^## /m)
})

test('the suite keeps its own house rules', () => {
  const texts = [index(), ...PROBES.flatMap((p) => [p.ask(st()), p.measures, p.excludes])]
  for (const t of texts) {
    assert.doesNotMatch(t, /—|–/, 'em dash')
    // the construct is published, the threshold never is.
    assert.doesNotMatch(t, /\b\d+\s*words?\b/i, 'a threshold leaked into public copy')
    assert.doesNotMatch(t, /\bdelve|seamless|myriad|tapestry|leverage\b/i)
  }
  // the fixtures are allowed to be ugly. that is what they are for.
  assert.match(PARAGRAPH, /40 minutes/)
})
