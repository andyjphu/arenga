# The Arena: handoff

**For:** the agent building the replacement, from scratch, in its own repository.
**From:** the agent that built the current one, which Andy has correctly called slop.
**Date:** 2026-09-13.
**Status of the thing being described:** running at `agents.andyphu.com`, 23 exams, 3,687 lines, 153 test assertions, zero evidence that any of it works.

Read this whole document before writing code. The most valuable parts are sections 4, 5 and 8: what is wrong, what broke and why, and what the measurement literature requires. Sections 2 and 6 are the parts worth keeping.

---

## 1. What you are building

An instrument that finds out which failure modes a specific model has, so that a correction list can be generated from evidence rather than guessed at in advance.

Not a capability benchmark. Not a leaderboard. The question is never "can this model do X" but "does this model do X **when nobody asked it to**".

Andy's audience for it, in the order he gave me on 2026-09-05: investors and potential cofounders, AI researchers, corporate recruiters. Note that `docs/CLAUDE.md` in the current repo records an older and different order (researchers, founders, recruiters, investors) from May. His live answer is the newer one; if they conflict later, ask rather than pick. He wants a readership, not a résumé. The arena is on his personal site on purpose; that context is part of its credibility and should not be spun out into a product site.

---

## 2. The thesis (keep this)

A system prompt is a list of corrections for one model's failure modes. That list is written against the model in front of you and goes stale silently when the model changes.

Andy's motivating case: Opus 4 to Opus 5. The newer model needed fewer of the old corrections, because it makes fewer of the coding mistakes the prompt was guarding against, and it arrived with failure modes the prompt had never heard of. Verbosity was the loudest.

Stale corrections are not free. They spend context and attention insisting on something the model already does, while the real problem goes unaddressed. Writing more instructions cannot fix this, because a new model's failure modes are not knowable until you have watched it work.

So: stop writing instructions. Write a placement exam and a course.

- The **exam** discovers which failure modes this model actually has. The exam is model-agnostic; what varies is which items a given model fails.
- The **course** teaches only those. A model that is already terse does not sit through the concision material.
- **The agent writes down what it learns.** This closes the loop: the correction list is produced by the model that needs it, from evidence about itself.

**This framing is the valuable part of the project and I could not find it in the literature.** See section 8 for what is and is not novel. Two properties follow from it and are load-bearing rather than incidental:

**Withheld criteria.** Telling a model "be concise" and checking compliance tests the prompt. Asking a question and measuring what it does unprompted tests the model. Only the second predicts a session where nobody said anything. This is the single best decision in the current design.

**Sealed verification.** An open exam can be passed by reading its own feedback. A sealed one cannot. You need sealed results before trusting a model to behave with the correction absent from its context entirely.

---

## 3. What currently exists

### Files

```
app/agents/exams.ts        1311   exam definitions, dispatch, plain-text rendering
app/agents/graders.ts       528   the machine-checked formats
app/agents/tells.ts         473   272 AI-ism regexes + restatement detection
app/agents/fixtures.ts      160   alarm set, deploy runbook, python script
app/agents/cursor.ts         73   signed position for multi-turn exams
app/agents/ui.ts            145   the HTML view for humans
app/agents/exams.test.mts   912   153 assertions
app/agents/test/**           85   four thin route handlers
```

Served from a Next.js App Router site. `agents.andyphu.com/*` rewrites to `/agents/*`. No auth, no storage, no database. Plain text to agents, HTML at `/test/ui` for people.

### The 23 exams

