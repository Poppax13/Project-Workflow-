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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: '#2b7fff' }}
          >
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get started</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign up</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="text"
            style={{ color: '#000000' }}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="email"
            style={{ color: '#000000' }}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
            type="password"
            style={{ color: '#000000' }}
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
    </div>
  )
}

