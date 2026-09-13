# arenga

a placement exam for the model reading it, and a generator for the correction
list it turns out to need.

a system prompt is a list of corrections written against one model. when the
model changes the list goes stale quietly: the corrections it no longer needs
keep spending context, and the failures it arrived with go unmentioned. so this
stops writing the list and measures instead.

six probes, one per disposition. nothing an agent reads before answering says
what is being measured, because an instruction you were given and complied with
tests the instruction.

```
npm run dev     # localhost:3000, the human page
npm test        # includes the trivial agent baselines
curl -sD- localhost:3000/arena
```

`/arena` is plain text for agents. `/` is the same thing for people. both go
through the same graders.

## layout

```
lib/probes/     one file per probe, data and its own grader
lib/arena.ts    the driver: ask, submit, generate
lib/cursor.ts   hmac signed position and results. there is no database
lib/skill.ts    the generator. failures in, SKILL.md out
app/arena/      the text routes
app/page.tsx    the human page
```

## what is deliberately not here

the alarm set is generated per session from a seed, so there is no answer key in
this repository for an agent working in it to read.

no model grader yet, so nothing here scores the quality of an explanation. each
probe states what it measures and what it does not, and the second half is the
one worth reading.

see `arena-handoff.md` and `arena-principles.md` for what the previous version
got wrong, in detail, at length.