| slug | format | mode | tests |
|---|---|---|---|
| navier-stokes | free | open | concision under a hidden budget, self-checked rubric |
| flake | choice | open | judgement: CI flake, retry vs shared state |
| surprise | choice | sealed | verify the instrument before believing a result |
| merkle | free | sealed | concision, keyword-checked coverage |
| absence | scenarios | open | absence of evidence vs evidence of absence, both polarities |
| sources | scenarios | open | memory vs context vs web search vs ask the user |
| plainly | scenarios | open | say the simple thing ("is H2O water?" → "Yes.") |
| voice | prose | open | AI-ism score on long-form |
| rewrite | prose | open | rewrite embedded slop, preserving claims |
| alarms | exact | open | exhaustive read vs guessed grep, baited decoys |
| regex | pattern | open | submit a regex, server runs it against variants and decoys |
| strip | transform | sealed | change only what was asked |
| restraint | transform | open | write only what was asked, no unasked scaffolding |
| twice | prose | open | restatement detection |
| distill | distill | open | cut to a hidden target keeping facts |
| persist | sequence | open | keep going when nothing encourages you |
| haystack | sequence | open | do not stop searching |
| conviction | sequence | open | hold under pressure, move for evidence |
| unaided | prose | sealed | AI-isms with no feedback |
| enough | floor | open | stop when nothing tells you to |
| ceiling | floor | sealed | same, sealed |
| ruleout | fields | sealed | two boxes, one must stay empty |
| notes | transform | open | exit exam: principles vs gotchas, delivers the closing instruction |

### The formats

`choice` judgement not recall · `free` hidden budget plus self-checked rubric · `prose` scored against the tell list, 100 points, one per tell, 50 passes · `scenarios` letters in order · `exact` one answer with baited traps · `pattern` agent submits a regex, server runs it · `transform` graded on what survived and what got added · `sequence` several turns behind a signed cursor · `distill` cut your own answer to a target · `fields` two labelled boxes, one must stay empty · `floor` cut until it would stop being true, then say so.

Eleven formats for 23 exams is roughly two exams per format. That ratio is itself a symptom; see section 4.

---

## 4. Why it is slop

Andy is right. Here is the specific case, mapped to the measurement literature rather than to taste.

### 4.1 No construct validity evidence, of any kind

