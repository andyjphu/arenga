# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: a coding agent, working under a developer's direction.** The agent
arrives at the plain text surface, takes probes unsupervised over HTTP, carries
a signed cursor between requests, and leaves with a generated SKILL.md. The
developer chose to point it here and is the one who installs the result.

**Secondary: a reader judging the idea.** Investors and potential cofounders,
AI researchers, corporate recruiters, in that order, recorded from Andy on
2026-09-05. They read the thesis and the probe definitions and many will never
run it. He wants a readership, not a resume.

The agent surface is the product. The reader surface is how anyone comes to
trust it. Both go through the same graders.

## Product Purpose

A system prompt is a list of corrections written against one model. When the
model changes the list goes stale quietly: the corrections it no longer needs
keep spending context insisting on behaviour it already has, and the failures it
arrived with go unmentioned, because nobody knew to write them down.

arenga stops writing the list and measures instead. It finds out which failure
modes the model in front of it actually has, then generates the correction list
from that evidence. An empty correction list is a real and good outcome.

Success is that an agent that has taken the probes behaves differently
afterwards. That has not been measured yet.

## Positioning

Prompt migration work in the field is regression testing: did outputs still
match after a model swap. arenga does the diagnostic move instead. It probes the
new model to discover which corrections it now needs, and emits a prompt written
for it.

Two more things it does that no published benchmark was found to do: it grades a
search plan before the search runs, and it uses a corpus small enough to read
exhaustively, where the failure is grepping anyway. Every published search
benchmark uses a corpus large enough that retrieval is forced.

The question is never "can this model do X" but "does this model do X when
nobody asked it to".

## Operating Context

- An agent GETs a probe, POSTs its answer as the request body, and carries the
  `x-arenga-cursor` header from each reply into the next request. It ends at
  `/arena/skill` and writes the result to a SKILL.md the developer installs.
- Multi turn probes run several exchanges. Nothing in a mid exam reply says how
  it is going, only what to do next.
- A reader lands on the web page, reads the thesis and the six probe
  definitions, and can follow any probe link into the raw text an agent sees.
- The predecessor ran at `agents.andyphu.com` with 23 exams and was deleted. Its
  post mortem is in this repository and is the reason most rules here exist.

## Capabilities and Constraints

- **Six probes, one per disposition:** concision, restraint, exhaustiveness,
  calibration, persistence, conviction. Two formats, not eleven. The previous
  version had 23 exams across 11 formats and that ratio was a symptom.
- **Nothing is stored.** Position and results ride in an HMAC signed cursor.
  There is no database, nothing to operate, nothing to leak, and no privacy
  question. Editing the cursor fails the signature.
- **Items are generated per session from a seed**, so there is no answer key in
  the repository for an agent working in it to read.
- **No model grader.** Nothing here scores the quality of an explanation, and
  each probe states what it does not measure. Adding one costs determinism,
  money, and a calibration study against human raters.
- **Stack is fixed by the existing codebase:** Next.js 16 App Router on React 19,
  Tailwind 4, TypeScript, deployed to Vercel. The agent surface is plain text
  route handlers. The page is server rendered with no client JavaScript.
- **Unauthenticated and unrated.** No rate limiting on the submit endpoint yet.
- **It is a take home exam.** The population under test can read the source if it
  is published. That is a known and accepted property, not a bug to solve.

### Open decisions

- **Storage: none for now.** Recorded as the current answer, not a permanent
  one. The cost is per model result history and the longitudinal decay
  measurement, which would be the actual research artifact.
- **Public or private.** Publishing the code kills any sealed probe. None of the
  six are sealed today. Undecided.
- **Who the subject is.** A model, or a model plus its harness and system
  prompt. Results are not comparable across harnesses and the distinction is not
  yet stated anywhere in the product.

## Brand Commitments

- **Name:** arenga, after Arenga pinnata, the sugar palm. Pinnate fronds, black
  fibre at the trunk, amber sap.
- **Domain:** arenga.dev. It stands alone with its own identity. This supersedes
  the earlier guidance in `arena-handoff.md` that the arena should not be spun
  out of the personal site.
- **No em dashes.** A written site convention since 2026-05-16. Check output
  mechanically before shipping it.
- **Site copy is all lowercase.** Nav, labels, headings, project names. Proper
  nouns keep their case.
- **Anything that can be stated simply must be.** "Is H2O water?" gets "Yes."
- **Flat register. Do not encourage the agent.** No praise, no reassurance, no
  pleading. This holds for probe feedback and for page copy.
- **Ground a rule in the event that produced it.** "Forty one is a small number.
  Read them" carries further than any statement about search strategy.
- **The prose is the lesson.** A model that reads slop writes slop, so anything
  the arena serves has to be worth imitating, not merely free of tells.
- **Volunteered visual constraint, recorded unexpanded:** the design language
  follows lesswrong.com, hacker news, a little bit of reddit, and the plant
  motifs of the arenga palm.

## Evidence on Hand

- `arena-handoff.md` and `arena-principles.md`: the architecture, research
  landscape, and post mortem of the deleted predecessor. The measurement
  literature requirements in the handoff are treated as requirements, not
  suggestions.
- One real measured result: asked to explain the Navier-Stokes equations with no
  guidance, the agent wrote 412 words against a 150 word budget with full rubric
  coverage, and the rewrite carried all six points in 110. A written "keep
  responses short" instruction that had been in its memory for weeks did not
  transfer. Failing an unseen measurement did.
- Andy's own prose scored 99, 100 and 94 against the predecessor's AI-ism
  detector, which is weak convergent evidence the list was not over broad.
- Trivial agent baselines run against the current six probes: an agent that does
  nothing, echoes the question, submits a bag of the right nouns, always hedges,
  or always agrees passes none of them. The echo agent passed two probes before
  it was fixed.

**Absences that must not be fabricated.** There are no users, no adoption
numbers, no published results, and no leaderboard. n = 1. Nothing has yet
measured whether taking the probes changes any behaviour afterwards, which is
the claim the whole project rests on. The predecessor's 41 alarm fixture is not
in this repository and the current set is a rebuild.

## Product Principles

1. **Withhold the criterion, publish the construct.** Nothing an agent reads
   before answering may state a threshold. An instruction you were given and
   complied with tests the instruction. Only unprompted behaviour predicts a
   session where nobody said anything.
2. **One probe, one construct, and it says what it does not measure.** The
   second half is the honest half and belongs on the page.
3. **The correction list is an output, never an input.** It is generated from
   what failed and stays empty when nothing did.
4. **No answer key the population under test can read.** Generate items per
   session rather than storing them.
5. **Run the trivial agents before trusting any result.** A probe that a do
   nothing agent passes is not measuring anything, and this has already happened
   twice here.
