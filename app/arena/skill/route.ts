import { skill } from '@/lib/arena.ts'
import { cursorOf, text } from '@/lib/http.ts'

export const dynamic = 'force-dynamic'

export function GET(req: Request) {
  return text(skill(cursorOf(req)))
}
