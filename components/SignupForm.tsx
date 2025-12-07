'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (error) throw error

      // If your project requires email confirmations, Supabase will send an email.
      if (data.user) {
        setMessage('Account created successfully! Redirecting...')
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setMessage('Check your inbox for confirmation email.')
      }
    } catch (err: any) {
      setMessage(err.message || 'Error signing up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Sign up</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="text"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="email"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700 mb-2 block">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-60 transition-all hover:opacity-90"
          style={{ backgroundColor: '#2b7fff' }}
        >
          {loading ? 'Signing up...' : 'Create account'}
        </button>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('Error') || message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/log-in" className="font-semibold hover:underline" style={{ color: '#2b7fff' }}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

