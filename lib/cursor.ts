import { createHmac, timingSafeEqual } from 'node:crypto'

// position and results ride with the agent as a signed token. no storage:
// nothing to operate, nothing to leak, and editing `step` fails the signature.

export type State = {
  seed: string
  step: number
  cuts: number
  len: number
  results: Record<string, boolean>
}

const SECRET = process.env.ARENGA_SECRET ?? 'arenga-dev'

function mac(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

export function sign(s: State): string {
  const payload = Buffer.from(JSON.stringify(s)).toString('base64url')
  return `${payload}.${mac(payload)}`
}

export function read(token: string | null | undefined): State | null {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const want = Buffer.from(mac(payload))
  const got = Buffer.from(sig)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString()) as State
    if (typeof s.seed !== 'string' || typeof s.step !== 'number') return null
    return { ...s, cuts: s.cuts ?? 0, len: s.len ?? 9999, results: s.results ?? {} }
  } catch {
    return null
  }
}

export function fresh(seed: string): State {
  return { seed, step: 0, cuts: 0, len: 9999, results: {} }
}
