import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import API from "../api/axios"

import type { Task } from "../types/task"

const Tasks = () => {

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("ALL")

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        const response =
          await API.get("/tasks")

        setTasks(response.data.tasks)

      } catch (error) {

        console.log(error)
      }
    }

    fetchTasks()

  }, [])

  const filteredTasks =
    tasks.filter((task) => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : task.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  const visibleTodoTasks =
    filteredTasks.filter(
      (task) => task.status === "TODO"
    )

  const visibleInProgressTasks =
    filteredTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    )

  const visibleDoneTasks =
    filteredTasks.filter(
      (task) => task.status === "DONE"
    )

  return (

    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Tasks
        </h1>

        <p className="text-slate-400">
          Track all your tasks here.
        </p>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all">

          <h2 className="text-slate-400 text-sm mb-2">
            Total Tasks
          </h2>

          <p className="text-3xl md:text-4xl font-bold">
            {filteredTasks.length}
          </p>

        </div>

        {(statusFilter === "ALL" ||
          statusFilter === "TODO") && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all">

            <h2 className="text-slate-400 text-sm mb-2">
              TODO
            </h2>

            <p className="text-3xl md:text-4xl font-bold">
              {visibleTodoTasks.length}
            </p>

          </div>

        )}

        {(statusFilter === "ALL" ||
          statusFilter === "IN_PROGRESS") && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all">

            <h2 className="text-slate-400 text-sm mb-2">
              IN PROGRESS
            </h2>

            <p className="text-3xl md:text-4xl font-bold text-yellow-500">
              {visibleInProgressTasks.length}
            </p>

          </div>

        )}

        {(statusFilter === "ALL" ||
          statusFilter === "DONE") && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all">

            <h2 className="text-slate-400 text-sm mb-2">
              DONE
            </h2>

            <p className="text-3xl md:text-4xl font-bold text-green-500">
              {visibleDoneTasks.length}
            </p>

          </div>

        )}

      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 outline-none text-white"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="w-full lg:w-60 p-3 rounded-xl bg-slate-900 border border-slate-800 outline-none text-white"
        >

          <option value="ALL">
            All
          </option>

          <option value="TODO">
            TODO
          </option>

          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>

          <option value="DONE">
            DONE
          </option>

        </select>

      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (

        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold mb-3">
            No Tasks Yet
          </h2>

          <p className="text-slate-400">
            Create tasks inside projects to see them here.
          </p>

        </div>

      )}

      {/* Tasks Grid */}
      {filteredTasks.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredTasks.map((task) => (

            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all hover:-translate-y-1"
            >

              <div className="flex items-start justify-between gap-4 mb-4">

                <h2 className="text-lg md:text-xl font-bold wrap-break-word">
                  {task.title}
                </h2>

                <span
                  className={`text-xs md:text-sm px-3 py-1 rounded-full whitespace-nowrap ${
                    task.status === "TODO"
                      ? "bg-slate-700"
                      : task.status === "IN_PROGRESS"
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                >
                  {task.status}
                </span>

              </div>

              <p className="text-slate-400 wrap-break-word">
                {task.description}
              </p>

              {task.priority && (

                <div className="mt-5">

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      task.priority === "LOW"
                        ? "bg-blue-600"
                        : task.priority === "MEDIUM"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {task.priority}
                  </span>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

      </div>

    </DashboardLayout>
  )
}

export default Tasks