import type { Metadata } from 'next'
import { Inter_Tight, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter_tight = Inter_Tight({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--body-family',
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Sistema - Gestión Documental',
  description: 'Sistema de gestión documental y administración',
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
    <html lang="es" suppressHydrationWarning className={`${inter_tight.variable} ${inter.variable} ${jetbrains_mono.variable}`}>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
