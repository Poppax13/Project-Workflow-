import './globals.css'

export const metadata = {
  title: 'Next + Supabase Auth',
  description: 'Example app router auth using Supabase'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  )
}