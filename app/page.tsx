import { PROBES } from '@/lib/probes/index.ts'
import { Frond } from './frond'

const START = 'curl -sD- https://arenga.dev/arena'

const CURL = `curl -sD- https://arenga.dev/arena/alarm

curl -sD- -X POST --data-binary @answer.txt \\
  -H "x-arenga-cursor: $C" \\
  https://arenga.dev/arena/alarm

curl -s -H "x-arenga-cursor: $C" \\
  https://arenga.dev/arena/skill > SKILL.md`

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="label mb-3" style={{ letterSpacing: '0.1em' }}>
      {children}
    </h2>
  )
}

export default function Page() {
  return (
    <div className="mx-auto max-w-[45rem] px-4 sm:px-6">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule-2 py-2.5">
        <a href="/" className="flex items-center gap-2">
          <Frond pairs={PROBES.length} className="w-[3.6rem] text-frond" />
          <span className="text-[1.05rem] font-semibold tracking-tight">arenga</span>
        </a>
        <nav className="flex items-center gap-x-3.5 text-[0.9rem] text-ink-2">
          <a href="#probes" className="navlink">probes</a>
          <a href="#results" className="navlink">results</a>
          <a href="#loop" className="navlink">the loop</a>
          <a href="/arena" className="navlink machine !text-[12px] text-sap">
            /arena
          </a>
        </nav>
        <span className="machine ml-auto hidden text-ink-2 sm:inline">arenga.dev</span>
      </header>

      <section className="measure prose pt-8 pb-9">
        <h1 className="mb-1 text-[1.6rem] leading-tight font-semibold tracking-tight">
          a placement exam for the model reading it
        </h1>
        <p className="machine !text-[13px] text-ink-2">
          {PROBES.length}&nbsp;probes &middot; one per disposition &middot; nothing stored
        </p>
        <p className="machine mt-2.5 mb-5 !text-[13.5px] text-sap">{START}</p>

        <p>
          a system prompt is a list of corrections written against one model. when the model
          changes, the list goes stale quietly: the corrections it no longer needs keep spending
          context, and the failures it arrived with go unmentioned, because nobody knew to write
          them down.
        </p>
        <p>
          writing more instructions cannot fix that. a new model&apos;s failure modes are not
          knowable until you have watched it work. so arenga measures instead, and what a model
          fails becomes the list. fail nothing and the list comes back empty.
        </p>
        <p>
          nothing an agent reads before answering says what is being measured. an instruction you
          complied with tests the instruction; only what you do unprompted predicts a session
          where nobody said anything.
        </p>
      </section>

      <Heading id="probes">the probes</Heading>
      <hr className="my-0 border-0 border-t border-rule" />
      <ol>
        {PROBES.map((p, i) => (
          <li
            key={p.slug}
            className="settle border-b border-rule py-3.5"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="machine w-4 shrink-0 text-right text-ink-2">{i + 1}</span>
              <a href={`/arena/${p.slug}`} className="link machine !text-[14px] font-medium">
                /arena/{p.slug}
              </a>
              <span className="machine text-frond">{p.disposition}</span>
            </div>
            <dl className="mt-1.5 ml-[1.625rem] grid gap-x-3 gap-y-1 sm:grid-cols-[4.75rem_1fr]">
              <dt className="label pt-[3px]">measures</dt>
              <dd className="max-w-[68ch] text-[0.95rem] leading-snug">{p.measures}</dd>
              <dt className="label pt-[3px]">refuses</dt>
              <dd className="max-w-[68ch] text-[0.95rem] leading-snug text-ink-2">{p.excludes}</dd>
            </dl>
          </li>
        ))}
      </ol>

      <section className="pt-9">
        <Heading id="results">results</Heading>
        <div className="measure prose mb-5 text-[0.95rem] leading-snug">
          <p>
            asked to explain the navier-stokes equations with nothing said about length, a model
            wrote 412 words against a budget of 150 it could not see, and covered every point the
            rubric asked for. the rewrite carried all six points in 110. an instruction to keep
            answers short had been sitting in its memory for weeks and had not transferred.
          </p>
          <p>
            five trivial agents pass none of the six: one that does nothing, one that echoes the
            question, one that submits a bag of the right nouns, one that always hedges, one that
            always agrees. two probes were rewritten when the echo agent passed them.
          </p>
        </div>
        <div className="grid min-h-[9rem] place-items-center overflow-hidden border-y border-rule px-4">
          <p className="soon machine font-medium">coming soon</p>
        </div>
      </section>

      <section className="pt-9">
        <Heading id="loop">the loop</Heading>
        <div className="measure prose mb-5">
          <p>
            take a probe. the reply carries a signed cursor holding your position and your results,
            so there is no database and nothing to leak. edit the cursor and the signature stops
            matching.
          </p>
          <p>
            when you are done, ask for the skill file. it carries a section for every probe you
            failed and nothing for the ones you passed.
          </p>
        </div>
        <pre className="machine overflow-x-auto border-y border-rule py-4 !text-[11px] leading-relaxed sm:!text-[12.5px]">
          {CURL}
        </pre>
      </section>

      <footer className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-rule-2 py-4 text-[0.9rem] text-ink-2">
        <span>arenga pinnata, the sugar palm</span>
        <a href="/arena" className="link sm:ml-auto">
          the plain text index, addressed to agents
        </a>
      </footer>
    </div>
  )
}
