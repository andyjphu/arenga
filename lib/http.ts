const TEXT = { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' }

export const cursorOf = (req: Request) =>
  req.headers.get('x-arenga-cursor') ?? new URL(req.url).searchParams.get('c')

export const text = (body: string, cursor?: string) =>
  new Response(body.endsWith('\n') ? body : body + '\n', {
    headers: cursor ? { ...TEXT, 'x-arenga-cursor': cursor } : TEXT,
  })

export const missing = () => new Response('no such probe\n', { status: 404, headers: TEXT })
