import DashboardLayout from "../layouts/DashboardLayout"
import DashboardCard from "../components/DashboardCard"

import { useEffect, useState } from "react"

import { getProjects } from "../api/projectApi"

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate?: string | null
}

interface Project {
  id: string
  title: string
  description: string
  tasks?: Task[]
}

const Dashboard = () => {

  const [projects, setProjects] =
    useState<Project[]>([])

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const data = await getProjects()

        setProjects(
          data.projects ||
          data ||
          []
        )

      } catch (error) {

        console.log(error)
      }
    }

    fetchProjects()

  }, [])

  const allTasks =
    projects.flatMap(
      (project) =>
        project.tasks || []
    )

  const totalTasks =
    allTasks.length

  const completedTasks =
    allTasks.filter(
      (task) =>
        task.status === "DONE"
    ).length

  const highPriorityTasks =
    allTasks.filter(
      (task) =>
        task.priority === "HIGH"
    ).length

  const today =
    new Date()

  today.setHours(0, 0, 0, 0)

  const overdueTasks =
    allTasks.filter((task) => {

      if (
        !task.dueDate ||
        task.status === "DONE"
      ) {
        return false
      }

      const due =
        new Date(task.dueDate)

      due.setHours(0, 0, 0, 0)

      return due < today
    }).length

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        )

  return (

    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold mb-2">
          Dashboard
        </h1>

        <p className="text-slate-400">
          Project analytics and team productivity overview.
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

        <DashboardCard
          title="Total Projects"
          value={projects.length.toString()}
        />

        <DashboardCard
          title="Total Tasks"
          value={totalTasks.toString()}
        />

        <DashboardCard
          title="Completed"
          value={completedTasks.toString()}
        />

        <DashboardCard
          title="Overdue"
          value={overdueTasks.toString()}
        />

        <DashboardCard
          title="High Priority"
          value={highPriorityTasks.toString()}
        />

      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                Completion Progress
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Overall task completion across all projects.
              </p>

            </div>

            <span className="text-3xl font-bold text-blue-500">
              {completionRate}%
            </span>

          </div>

          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">

            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <div className="bg-slate-800 rounded-xl p-4">

              <p className="text-slate-500 text-sm">
                Pending
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalTasks - completedTasks}
              </p>

            </div>

            <div className="bg-slate-800 rounded-xl p-4">

              <p className="text-slate-500 text-sm">
                Completed
              </p>

              <p className="text-2xl font-bold mt-1">
                {completedTasks}
              </p>

            </div>

            <div className="bg-slate-800 rounded-xl p-4">

              <p className="text-slate-500 text-sm">
                Overdue
              </p>

              <p className="text-2xl font-bold mt-1 text-red-400">
                {overdueTasks}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Productivity Snapshot
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b border-slate-800 pb-3">

              <span className="text-slate-400">
                Active Tasks
              </span>

              <span className="font-bold">
                {totalTasks - completedTasks}
              </span>

            </div>

            <div className="flex justify-between border-b border-slate-800 pb-3">

              <span className="text-slate-400">
                High Priority
              </span>

              <span className="font-bold text-red-400">
                {highPriorityTasks}
              </span>

            </div>

            <div className="flex justify-between border-b border-slate-800 pb-3">

              <span className="text-slate-400">
                Completion Rate
              </span>

              <span className="font-bold text-blue-400">
                {completionRate}%
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">
                Projects
              </span>

              <span className="font-bold">
                {projects.length}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Recent Projects */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Recent Projects
        </h2>

        {projects.length === 0 ? (

          <p className="text-slate-500">
            No projects yet.
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {projects.map((project) => (

              <div
                key={project.id}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
              >

                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="text-slate-400 mt-1">
                  {project.description}
                </p>

                <p className="text-sm text-slate-500 mt-4">
                  {(project.tasks || []).length} tasks
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </DashboardLayout>
  )
}

export default Dashboard