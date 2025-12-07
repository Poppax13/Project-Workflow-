'use client'

import React, { useState, useEffect } from 'react'
import { getTasks, saveTasks, type Task } from '@/lib/dataStore'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(getTasks())
  }, [])

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    saveTasks(newTasks)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignee: '',
    dueDate: ''
  })

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignee: '',
        dueDate: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id 
        ? { ...t, ...formData, createdAt: t.createdAt }
        : t
      )
      updateTasks(updated)
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      updateTasks([...tasks, newTask])
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      updateTasks(tasks.filter(t => t.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700'
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      case 'Todo': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-orange-100 text-orange-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredTasks = filterStatus === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#2b7fff' }}
        >
          + Create Task
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Todo', 'In Progress', 'Done'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            style={filterStatus === status ? { backgroundColor: '#2b7fff' } : {}}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <div>Assignee: <span className="font-medium text-gray-700">{task.assignee}</span></div>
              <div>Due: {task.dueDate}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(task)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Task Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                    style={{ color: '#000000' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                  style={{ color: '#000000' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 outline-none transition-all"
                  style={{ color: '#000000' }}
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
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
