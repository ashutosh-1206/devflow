import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import API from "../api/axios"

import TaskColumn from "../components/TaskColumn"
import MemberCard from "../components/MemberCard"
import ActivityFeed from "../components/ActivityFeed"

import type { Task } from "../types/task"

import toast from "react-hot-toast"

import {
  DragDropContext,
} from "@hello-pangea/dnd"

import type {
  DropResult,
} from "@hello-pangea/dnd"

import {
  createTask,
  updateTaskStatus,
  deleteTask,
  editTask,
} from "../api/projectApi"

import type { Member }
  from "../types/member"

const ProjectDetails = () => {

  const { projectId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [members, setMembers] =
    useState<Member[]>([])

  const [allUsers, setAllUsers] =
    useState<
      {
        id: string
        name: string
        email: string
      }[]
    >([])

  const [currentUserRole, setCurrentUserRole] =
    useState("")

  const [title, setTitle] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [memberEmail, setMemberEmail] =
    useState("")

  const [priority, setPriority] =
    useState("MEDIUM")

  const [assignedToId, setAssignedToId] =
    useState("")

  const [dueDate, setDueDate] =
    useState("")

  const [searchQuery, setSearchQuery] =
    useState("")

  const [priorityFilter, setPriorityFilter] =
    useState("ALL")

  const [assigneeFilter, setAssigneeFilter] =
    useState("ALL")

  const [showOverdueOnly, setShowOverdueOnly] =
    useState(false)

  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null)

  const [editTitle, setEditTitle] =
    useState("")

  const [editDescription, setEditDescription] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {

  const fetchData = async () => {

    try {

      const response = await API.get(
        `/projects/${projectId}/tasks`
      )

      setTasks(response.data.tasks)

      const membersResponse =
        await API.get(
          `/projects/${projectId}/members`
        )

      const projectMembers =
        membersResponse.data.members ||
        membersResponse.data ||
        []

      setMembers(projectMembers)

      const userData =
        localStorage.getItem("user")

      if (userData) {

        const currentUser =
          JSON.parse(userData)

        const currentMember =
          projectMembers.find(
            (member: Member) =>
              member.user.email === currentUser.email
          )

        if (currentMember) {
          setCurrentUserRole(currentMember.role)
        }
      }

      try {

        const usersResponse =
          await API.get("/users")

        const fetchedUsers =
          usersResponse.data.users ||
          usersResponse.data ||
          []

        console.log("Fetched users:", fetchedUsers)
        console.log("Project members:", projectMembers)

        setAllUsers(fetchedUsers)

      } catch (error) {

        console.log("Failed to fetch users", error)

        toast.error("Could not load invite users")

      }

    } catch (error) {

      console.log(error)

      toast.error("Something went wrong")
    }
  }

  fetchData()

}, [projectId])

  const handleDueDateChange = (
    value: string
  ) => {

    const numbersOnly =
      value.replace(/\D/g, "")

    const year =
      numbersOnly.slice(0, 4)

    const month =
      numbersOnly.slice(4, 6)

    const day =
      numbersOnly.slice(6, 8)

    let formattedDate = year

    if (month) {
      formattedDate += `/${month}`
    }

    if (day) {
      formattedDate += `/${day}`
    }

    setDueDate(formattedDate)
  }

  const handleCreateTask = async () => {

    if (
      !title.trim() ||
      !description.trim()
    ) {

      toast.error(
        "Please fill all fields"
      )

      return
    }

    if (
      dueDate &&
      !/^\d{4}\/\d{2}\/\d{2}$/.test(dueDate)
    ) {

      toast.error(
        "Use date format YYYY/MM/DD"
      )

      return
    }

    if (dueDate) {

      const selectedDate =
        new Date(
          dueDate.replaceAll("/", "-")
        )

      const today =
        new Date()

      selectedDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {

        toast.error(
          "Due date cannot be in the past"
        )

        return
      }
    }

    if (!projectId) return

    try {

      setLoading(true)

      await createTask(
        projectId,
        title,
        description,
        priority,
        assignedToId || null,
        dueDate
          ? dueDate.replaceAll("/", "-")
          : null
      )

      const response = await API.get(
        `/projects/${projectId}/tasks`
      )

      setTasks(response.data.tasks)

      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
      setAssignedToId("")
      setDueDate("")

      toast.success("Task created")

      setLoading(false)

    } catch (error) {

      console.log(error)

      toast.error("Something went wrong")

      setLoading(false)
    }
  }

  const handleUpdateStatus = async (
    taskId: string,
    status: string
  ) => {

    try {

      await updateTaskStatus(
        taskId,
        status
      )

      const response = await API.get(
        `/projects/${projectId}/tasks`
      )

      setTasks(response.data.tasks)

      toast.success(
        "Task status updated"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Something went wrong"
      )
    }
  }

  const handleDeleteTask = async (
    taskId: string
  ) => {

    try {

      await deleteTask(taskId)

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) =>
            task.id !== taskId
        )
      )

      toast.success("Task deleted")

    } catch (error) {

      console.log(error)

      toast.error(
        "Something went wrong"
      )
    }
  }

  const handleEditTask = async (
    taskId: string
  ) => {

    try {

      await editTask(
        taskId,
        editTitle,
        editDescription
      )

      const response = await API.get(
        `/projects/${projectId}/tasks`
      )

      setTasks(response.data.tasks)

      setEditingTaskId(null)

      setEditTitle("")
      setEditDescription("")

      toast.success("Task updated")

    } catch (error) {

      console.log(error)

      toast.error(
        "Something went wrong"
      )
    }
  }

  const handleInviteMember =
    async () => {

      if (!memberEmail.trim()) {

        toast.error(
          "Please select a user"
        )

        return
      }

      try {

        await API.post(
          `/projects/${projectId}/members`,
          {
            email: memberEmail,
          }
        )

        const membersResponse =
          await API.get(
            `/projects/${projectId}/members`
          )

        setMembers(
          membersResponse.data.members ||
          membersResponse.data ||
          []
        )

        toast.success(
          "Member invited!"
        )

        setMemberEmail("")

      } catch (error) {

        console.log(error)

        toast.error(
          "Failed to invite member"
        )
      }
    }

  const handleRemoveMember = async (
    memberId: string
  ) => {

    try {

      await API.delete(
        `/projects/${projectId}/members/${memberId}`
      )

      setMembers((prevMembers) =>
        prevMembers.filter(
          (member) =>
            member.id !== memberId
        )
      )

      toast.success(
        "Member removed"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to remove member"
      )
    }
  }

  const handleDeleteProject = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    )

    if (!confirmed) return

    try {

      await API.delete(
        `/projects/${projectId}`
      )

      toast.success(
        "Project deleted successfully"
      )

      navigate("/projects")

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to delete project"
      )
    }
  }

  const handleDragEnd = async (
    result: DropResult
  ) => {

    if (!result.destination) return

    if (
      result.destination.droppableId ===
      result.source.droppableId
    ) return

    const taskId =
      result.draggableId

    const newStatus =
      result.destination.droppableId

    try {

      await updateTaskStatus(
        taskId,
        newStatus
      )

      const response = await API.get(
        `/projects/${projectId}/tasks`
      )

      setTasks(response.data.tasks)

      toast.success(
        "Task status updated"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Something went wrong"
      )
    }
  }

  const filteredTasks =
    tasks.filter((task) => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )

      const matchesPriority =
        priorityFilter === "ALL"
          ? true
          : task.priority === priorityFilter

      const matchesAssignee =
        assigneeFilter === "ALL"
          ? true
          : task.assignedToId === assigneeFilter

      const today =
        new Date()

      today.setHours(0, 0, 0, 0)

      const due =
        task.dueDate
          ? new Date(task.dueDate)
          : null

      if (due) {
        due.setHours(0, 0, 0, 0)
      }

      const isOverdue =
        due &&
        due < today &&
        task.status !== "DONE"

      const matchesOverdue =
        showOverdueOnly
          ? isOverdue
          : true

      return (
        matchesSearch &&
        matchesPriority &&
        matchesAssignee &&
        matchesOverdue
      )
    })

  const todoTasks = filteredTasks.filter(
    (task) =>
      task.status === "TODO"
  )

  const inProgressTasks =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "IN_PROGRESS"
    )

  const doneTasks = filteredTasks.filter(
    (task) =>
      task.status === "DONE"
  )

  return (

    <DashboardLayout>

      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Project Tasks
          </h1>

          <p className="text-slate-400">
            Manage project tasks here.
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Current role: {currentUserRole}
          </p>

        </div>

        {currentUserRole === "ADMIN" && (

          <button
            onClick={handleDeleteProject}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition-all self-start md:self-auto"
          >
            Delete Project
          </button>

        )}

      </div>

      {/* Create Task Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 max-w-5xl space-y-3">

        <h2 className="text-2xl font-bold mb-6">
          Create Task
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          >

            <option
              className="bg-slate-800 text-white"
              value="LOW"
            >
              LOW
            </option>

            <option
              className="bg-slate-800 text-white"
              value="MEDIUM"
            >
              MEDIUM
            </option>

            <option
              className="bg-slate-800 text-white"
              value="HIGH"
            >
              HIGH
            </option>

          </select>

          <select
            value={assignedToId}
            onChange={(e) =>
              setAssignedToId(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          >

            <option
              className="bg-slate-800 text-white"
              value=""
            >
              Unassigned
            </option>

            {members.map((member) => (

              <option
                key={member.id}
                value={member.user.id}
                className="bg-slate-800 text-white"
              >
                {member.user.name} ({member.role})
              </option>

            ))}

          </select>

          <input
            type="text"
            placeholder="YYYY/MM/DD"
            value={dueDate}
            maxLength={10}
            onChange={(e) =>
              handleDueDateChange(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-slate-300"
          />

          <button
            onClick={
              handleCreateTask
            }
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </button>

        </div>

      </div>

      {/* Invite Members */}
      {currentUserRole === "ADMIN" && (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 max-w-5xl">

          <h2 className="text-2xl font-bold mb-6">
            Invite Team Member
          </h2>

          <div className="flex flex-col md:flex-row gap-4">

            <select
              value={memberEmail}
              onChange={(e) =>
                setMemberEmail(e.target.value)
              }
              className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
            >

              <option value="">
                Select user
              </option>

              {allUsers
                .filter(
                  (user) =>
                    !members.some(
                      (member) =>
                        member.user.email ===
                        user.email
                    )
                )
                .map((user) => (

                  <option
                    key={user.id}
                    value={user.email}
                  >
                    {user.name} ({user.email})
                  </option>

                ))}

            </select>

            <button
              onClick={handleInviteMember}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
            >
              Invite
            </button>

          </div>

        </div>

      )}

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 max-w-6xl">

        <h2 className="text-2xl font-bold mb-6">
          Search & Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          >

            <option
              value="ALL"
              className="bg-slate-800 text-white"
            >
              All Priorities
            </option>

            <option
              value="LOW"
              className="bg-slate-800 text-white"
            >
              LOW
            </option>

            <option
              value="MEDIUM"
              className="bg-slate-800 text-white"
            >
              MEDIUM
            </option>

            <option
              value="HIGH"
              className="bg-slate-800 text-white"
            >
              HIGH
            </option>

          </select>

          <select
            value={assigneeFilter}
            onChange={(e) =>
              setAssigneeFilter(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          >

            <option
              value="ALL"
              className="bg-slate-800 text-white"
            >
              All Assignees
            </option>

            {members.map((member) => (

              <option
                key={member.id}
                value={member.user.id}
                className="bg-slate-800 text-white"
              >
                {member.user.name}
              </option>

            ))}

          </select>

          <button
            onClick={() =>
              setShowOverdueOnly(
                !showOverdueOnly
              )
            }
            className={`rounded-xl px-4 py-3 font-semibold transition-all ${
              showOverdueOnly
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-800 border border-slate-700 hover:bg-slate-700"
            }`}
          >

            {showOverdueOnly
              ? "Showing Overdue"
              : "Overdue Only"}

          </button>

        </div>

      </div>

      {/* Team Members */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10 mt-2">

        <h2 className="text-2xl font-bold mb-6">
          Team Members
        </h2>

        <div className="space-y-4">

          {members.map((member) => (

            <MemberCard
              key={member.id}
              memberId={member.id}
              name={member.user.name}
              email={member.user.email}
              role={member.role}
              canRemove={currentUserRole === "ADMIN"}
              handleRemoveMember={handleRemoveMember}
            />

          ))}

        </div>

      </div>

      <h2 className="text-2xl font-bold mb-6">
        Kanban Board
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

        {/* Kanban Section */}
        <div className="xl:col-span-3">

          <DragDropContext
            onDragEnd={
              handleDragEnd
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

              <TaskColumn
                title="TODO"
                status="TODO"
                tasks={todoTasks}
                editingTaskId={
                  editingTaskId
                }
                editTitle={editTitle}
                editDescription={
                  editDescription
                }
                setEditingTaskId={
                  setEditingTaskId
                }
                setEditTitle={
                  setEditTitle
                }
                setEditDescription={
                  setEditDescription
                }
                handleEditTask={
                  handleEditTask
                }
                handleDeleteTask={
                  handleDeleteTask
                }
                handleUpdateStatus={
                  handleUpdateStatus
                }
              />

              <TaskColumn
                title="IN PROGRESS"
                status="IN_PROGRESS"
                tasks={
                  inProgressTasks
                }
                editingTaskId={
                  editingTaskId
                }
                editTitle={editTitle}
                editDescription={
                  editDescription
                }
                setEditingTaskId={
                  setEditingTaskId
                }
                setEditTitle={
                  setEditTitle
                }
                setEditDescription={
                  setEditDescription
                }
                handleEditTask={
                  handleEditTask
                }
                handleDeleteTask={
                  handleDeleteTask
                }
                handleUpdateStatus={
                  handleUpdateStatus
                }
              />

              <TaskColumn
                title="DONE"
                status="DONE"
                tasks={doneTasks}
                editingTaskId={
                  editingTaskId
                }
                editTitle={editTitle}
                editDescription={
                  editDescription
                }
                setEditingTaskId={
                  setEditingTaskId
                }
                setEditTitle={
                  setEditTitle
                }
                setEditDescription={
                  setEditDescription
                }
                handleEditTask={
                  handleEditTask
                }
                handleDeleteTask={
                  handleDeleteTask
                }
                handleUpdateStatus={
                  handleUpdateStatus
                }
              />

            </div>

          </DragDropContext>

        </div>

        {/* Activity Feed Sidebar */}
        <div className="xl:col-span-1 min-w-[320px]">

          {projectId && (

            <ActivityFeed
              projectId={projectId}
            />

          )}

        </div>

      </div>

    </DashboardLayout>
  )
}

export default ProjectDetails