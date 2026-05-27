export interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string

  dueDate?: string | null

  assignedToId?: string | null

  assignedTo?: {
    id: string
    name: string
    email: string
  } | null
}