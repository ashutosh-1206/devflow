import {
  useEffect,
  useState,
} from "react"

import DashboardLayout
  from "../layouts/DashboardLayout"

import MyTaskSection
  from "../components/MyTaskSection"

import { getMyTasks }
  from "../api/projectApi"

import type { Task }
  from "../types/task"

import toast from "react-hot-toast"

type MyTask = Task & {
  project: {
    id: string
    title: string
  }
}

const MyTasks = () => {

  const [tasks, setTasks] =
    useState<MyTask[]>([])

  const [loading, setLoading] =
    useState(true)

  const [filter, setFilter] =
  useState("ALL")

  useEffect(() => {

    const fetchMyTasks = async () => {

      try {

        const data =
          await getMyTasks()

        setTasks(
          data.tasks || []
        )

      } catch (error) {

        console.log(error)

        toast.error(
          "Failed to load your tasks"
        )

      } finally {

        setLoading(false)
      }
    }

    fetchMyTasks()

  }, [])

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "TODO"
    )

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "IN_PROGRESS"
    )

  const doneTasks =
    tasks.filter(
      (task) =>
        task.status === "DONE"
    )

  const overdueTasks =
    tasks.filter((task) => {

      if (
        !task.dueDate ||
        task.status === "DONE"
      ) {
        return false
      }

      const due =
        new Date(task.dueDate)

      due.setHours(0, 0, 0, 0)

      const today =
        new Date()

      today.setHours(0, 0, 0, 0)

      return due < today

    })

    const filteredTodoTasks =
      filter === "ALL" || filter === "TODO"
        ? todoTasks
        : filter === "TODAY"
        ? todoTasks.filter((task) => {

            if (!task.dueDate) return false

            const due =
              new Date(task.dueDate)

            due.setHours(0, 0, 0, 0)

            const today =
              new Date()

            today.setHours(0, 0, 0, 0)

            return (
              due.getTime() ===
              today.getTime()
            )

          })
        : filter === "OVERDUE"
        ? overdueTasks.filter(
            (task) =>
              task.status === "TODO"
          )
        : filter === "HIGH"
        ? todoTasks.filter(
            (task) =>
              task.priority === "HIGH"
          )
        : []

    const filteredInProgressTasks =
      filter === "ALL" || filter === "IN_PROGRESS"
        ? inProgressTasks
        : filter === "TODAY"
        ? inProgressTasks.filter((task) => {

            if (!task.dueDate) return false

            const due =
              new Date(task.dueDate)

            due.setHours(0, 0, 0, 0)

            const today =
              new Date()

            today.setHours(0, 0, 0, 0)

            return (
              due.getTime() ===
              today.getTime()
            )

          })
        : filter === "OVERDUE"
        ? overdueTasks.filter(
            (task) =>
              task.status ===
              "IN_PROGRESS"
          )
        : filter === "HIGH"
        ? inProgressTasks.filter(
            (task) =>
              task.priority === "HIGH"
          )
        : []

    const filteredDoneTasks =
      filter === "DONE"
        ? doneTasks
        : filter === "ALL"
        ? doneTasks
        : []

  return (

    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          My Tasks
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back 👋
        </p>

        <p className="text-slate-500 mt-1">
          You have{" "}
          <span className="text-white font-semibold">
            {todoTasks.length + inProgressTasks.length}
          </span>{" "}
          active tasks assigned to you.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">

          {[
            "ALL",
            "TODAY",
            "OVERDUE",
            "HIGH",
            "DONE",
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === item
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-800 hover:bg-slate-700 hover:-translate-y-0.5"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

        <div
          onClick={() => setFilter("TODO")}
          className={`cursor-pointer rounded-2xl p-5 transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl ${
            filter === "TODO"
              ? "bg-blue-600/20 border-blue-500"
              : "bg-slate-900 border-slate-800"
          }`}
        >

            <p className="text-slate-400 text-sm">
              📋 TODO
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {todoTasks.length}
            </h2>

        </div>

        <div
          onClick={() => setFilter("IN_PROGRESS")}
          className={`cursor-pointer rounded-2xl p-5 transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl ${
            filter === "IN_PROGRESS"
              ? "bg-blue-600/20 border-blue-500"
              : "bg-slate-900 border-slate-800"
          }`}
        >

            <p className="text-slate-400 text-sm">
              🕒 IN PROGRESS
            </p>

            <h2 className="text-3xl font-bold mt-2 text-yellow-400">
              {inProgressTasks.length}
            </h2>

        </div>

        <div
          onClick={() => setFilter("DONE")}
          className={`cursor-pointer rounded-2xl p-5 transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl ${
            filter === "DONE"
              ? "bg-blue-600/20 border-blue-500"
              : "bg-slate-900 border-slate-800"
          }`}
        >

            <p className="text-slate-400 text-sm">
              ✅ DONE
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-400">
              {doneTasks.length}
            </h2>

        </div>

        <div
          onClick={() => setFilter("OVERDUE")}
          className={`cursor-pointer rounded-2xl p-5 transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl ${
            filter === "OVERDUE"
              ? "bg-blue-600/20 border-blue-500"
              : "bg-slate-900 border-slate-800"
          }`}
        >

            <p className="text-slate-400 text-sm">
              ⏳ OVERDUE
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-400">
              {overdueTasks.length}
            </h2>

        </div>

        </div>

      {loading ? (

        <div className="text-center py-20">

          <div className="inline-block h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

          <p className="text-slate-400 mt-4">
            Loading your tasks...
          </p>

        </div>

      ) : tasks.length === 0 ? (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

          <h2 className="text-xl font-semibold mb-2">
            No assigned tasks
          </h2>

          <p className="text-slate-400">
            Tasks assigned to you will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <MyTaskSection
                title="TODO"
                tasks={filteredTodoTasks}
            />

            <MyTaskSection
              title="IN PROGRESS"
              tasks={filteredInProgressTasks}
            />

            <MyTaskSection
              title="DONE"
              tasks={filteredDoneTasks}
            />

            </div>

      )}

    </DashboardLayout>
  )
}

export default MyTasks