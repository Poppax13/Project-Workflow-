'use client'

import React, { useState, useEffect } from 'react'
import { getTeams, saveTeams, type Team } from '@/lib/dataStore'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    setTeams(getTeams())
  }, [])

  const updateTeams = (newTeams: Team[]) => {
    setTeams(newTeams)
    saveTeams(newTeams)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', members: 0 })

  const openModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team)
      setFormData({ name: team.name, description: team.description, members: team.members })
    } else {
      setEditingTeam(null)
      setFormData({ name: '', description: '', members: 0 })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTeam(null)
    setFormData({ name: '', description: '', members: 0 })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTeam) {
      const updated = teams.map(t => t.id === editingTeam.id 
        ? { ...t, ...formData, createdAt: t.createdAt }
        : t
      )
      updateTeams(updated)
    } else {
      const newTeam: Team = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      updateTeams([...teams, newTeam])
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      updateTeams(teams.filter(t => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-1">Manage your teams and members</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#2b7fff' }}
        >
          + Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{team.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{team.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{team.members} members</span>
              <span>{team.createdAt}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(team)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                  style={{ color: '#000000' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all resize-none"
                  style={{ color: '#000000' }}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Members</label>
                <input
                  type="number"
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                  style={{ color: '#000000' }}
                  min="0"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#2b7fff' }}
                >
                  {editingTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
