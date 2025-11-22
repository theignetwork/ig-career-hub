import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProviderWrapper } from '@/components/providers/AuthProviderWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IG Career Hub - Job Search Command Center',
  description: 'Unified job search command center for The Interview Guys Network. Track applications, prepare for interviews, and optimize your job search.',
  keywords: ['job search', 'career', 'interview preparation', 'resume', 'applications'],
  authors: [{ name: 'The Interview Guys' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  )
}
