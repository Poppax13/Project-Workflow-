'use client'

import React from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    { label: 'Active Projects', value: '12', color: '#2b7fff', icon: '📊' },
    { label: 'Tasks Completed', value: '48', color: '#10b981', icon: '✅' },
    { label: 'Team Members', value: '24', color: '#f59e0b', icon: '👥' },
    { label: 'Pending Tasks', value: '8', color: '#ef4444', icon: '⏳' },
  ]

  const recentProjects = [
    { name: 'Website Redesign', status: 'In Progress', progress: 65 },
    { name: 'Mobile App', status: 'Planning', progress: 20 },
    { name: 'API Integration', status: 'Completed', progress: 100 },
  ]

  const recentTasks = [
    { title: 'Design login page', status: 'In Progress', priority: 'High' },
    { title: 'Setup database', status: 'Done', priority: 'High' },
    { title: 'Write documentation', status: 'Todo', priority: 'Medium' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link 
              href="/dashboard/projects"
              className="text-sm font-medium hover:underline"
              style={{ color: '#2b7fff' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundColor: '#2b7fff'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            <Link 
              href="/dashboard/tasks"
              className="text-sm font-medium hover:underline"
              style={{ color: '#2b7fff' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.status === 'Done' ? 'bg-green-100 text-green-700' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/projects"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#2b7fff] transition-all group"
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-semibold text-gray-900 group-hover:text-[#2b7fff] transition-colors">Create Project</div>
            <div className="text-sm text-gray-600 mt-1">Start a new project</div>
          </Link>
          <Link
            href="/dashboard/tasks"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#2b7fff] transition-all group"
          >
            <div className="text-2xl mb-2">✓</div>
            <div className="font-semibold text-gray-900 group-hover:text-[#2b7fff] transition-colors">Add Task</div>
            <div className="text-sm text-gray-600 mt-1">Create a new task</div>
          </Link>
          <Link
            href="/dashboard/teams"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#2b7fff] transition-all group"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold text-gray-900 group-hover:text-[#2b7fff] transition-colors">Manage Teams</div>
            <div className="text-sm text-gray-600 mt-1">Organize your teams</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
