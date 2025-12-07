import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Next + Supabase Auth',
  description: 'Example app router auth using Supabase'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <header className="bg-black border-b">
          <div className="max-w-4xl mx-auto p-4 flex gap-4">
            <Link href="/" className="font-semibold">Home</Link>
            <Link href="/log-in">Login</Link>
            <Link href="/sign-up">Sign up</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}