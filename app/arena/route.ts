import { index } from '@/lib/arena.ts'
import { text } from '@/lib/http.ts'

export const dynamic = 'force-dynamic'

export function GET() {
  return text(index())
}
