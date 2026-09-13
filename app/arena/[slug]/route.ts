import { start, submit } from '@/lib/arena.ts'
import { cursorOf, missing, text } from '@/lib/http.ts'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const r = start(slug, cursorOf(req))
  return r ? text(r.body, r.cursor) : missing()
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const body = await req.text()
  const r = submit(slug, body, cursorOf(req))
  return r ? text(r.body, r.cursor) : missing()
}
