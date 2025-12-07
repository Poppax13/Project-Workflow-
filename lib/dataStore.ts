// Data store utility for managing projects, tasks, and teams in localStorage

export interface Project {
  id: string
  name: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'Todo' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  assignee: string
  dueDate: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  description: string
  members: number
  createdAt: string
}

const STORAGE_KEYS = {
  PROJECTS: 'app_projects',
  TASKS: 'app_tasks',
  TEAMS: 'app_teams'
}

// Initialize with default data if not exists
const defaultProjects: Project[] = [
  { id: '1', name: 'Website Redesign', description: 'Complete redesign of company website', status: 'In Progress', priority: 'High', dueDate: '2024-03-15', createdAt: '2024-01-10' },
  { id: '2', name: 'Mobile App Development', description: 'iOS and Android app development', status: 'Planning', priority: 'High', dueDate: '2024-04-30', createdAt: '2024-02-01' },
  { id: '3', name: 'API Integration', description: 'Third-party API integration project', status: 'Completed', priority: 'Medium', dueDate: '2024-02-20', createdAt: '2024-01-25' },
]

const defaultTasks: Task[] = [
  { id: '1', title: 'Design login page', description: 'Create modern and user-friendly login interface', status: 'In Progress', priority: 'High', assignee: 'John Doe', dueDate: '2024-03-10', createdAt: '2024-02-15' },
  { id: '2', title: 'Setup database', description: 'Configure database schema and connections', status: 'Done', priority: 'High', assignee: 'Jane Smith', dueDate: '2024-02-28', createdAt: '2024-02-01' },
  { id: '3', title: 'Write documentation', description: 'Document API endpoints and usage', status: 'Todo', priority: 'Medium', assignee: 'Mike Johnson', dueDate: '2024-03-20', createdAt: '2024-02-20' },
  { id: '4', title: 'Code review', description: 'Review pull requests from team members', status: 'In Progress', priority: 'Medium', assignee: 'Sarah Wilson', dueDate: '2024-03-05', createdAt: '2024-02-25' },
]

const defaultTeams: Team[] = [
  { id: '1', name: 'Development Team', description: 'Frontend and backend developers', members: 8, createdAt: '2024-01-15' },
  { id: '2', name: 'Design Team', description: 'UI/UX designers and creative professionals', members: 5, createdAt: '2024-01-20' },
  { id: '3', name: 'Marketing Team', description: 'Marketing and communications specialists', members: 6, createdAt: '2024-02-01' },
]

// Projects
export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') return defaultProjects
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects))
    return defaultProjects
  }
  return JSON.parse(stored)
}

export const saveProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
  window.dispatchEvent(new CustomEvent('dataStoreUpdated', { detail: { type: 'projects' } }))
}

// Tasks
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return defaultTasks
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks))
    return defaultTasks
  }
  return JSON.parse(stored)
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  window.dispatchEvent(new CustomEvent('dataStoreUpdated', { detail: { type: 'tasks' } }))
}

// Teams
export const getTeams = (): Team[] => {
  if (typeof window === 'undefined') return defaultTeams
  const stored = localStorage.getItem(STORAGE_KEYS.TEAMS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(defaultTeams))
    return defaultTeams
  }
  return JSON.parse(stored)
}

export const saveTeams = (teams: Team[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))
  window.dispatchEvent(new CustomEvent('dataStoreUpdated', { detail: { type: 'teams' } }))
}

