'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>('user@example.com')
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/log-in')
      } else {
        setLoading(false)
        if (session.user?.email) {
          setUserEmail(session.user.email)
          setUserName(session.user.email.split('@')[0] || 'User')
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/log-in')
      } else {
        setLoading(false)
        if (session.user?.email) {
          setUserEmail(session.user.email)
          setUserName(session.user.email.split('@')[0] || 'User')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/log-in')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Projects', href: '/dashboard/projects', icon: '📁' },
    { name: 'Tasks', href: '/dashboard/tasks', icon: '✓' },
    { name: 'Teams', href: '/dashboard/teams', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 -mx-6 -mt-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: '#2b7fff',
                  background: 'linear-gradient(135deg, #2b7fff 0%, #1a5fcc 100%)'
                }}
              >
                M
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My App
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Project Management</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-[#2b7fff] focus-within:ring-2 focus-within:ring-[#2b7fff]/20 transition-all">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-0 outline-none text-sm text-gray-700 placeholder-gray-400 w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#2b7fff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 capitalize">{userName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: '#2b7fff',
                    background: 'linear-gradient(135deg, #2b7fff 0%, #1a5fcc 100%)'
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-all hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 min-h-[calc(100vh-81px)] sticky top-[81px] shadow-sm">
          <nav className="p-4">
            <ul className="space-y-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      style={isActive ? { 
                        backgroundColor: '#2b7fff',
                        background: 'linear-gradient(135deg, #2b7fff 0%, #1a5fcc 100%)'
                      } : {}}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

