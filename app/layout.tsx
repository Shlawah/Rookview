import type { Metadata } from 'next'
import { IBM_Plex_Mono, Fraunces, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

const fraunces = Fraunces({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif"
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'Rookview — Like GitHub but for making money',
  description: 'The membership platform where creators build sustainable income. Ship projects, grow your audience, and monetize your expertise.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
