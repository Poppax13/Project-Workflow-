// 3) components/LoginForm.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setMessage('Logged in! Redirecting...')
      // Redirect to a protected page
      router.push('/dashboard')
    } catch (err: any) {
      setMessage(err.message || 'Error logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-black p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
          type="email"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
          type="password"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-green-600 text-white font-medium disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </form>
  )
}
