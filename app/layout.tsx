import type { Metadata } from 'next'
import { Literata, Geist_Mono } from 'next/font/google'
import './globals.css'

const prose = Literata({ variable: '--font-prose', subsets: ['latin'] })
const machine = Geist_Mono({ variable: '--font-machine', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'arenga',
  description:
    'a placement exam for the model reading it, and a generator for the correction list it turns out to need.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${prose.variable} ${machine.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
