'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [memberSince, setMemberSince] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        setProfileMessage(error.message)
        setLoadingUser(false)
        return
      }

      const user = data.user
      if (user) {
        setUserEmail(user.email ?? '')
        setFullName((user.user_metadata as Record<string, unknown>)?.full_name as string || '')
        setMemberSince(user.created_at ? new Date(user.created_at).toLocaleDateString() : null)
      }
      setLoadingUser(false)
    }

    loadUser()
  }, [])

  const initial = useMemo(() => {
    if (fullName) return fullName.charAt(0).toUpperCase()
    if (userEmail) return userEmail.charAt(0).toUpperCase()
    return 'M'
  }, [fullName, userEmail])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMessage(null)

    const { error } = await supabase.auth.updateUser({
      email: userEmail,
      data: { full_name: fullName }
    })

    if (error) {
      setProfileMessage(error.message)
    } else {
      setProfileMessage('Profile updated. Check your inbox if you changed your email.')
    }

    setSavingProfile(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.')
      return
    }

    setSavingPassword(true)

    if (userEmail && currentPassword) {
      // Re-authenticate to ensure the current password is correct
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword
      })

      if (reauthError) {
        setPasswordMessage('Current password is incorrect.')
        setSavingPassword(false)
        return
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordMessage(error.message)
    } else {
      setPasswordMessage('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }

    setSavingPassword(false)
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Security</h1>
        <p className="text-gray-600 mt-1">Manage your account details and credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-md"
                style={{
                  backgroundColor: '#2b7fff',
                  background: 'linear-gradient(135deg, #2b7fff 0%, #1a5fcc 100%)'
                }}
              >
                {initial}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{fullName || 'Your name'}</div>
                <div className="text-sm text-gray-600">{userEmail}</div>
                {memberSince && <div className="text-xs text-gray-500 mt-1">Member since {memberSince}</div>}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="text-gray-500">Status</div>
                <div className="text-gray-900 font-semibold">Active</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="text-gray-500">Security</div>
                <div className="text-gray-900 font-semibold">Password</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Account information</h2>
                <p className="text-sm text-gray-600">Update your profile details and email.</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                    placeholder="Enter your full name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Email</span>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#2b7fff' }}
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </button>
                {profileMessage && (
                  <p className={`text-sm self-center ${profileMessage.includes('updated') ? 'text-green-600' : 'text-red-600'}`}>
                    {profileMessage}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Change password</h2>
              <p className="text-sm text-gray-600">Keep your account secure with a strong password.</p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Current password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                    placeholder="••••••••"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>New password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                    placeholder="At least 6 characters"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-2 block" style={{ color: '#000000' }}>Confirm new password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                    placeholder="Repeat new password"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#2b7fff' }}
                  disabled={savingPassword}
                >
                  {savingPassword ? 'Updating...' : 'Update password'}
                </button>
                {passwordMessage && (
                  <p className={`text-sm self-center ${passwordMessage.toLowerCase().includes('updated') ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

