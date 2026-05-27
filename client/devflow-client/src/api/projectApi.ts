import API from "./axios"

export const getProjects = async () => {

  const token = localStorage.getItem("token")

  const response = await API.get(
    "/projects",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export const createProject = async (
  title: string,
  description: string
) => {

  const response = await API.post(
    "/projects",
    {
      title,
      description,
    }
  )

  return response.data
}

export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  priority: string,
  assignedToId?: string | null,
  dueDate?: string | null
) => {

  const response = await API.post(
    "/tasks",
    {
      projectId,
      title,
      description,
      priority,
      assignedToId,
      dueDate,
    }
  )

  return response.data
}

export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {

  const response = await API.patch(
    `/tasks/${taskId}`,
    {
      status,
    }
  )

  return response.data
}

export const deleteTask = async (
  taskId: string
) => {

  const response = await API.delete(
    `/tasks/${taskId}`
  )

  return response.data
}

export const editTask = async (
  taskId: string,
  title: string,
  description: string
) => {

  const response = await API.put(
    `/tasks/${taskId}`,
    {
      title,
      description,
    }
  )

  return response.data
}

export const getProjectActivity = async (
  projectId: string
) => {

  const response = await API.get(
    `/projects/${projectId}/activity`
  )

  return response.data
}