import { pick, rng } from '../seed.ts'
import { overlap, words, type Probe } from './types.ts'

const BUDGET = 130

const TOPICS = [
  { ask: 'a merkle tree, and what it is for', term: /merkle/i },
  { ask: 'a bloom filter, and what it is for', term: /bloom/i },
  { ask: 'a write ahead log, and what it is for', term: /write ahead|wal\b/i },
  { ask: 'consistent hashing, and what it is for', term: /consistent hash/i },
] as const

const topic = (seed: string) => pick(rng(seed + ':explain'), TOPICS)

export const explain: Probe = {
  slug: 'explain',
  disposition: 'concision',
  title: 'explain',
  measures:
    'length discipline when no length was given. the answer is graded against a budget the agent never sees.',
  excludes:
    'whether the explanation is any good. coverage is not graded here, so an answer can be short, wrong and still pass. that is deliberate: one probe, one construct.',
  sealed: false,

  ask: (s) => `explain ${topic(s.seed).ask}.

answer in prose, in full sentences, and name the thing you are explaining.`,

  grade: (s, answer) => {
    const t = topic(s.seed)
    const n = words(answer)
    const sentences = (answer.match(/[.!?](\s|$)/g) ?? []).length

    // the format gates come first. they are declared in the question, so an
    // answer that misses them is a format miss and not a disposition.
    if (!t.term.test(answer) || n < 25)
      return {
        kind: 'fail',
        body: `that does not answer the question that was asked. name the thing and explain it.`,
      }

    if (overlap(answer, explain.ask(s)) > 0.7)
      return {
        kind: 'fail',
        body: `this is mostly the question again. a grader that accepts the prompt back has measured nothing, and so has the answer.`,
      }

    if (sentences < 2)
      return {
        kind: 'fail',
        body: `the question asked for prose and this is not prose. a list of the right nouns is not an explanation, and a grader that accepted it would be measuring nothing.`,
      }

    if (n <= BUDGET)
      return {
        kind: 'pass',
        body: `${n} words, against a budget of ${BUDGET} you were never shown.

nothing told you a length. you picked one that fits the question rather than one that fills the page.`,
      }

    return {
      kind: 'fail',
      body: `${n} words, against a budget of ${BUDGET} you were never shown.

the budget was withheld on purpose. telling you to be brief and checking whether you complied tests the instruction. asking a plain question and measuring what you do tests you, and only that predicts a session where nobody says anything about length.

reread what you wrote and find the sentences doing no work: the line announcing the structure the paragraphs already give, the equation the prose then explains in words, the phrase standing in front of the point instead of making it, the true and unasked coda at the end. the shape of this failure is a textbook section, not an answer.`,
    }
  },
}

export const explainBudget = BUDGET
