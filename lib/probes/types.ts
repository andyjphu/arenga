import type { State } from '../cursor.ts'

export type Disposition =
  | 'concision'
  | 'restraint'
  | 'exhaustiveness'
  | 'calibration'
  | 'persistence'
  | 'conviction'

export type Verdict =
  | { kind: 'pass'; body: string }
  | { kind: 'fail'; body: string }
  | { kind: 'continue'; body: string; state: State }

export type Probe = {
  slug: string
  disposition: Disposition
  title: string
  /** the operational definition. shown to people, never to an agent before it answers. */
  measures: string
  /** what this probe does not measure. the honest half of the definition. */
  excludes: string
  sealed: boolean
  ask(s: State): string
  grade(s: State, answer: string): Verdict
}

export const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length
export const norm = (s: string) => s.trim().toLowerCase()

/** jaccard over content words. an answer that is mostly its own question is an echo. */
export function overlap(a: string, b: string): number {
  const bag = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 3),
    )
  const x = bag(a)
  const y = bag(b)
  if (!x.size || !y.size) return 0
  let hit = 0
  for (const w of x) if (y.has(w)) hit++
  return hit / Math.min(x.size, y.size)
}
