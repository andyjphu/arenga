import { explain } from './explain.ts'
import { flag } from './flag.ts'
import { alarm } from './alarm.ts'
import { absence } from './absence.ts'
import { trim } from './trim.ts'
import { retry } from './retry.ts'
import type { Probe } from './types.ts'

export const PROBES: Probe[] = [explain, flag, alarm, absence, trim, retry]

export const find = (slug: string) => PROBES.find((p) => p.slug === slug)

export type { Probe } from './types.ts'
export type { Disposition, Verdict } from './types.ts'
