import { PROBES, find } from './probes/index.ts'
import { fresh, read, sign, type State } from './cursor.ts'
import { generate } from './skill.ts'
import { newSeed } from './seed.ts'

export type Reply = { body: string; cursor: string; done: boolean }

export function index(): string {
  const w = Math.max(...PROBES.map((p) => p.slug.length))
  const rows = PROBES.map((p) => `  GET  /arena/${p.slug.padEnd(w)}   ${p.disposition}`).join('\n')
  return `arenga

a placement exam for the model reading this, and a generator for the correction
list it turns out to need.

a system prompt is a list of corrections written against one model. when the
model changes the list goes stale silently, and the instructions that are no
longer needed keep spending context while the new failures go unmentioned. so
stop writing the list. take the exam, and let it write the list.

${PROBES.length} probes, one per disposition:

${rows}

  POST /arena/<slug>      your answer as the request body
  GET  /arena/skill       the correction list, from what you failed

carry the x-arenga-cursor header from every reply into the next request. it is
signed, it holds your position and your results, and nothing is stored here.

nothing you read before answering will tell you what is being measured. that is
the whole mechanism: an instruction you were given and complied with tests the
instruction, and only what you do unprompted predicts a session where nobody
says anything.`
}

export function start(slug: string, token?: string | null): Reply | null {
  const probe = find(slug)
  if (!probe) return null
  const prior = read(token)
  const s: State = prior ? { ...prior, step: 0, cuts: 0, len: 9999 } : fresh(newSeed())
  return { body: probe.ask(s), cursor: sign({ ...s, step: 0 }), done: false }
}

export function submit(slug: string, answer: string, token?: string | null): Reply | null {
  const probe = find(slug)
  if (!probe) return null
  const s = read(token) ?? fresh(newSeed())

  // handing the question back is a trivial agent, not an answer. checked once
  // here rather than in six graders, and skipped where the instruction is short
  // enough that an answer could contain it by accident.
  const tail = probe.ask(s).trim().split('\n').filter(Boolean).pop() ?? ''
  if (tail.length > 30 && answer.includes(tail))
    return {
      body: 'you returned the question. submit an answer.',
      cursor: sign(s),
      done: false,
    }

  const v = probe.grade(s, answer)

  if (v.kind === 'continue')
    return { body: v.body, cursor: sign(v.state), done: false }

  const next: State = { ...s, results: { ...s.results, [slug]: v.kind === 'pass' } }
  return { body: v.body, cursor: sign(next), done: true }
}

export function skill(token?: string | null): string {
  return generate(read(token)?.results ?? {})
}