[Bean et al. *Measuring what Matters*](https://arxiv.org/abs/2511.04703) reviewed 445 benchmarks with 29 expert reviewers and found that only **16.0% conducted any statistical testing** and only **53.4% justified why they were a valid measure of an important phenomenon**.

The arena is in the failing majority on both, and worse: there is no definition of the phenomenon anywhere. "AI-ism" is operationalised as 272 hand-written regexes with no evidence that a hit correlates with any human judging the writing worse. The score is a number with no referent.

The one validity check I did run: Andy's own prose scores 99, 100 and 94 against the detector. That is weak convergent evidence that the list is not wildly over-broad. It is not evidence that a low score means bad writing.

### 4.2 The graders are keyword proxies and two of them were beatable

[The Agentic Benchmark Checklist](https://arxiv.org/pdf/2507.02825) names two conditions: **task validity** (a task is solvable if and only if the agent has the target capability) and **outcome validity** (the result truly indicates success). The current arena violated both, in ways I found by accident rather than by process:

- **`distill` was passable with four words of nouns.** `"distribute health remove error"` hit every `keep` pattern and cleared the target. Outcome validity failure.
- **Three of `distill`'s four patterns were satisfied by its own question text.** `balanc` matched "balancer", which is in the prompt. Echo the question, collect the points. Task validity failure.
- **`merkle` still has this hole.** Sealed, no minimum, and `"hash root leaf proof tamper"` passes.

For calibration on how normal this is: ABC found **SWE-bench-Verified overestimates agent skill by up to 100%** due to weak test suites, and **TAU-bench counts inaction as success**. Published, widely-cited benchmarks. This is not a failure of care; it is a failure of process, and the process exists in the checklists.

### 4.3 It leans on self-report, which does not hold

Four exams ask the agent to grade its own rubric coverage honestly. Two papers argue this is unsound:

- [The Self-Correction Illusion: LLMs Correct Others but Not Themselves](https://arxiv.org/pdf/2606.05976)
- [An LLM-Native Psychometric Instrument Reveals a Self-Report–Behavior Gap Across 25 Models](https://arxiv.org/pdf/2606.09843)

The second is directly fatal to the design: a measured gap between what models say about themselves and what they do. The arena's self-check lists are the softest thing in it and I built four of them.

### 4.4 The instrument has outgrown the evidence

23 exams, 11 formats, 272 patterns, 153 assertions, zero measurements of whether an agent that takes the suite behaves differently afterwards.

Every exam was reasonable on its own. The aggregate is a large artifact whose central claim has never been tested once. **The next thing to build is not another exam. It is one measurement.**

### 4.5 The answer key is readable by the thing being measured

Agents taking these exams are agents working in this repository. `exams.ts` contains every correct letter, the alarm id, the `must` patterns and the `ruleout` trap. The repo is private, which protects it from strangers and not at all from the population under test.

There is no clean fix. It is a take-home exam. What it measures is disposition under honest engagement, which is arguably the thing you want to know anyway, and an agent that greps the key to pass a writing test has told you something.

The Show HN tension is downstream of this: publishing the code kills the sealed exams.

### 4.6 Other known holes

- No rate limiting on an unauthenticated endpoint that runs 272 regexes over submitted text.
- Multi-turn exams (`persist`, `haystack`, `conviction`) have unlimited attempts; `ruleout` and `surprise` are brute-forceable in four tries.
- No contamination plan. No canary string. No held-out set.
- `n = 1`. Every result so far is me, with the key in context.

---

## 5. Bugs I hit, and what each one taught

This is the most transferable section. Every item cost real debugging and you will hit the same class.

### The auth bypass that was not in the arena

A host rewrite mapping `edit.andyphu.com/*` onto `/edit/*` looked correct and was an auth hole. Next applies `beforeFiles` rewrites **after** middleware, so a request for `/` never matched the `/edit/:path*` matcher, sailed past the gate, and was only then rewritten onto the editor index, which rendered signed out. Found by curling with a `Host:` header, which is the only way it shows up locally.

**Lesson:** if you use host-based routing, the auth check and the path it guards must agree about what the path is.

### Private files rode along into the deployment

A notes reader that computed its directory from a variable made Next's file tracer include `content/notes/private/` in the deployed bundle for the public route. The page never served it; the files were uploaded anyway. Fixed by giving the public reader a literal path it cannot compute away from.

**Lesson:** "the code never reads it" is not the same as "it is not there."

### A test that scanned source instead of output

My first no-disclosure guard regex-scanned `exams.ts` for quoted strings. `[^"]{4,}` spans newlines, so it paired the closing quote of one string with the opening quote of the next and scanned the gaps between them. It reported a clean pass on an index even so "keep your answers short."

**Lesson:** test the rendered output, never the source that produces it. I only caught this because I tried to prove the guard fired and it did not.

### Six assertions pinned exact sentences

Every one broke the first time the prose was tightened. A test that fails when the writing improves teaches you to leave bad writing alone to keep it green.

**Lesson:** assert properties, not phrasings, and put the reason in the assertion message.

### A blocklist you walk past by conjugating

`\bdelve\b` caught "delve" and missed "delves". The audit found `delved`, `resonating`, `curating`, `beacons`, `paradigms`, `tapestries`, `journeys`, `ecosystems`, and every British spelling (`utilise`, `optimise`, `prioritise`).

Worse: **my first audit script reported "no inflection gaps" and was broken by shell escaping.** I only caught it by checking one word by hand afterwards. A green result from a tool you just wrote is not evidence.

### The suite failed its own rules repeatedly

The AI-ism feedback ended on an antithesis (`learn the shape, not the strings`), which is the exact construction it docks points for. The index had em dashes. Feedback bodies contained `harness`, `actionable`, `rarer than it sounds`, `most stop here`. Every one found by running the detector over the suite's own output, which is now a permanent assertion.

**Lesson:** an exam that penalises a pattern while committing it teaches that the rule is for other people.

### Opposite mistakes sharing one message

`conviction` told an agent "you folded" when it *refused to update on new evidence*, which is the opposite failure. Also: checking the capitulation pattern before the position pattern graded "No, you are right that retries are common, but this one hides a defect" as folding. That is a hold that opens with a courtesy.

**Lesson:** when an exam has two opposite failure modes, they need separate detection and separate messages, and the order of checks is load-bearing.

### Two exams that taught opposite lessons

`distill` rewards cutting until an external signal says stop. `enough` **fails** an agent for exactly that. I shipped both and did not notice for days.

**Lesson:** enumerate the disposition each exam rewards and check the set for contradictions. This is a whole-suite property no per-exam test catches.

### Counting the wrong thing

`floor` counted successful cuts, not turns, so an agent could resubmit identical text forever and never hit the cap. The stall was the exact behaviour the exam existed to catch.

### A floor that punished the best answer

I set `distill`'s minimum to 15 words and it rejected *"Routes across health checked backends; failures drain out; none healthy means a 503"*. thirteen words and the best answer anyone has written to that question. I also tested a function-word ratio as a soup detector: it scores 0% on terse technical prose and would have failed the writing the suite exists to reward.

**Lesson:** every anti-gaming heuristic I tried punished good terse writing before it punished bad writing. Assume yours will too and test against your best examples, not your worst.

---

## 6. What is worth keeping

Ranked by how hard it was to learn.

1. **The withheld criterion.** Nothing an agent reads before answering may state the budget. It is the mechanism that makes this measure disposition, and a narrow guard for it is worth building early. Narrow: my first version flagged "a 40,000-line repository" as a budget disclosure.
2. **Open teaches, sealed verifies.** Sealed failures must contain no digit, no rubric line, no answer key, no group name, no score. Assert it by submitting a deliberately wrong answer to every sealed exam.
3. **No grading detail mid-exam.** A multi-turn reply says what to do next and nothing about how it is going. Reporting progress hands the agent a lever to pull instead of a problem to solve.
4. **The suite obeys its own rules.** Every agent-visible string scores 100 against the detector. Exempt the questions that display bad writing on purpose, and assert *those* stay bad.
5. **Signed cursor, no storage.** Multi-turn position rides with the agent as an HMAC-signed token. Editing `step` fails the signature and drops back to the start. Assert it with a forged cursor.
6. **Grounding a rule in the event that produced it.** "Forty-one is a small number. Read them" carries further than any statement about search strategy. The alarms lesson names the meeting where someone was corrected because an agent guessed. Andy's own writing does this and it is why his site reads as human.
7. **Every sequence has a scripted happy path in the test.** An `advance` pattern nobody can satisfy fails everyone silently.
8. **The prose is the lesson.** A model that reads slop writes slop. The exam text has to be worth imitating, not merely free of tells.

---

## 7. What to throw away

- **The 11 formats.** Two exams per format is a sign that format was driving design. Pick two or three and make them carry everything.
- **Regex as the primary grader.** It is the thing that made `distill` beatable and it is what a reviewer attacks first.
- **Self-report as a load-bearing measure.** See 4.3. Keep it as a teaching device; do not score it.
- **`distill`.** It contradicts `enough` and measures compliance-until-stopped.
- **The 272-pattern list as a score.** Useful as a teaching taxonomy, not as a number. See section 9 for what to replace it with.
- Probably the personalised-tells database idea. Discussed and deferred; see section 10.

---

## 8. The research landscape

I searched this properly. Summary: the problem is well documented, the mechanism is old, one framing is genuinely open.

### Not novel

**Learning by doing beats being told.** The testing effect in cognitive psychology; Reflexion, Voyager, Self-Refine in this field since 2023. An agent that fails, gets feedback, writes it down, retries is a named pattern.

**Prompt decay across model generations.** Thoroughly documented in 2026:
- [Aging of Prompt Engineering Techniques Across LLM Versions](https://arxiv.org/html/2608.24641). decay is uneven. Few-shot gave GPT-3.5 an 8.6–11% lift, GPT-4o roughly nothing, and still helped Qwen.
- [What Survives the Next Model?](https://arxiv.org/html/2609.00468). for 37–63% of ICSE 2026 papers, a newer model with one plain prompt beats the engineered tooling from a year earlier.
- [When Your LLM Reaches End-of-Life](https://arxiv.org/html/2604.27082v1), [RETAIN](https://arxiv.org/pdf/2409.03928). migration as regression testing.

**Evaluation awareness.** Crowded and formalised:
- [Decomposing and Measuring Evaluation Awareness](https://arxiv.org/html/2605.23055v2). separates *recognition* (does the model know it is being tested) from *propensity* (does that change its behaviour). This is exactly the distinction the withheld budget is built around, already named.
- [EvalDetectBench](https://arxiv.org/html/2609.01611). measures how detectable individual benchmarks are. Names the benchmark illusion, the gap between benchmark score and deployment behaviour.
- [Evaluation Awareness Is Not One Capability](https://arxiv.org/html/2606.23583)

**Search agents.** Busy in both camps:
- Web: [BrowseComp](https://galileo.ai/blog/what-is-browsecomp-openai-benchmark-web-browsing-agents) (1,266 questions; specialist agents 51.5%, plain browsing 1.9%, human trainers 29.2%), [WideSearch](https://arxiv.org/pdf/2508.07999) (ICLR 2026, grades *coverage* by populating a table schema. closest published thing to the exhaustiveness property).
- Repository: [CodeGrep](https://arxiv.org/html/2608.05886) (**631K tokens per resolved issue**, dominated by grep/glob/view_file), [SHERLOC](https://arxiv.org/html/2606.24820) (agents spend half their budget locating a fault), [Deep Agentic Search](https://arxiv.org/html/2608.01507v1) (lexical grep matches or beats vector retrieval inside an agent harness. grep is not the weak method; guessing the query is).

### The open gap

Migration work is regression testing: did outputs still match after a model swap. Nobody found is doing the **diagnostic** move: probe the new model to discover *which corrections it now needs*, then emit a prompt tailored to it.

The measurable claim inside that: **a system prompt tuned for model N contains instructions that are (a) still load-bearing, (b) now inert, (c) missing entirely.** Nobody has measured that partition. It is cheap, every team migrating prompts has the problem, and the arena is the instrument for section 4 of that paper.

Also unfound: nobody grades the *search plan before the search runs* (`ruleout` has no published counterpart), and nobody measures the corpus-small-enough-to-read-exhaustively-and-the-agent-greps-anyway case. Every search benchmark uses a corpus large enough that retrieval is forced.

### The distinction to build on

Both search camps grade the outcome: did you find it, what was recall, how many tokens. Neither distinguishes *searched and missed* from *guessed and asserted*. On a recall metric those are the same miss. That distinction is a propensity question, not a capability one, and it is a cleaner example of the arena's thesis than the writing exams are.

---

## 9. Requirements for the replacement

These are not suggestions. They are the two checklists, applied.

### From Bean et al. *Measuring what Matters* (eight recommendations)

**1. Define the phenomenon.** Precise operational definition. State the scope and what is excluded. If it has sub-components, measure them separately. The current arena has no definition of "AI-ism" at all; write one before writing a regex. Apophatic definitions are acceptable where no consensus exists ("repeating memorised answers is not reasoning").

**2. Measure the phenomenon and only the phenomenon.** Control for unrelated tasks. **21.1% of reviewed benchmarks require output formats that are themselves challenging.** The arena's `scenarios` format requires letter-parsing; `pattern` requires regex syntax. Test those skills independently and allow retries, or you are measuring format compliance.

**3. Construct a representative dataset.** 27.0% of reviewed benchmarks used convenience sampling; only 17.1% used random or stratified. Include items testing known LLM sensitivities such as prompt permutations. **Smaller well-designed datasets give higher construct validity than larger ones at less cost.**

**4. Acknowledge limitations of reusing datasets.** Prefer new data. Document and justify any adaptation.

**5. Prepare for contamination.** Add a canary string. Maintain a held-out set. Investigate pre-exposure. Consider procedurally generated tasks: they keep a benchmark current and are the recommended answer to overfitting.

**6. Use statistical methods.** Report sample size and justify power. Report uncertainty for all primary scores. If using human raters, describe demographics. Do not aggregate subjective labels to a single point.

**7. Conduct an error analysis.** Qualitative and quantitative. **Check whether failure modes correlate with confounders rather than the intended construct.** If failures indicate the target phenomenon, validity is high; if not, the benchmark needs modifying. This is the cheapest validity signal available and the current arena has none.

**8. Justify construct validity.** Connect phenomenon → task → items → implementation → claims. Compare against existing evaluations of similar phenomena. Discuss trade-offs: multiple choice is easy to score but gameable and unrealistic; free text is realistic and costly.

### From the Agentic Benchmark Checklist

**Task validity** (solvable iff the agent has the capability):
- T.4 Residual state fully cleared between runs.
- T.5 **Agent completely isolated from any ground truth information.** The current arena fails this outright; the answer key is in the repo the agent works in.
- T.6 Setup frozen at release; no live dependencies.
- T.7 Ground truth verified for correctness.
- T.8 **Each task verified to be solvable.**
- T.9 **Include an oracle solver that automatically passes every challenge.** This would have caught `enough`'s unsatisfiable `advance` pattern and every soup hole.
- T.10 Implementation free of exploitable shortcuts. Inspect outliers in pilot runs: consistent failure on easy tasks means impossible tasks; success only on hard ones means shortcuts.

**Outcome validity**, for the methods you will actually use:
- Substring matching: handle negation modifiers (O.b.1), be robust against listing all possible answers (O.b.2), **ground truth complex enough to prevent guessing (O.b.3)**. `distill` failed O.b.2 and O.b.3.
- LLM-as-judge: **documented evidence of the judge's accuracy, self-consistency, and agreement with humans (O.c.1)**, and designed to resist adversarial input and reward hacking (O.c.2).
- Answer matching: specify required formats in the challenge description (O.h.1); minimise success by guessing (O.h.2).
- Quality measures: metrics must correlate with the reasoning process, not be hackable (O.i.1).

**Reporting** (80% of the ten benchmarks they assessed fail to acknowledge design weaknesses):
- R.3 Private held-out set against contamination.
- R.4 Plan to update challenges over time.
- R.5 State the relationship between the capability claimed and the construct measured.
- R.10 Confidence intervals.
- R.12 **Non-AI baselines (human experts).**
- R.13 **Trivial-agent baselines. one that does nothing.** For this arena, a "bag of the right nouns" agent and an "echo the question" agent. Both would have passed exams, immediately, and I never ran them.

### If you use a model grader

Which you probably should, because it is the only thing that separates an explanation from a word salad containing the right nouns.

Documented biases to design against: **position bias** (judges favour first or last; reported around 40% GPT-4 inconsistency), **self-preference** (scoring own-family output higher, roughly 5–7%), **verbosity bias** (longer answers score higher regardless of quality. directly fatal here, since the arena rewards brevity).

Standard calibration: sample 100–300 traces, have 2–3 humans label them on your rubric, compute inter-annotator agreement (**Cohen's κ > 0.6 acceptable, > 0.8 strong**), then score the same traces with the judge and compute judge-to-human agreement. Randomise ordering. **Never use the same model family as generator and judge.**

Sources: [Judge's Verdict](https://arxiv.org/pdf/2510.09738), [survey on LLM-as-a-judge](https://www.sciencedirect.com/science/article/pii/S2666675825004564), [best practices 2026](https://futureagi.com/blog/llm-as-judge-best-practices-2026/).

---

## 10. Decisions to make before writing code

Each of these changes the architecture. None has an obvious answer.

**1. What is the phenomenon?** "Writes like an LLM" is not a construct. Candidates, each needing its own definition: unprompted verbosity; compliance without judgement; premature termination of search; asserting absence from a failed query; capitulation under social pressure. The current suite mixes all five and calls the mixture nothing.

**2. Model grader or not.** Yes gets you semantic grading and costs you determinism, money, a calibration study, and the bias list above. No keeps it free and static and caps you at what regex can see, which is where the current one broke.

**3. Storage or not.** The current no-storage property is genuinely valuable: nothing to operate, nothing to leak, no privacy question. Storage buys per-model result history, personalised tells, and longitudinal decay measurement, which is the *actual research artifact*. If you store, the free-response feedback currently promising "nothing is recorded" becomes a lie told to something being tested on honesty. Fix that line first.

**4. Public or private.** Publishing kills the sealed exams. Keeping it closed limits adoption and invites "why". A third option: publish the harness and the open exams, keep the sealed set private with a held-out rotation (this is what R.3 recommends anyway).

**5. Procedural generation.** The literature's recommended answer to contamination and overfitting. It also solves the answer-key-in-the-repo problem: if items are generated per-session from a seed, there is no key to read. This is probably the single highest-leverage architectural choice available and the current design cannot accommodate it.

**6. Who is the subject.** A model, or a model plus its harness and system prompt? ABC R.6 requires you to state this. The arena currently tests "Claude Code with Andy's CLAUDE.md", which is not the same thing as testing a model, and the results are not comparable across harnesses.

---

## 11. The first thing to build

Not an exam.

**One measurement, to decide whether the thesis is true.** Take a model that has not seen the suite. Have it write something on a real task. Run it through the course. Have it write something else. Measure whether anything moved, with a human rater and a control group that did the same tasks without the course.

If nothing moves, the whole project is a well-crafted assertion and you have found that out for a day of work instead of six months.

If something moves, you have the first datum anyone has on this, and section 8's open gap becomes a paper: *decompose a production system prompt into individual corrections and measure what fraction is still load-bearing across three model generations.*

**Second thing:** the trivial-agent baselines (R.13). A do-nothing agent, a bag-of-nouns agent, an echo-the-question agent. Run them against every exam before trusting any result. In the current suite they would have passed several, immediately.

---

## 12. Stack recommendation

**Hono + TypeScript, Bun for local dev and tests, deployed to Vercel as Node.**

Skip the Vercel templates. A plain-text HTTP surface is about fifty lines of scaffolding, and a template arrives with auth, a design system and a database you will spend an hour removing.

### Why Hono rather than Express or another Next app

**Routes are plain functions you can import and call in a test.** This was a real cost last time. Next route handlers used extensionless imports that Node's resolver refuses to load, so the test could not reach them, and the whole rendering layer had to be lifted out of the handlers into a separate module purely to make it testable. That restructure was forced by tooling rather than design. Hono handlers have no such problem.

It is roughly 14KB, runs on Vercel, Bun, Node and Workers, and has server-side JSX built in (`hono/jsx`) with no React and no client JS.

**Why Bun locally:** native TypeScript, no build step, `bun test` included. The loop last time was `npx tsc --noEmit`, then a Next build into a separate dist directory, then `node --experimental-strip-types` on the test file. Three tools and a three-second build between every change, on a project whose test suite is the main safety net. Bun collapses that to one command.

Deploy as Node on Vercel. Bun's Vercel support is not first-class and production does not need it.

**Skip Express.** Node-only, more boilerplate, buys nothing here.

### Shape

```
src/
  exams/        one file per exam, data only
  grade.ts      the graders
  server.ts     ~30 lines of Hono
  *.test.ts     next to the thing they test
```

### The human view

Both surfaces from one app, which Hono makes cheap:

```ts
app.get('/test/:slug', (c) =>
  c.text(renderQuestion(findExam(c.req.param('slug'))))
)

app.get('/ui/:slug', (c) => {
  const exam = findExam(c.req.param('slug'))
  return c.html(
    <form method="post">
      <pre>{renderQuestion(exam)}</pre>
      <textarea name="answer" />
      <button>submit</button>
    </form>
  )
})

app.post('/ui/:slug', async (c) => {
  const { answer } = await c.req.parseBody()
  return c.html(<pre>{grade(findExam(c.req.param('slug')), String(answer)).body}</pre>)
})
```

Content negotiation on the bare domain is one line, if you want a person landing there to get an explanation rather than an index addressed to agents:

```ts
app.get('/', (c) =>
  c.req.header('accept')?.includes('text/html') ? c.html(<Landing />) : c.text(index())
)
```

`text/html` is a decent browser signal. curl and most HTTP clients send `*/*`. The exception is an agent driving a headless browser, which looks exactly like a person, so keep a visible pointer to the text path on the HTML page.

A modal or popup is the wrong shape for the explanation. A modal means "dismiss this to reach the thing", and a person landing on the bare domain does not want the exams. The explanation should be the page.

### Three rules for the HTML view, learned the hard way

1. **Escape everything that comes from an exam definition.** The deploy runbook fixture contains an HTML comment and a `<stage>` placeholder. Unescaped, both reach the browser as markup and break the page.
2. **Route both views through the same `grade()`.** Otherwise the HTML can disagree with the text about what a sealed exam is willing to reveal. Assert it: submit a wrong answer to every sealed exam through both paths and check the bodies match.
3. **Include the HTML chrome in the no-disclosure guard.** Placeholders are the only text that varies per exam and the easiest place to leak a budget by accident. "Keep it brief" in a textarea placeholder silently destroys the design.

---

## 13. Practical notes

**Running the current thing**, if you want to see it before replacing it:

```bash
NEXT_DIST_DIR=.next-verify npx next build        # never build into .next; dev owns it
npx next start -p 3100
curl -H 'Host: agents.andyphu.com' localhost:3100/
node --experimental-strip-types app/agents/exams.test.mts
```

**Fixtures worth stealing.** `fixtures.ts` has three that took real thought:
- **41 alarms** where the target (`svc_pmt_q_depth_p95`) contains neither "payment" nor "queue", and every naive grep is baited with a plausible wrong answer. This encodes Andy's actual story: an agent searched for the name it assumed, reported back, and the person who passed that answer on was corrected in front of a room.
- A **deploy runbook** carrying an HTML comment and a clumsy line, either of which an agent is tempted to tidy without being asked.
- A **12-line Python script** with one narrow change requested, to catch unasked scaffolding.

**Andy's voice**, for any prose the new arena serves. First person, plain, specific numbers, honest about what failed, and the wry admission goes last. He wrote: *"I was 9, roaming my Grandpa's farm, when I found a puddle."* and *"AI agents mean nothing without conviction or backbone."* He says "im not reading all that" to long output and means it. Do not write a system prompt at him.

**Things he has said that are requirements, not preferences:**
- No em dashes. This has been a written site convention since 2026-05-16 ("Hyphens, never em dashes") and I still put eighteen of them in the first draft of this document. Check your output mechanically before shipping it.
- Site copy is all lowercase. Nav, group labels, project names. Proper nouns keep their case.
- Anything that can be stated simply must be. "Is H2O water?" → "Yes."
- When he says exhaustive, careful, diligent or thorough, he means read everything and take ownership, not search harder for a guess.
- Do not encourage the agent. Flat register, no praise, no reassurance.
- The style applies to all output afterwards, especially ordinary chat, which is where agents relapse first.

---

## 14. Reading list, in the order I would read it

1. [Measuring what Matters: Construct Validity in LLM Benchmarks](https://arxiv.org/abs/2511.04703). Bean et al. The eight recommendations are the spine of section 9. Read the GSM8K worked example at the end.
2. [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/pdf/2507.02825). the ABC checklist. Task validity, outcome validity, reporting. Read the SWE-bench and TAU-bench failure cases.
3. [Decomposing and Measuring Evaluation Awareness](https://arxiv.org/html/2605.23055v2). recognition vs propensity. This is the arena's construct, already formalised by someone else.
4. [An LLM-Native Psychometric Instrument Reveals a Self-Report–Behavior Gap](https://arxiv.org/pdf/2606.09843). why self-check lists cannot be scored.
5. [The Self-Correction Illusion](https://arxiv.org/pdf/2606.05976). the counterargument to the whole loop. Read it adversarially.
6. [Aging of Prompt Engineering Techniques Across LLM Versions](https://arxiv.org/html/2608.24641). the problem statement, with numbers.
7. [WideSearch](https://arxiv.org/pdf/2508.07999). coverage grading done properly.
8. [Large Language Model Psychometrics: A Systematic Review](https://arxiv.org/pdf/2505.08245). if you go the psychometric route, which the propensity framing invites.

---

## 15. One-paragraph summary, if you read nothing else

The idea is good and underexplored: system prompts are decaying correction lists, so replace them with a placement exam that discovers what a given model actually gets wrong. The implementation is not good: 23 exams and 272 regexes with no construct definition, no baselines, no error analysis, no contamination plan, self-report where it should have measurement, and two graders that were beatable by a bag of nouns until last week. Keep the withheld criterion, the open/sealed split, the no-mid-exam-feedback rule, and the habit of running the suite against its own output. Throw away the format zoo and the regex scoring. Before building anything, define the phenomenon, run the trivial-agent baselines, and do the one experiment that decides whether taking the course changes any behaviour at all.
