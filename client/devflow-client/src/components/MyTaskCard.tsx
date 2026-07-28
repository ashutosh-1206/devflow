import type { Task } from "../types/task"

type MyTask = Task & {
  project: {
    id: string
    title: string
  }
}

interface MyTaskCardProps {
  task: MyTask
}

const MyTaskCard = ({
  task,
}: MyTaskCardProps) => {

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const due = task.dueDate
    ? new Date(task.dueDate)
    : null

    if (due) {
    due.setHours(0, 0, 0, 0)
    }

    const isOverdue =
    due &&
    due < today &&
    task.status !== "DONE"

    const isDueToday =
    due &&
    due.getTime() === today.getTime() &&
    task.status !== "DONE"

    return (

        <div
            className={`rounded-2xl p-5 border transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300 ${
                isOverdue
                ? "bg-red-950/30 border-red-500"
                : isDueToday
                ? "bg-yellow-950/30 border-yellow-500"
                : "bg-slate-900 border-slate-800"
            }`}
            >

        <h3 className="text-lg font-bold">
            {task.title}
        </h3>

        <div className="mt-3">

            <span className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">

                📁

                {task.project.title}

            </span>

        </div>

        <p className="text-sm text-slate-400 mt-4 leading-6">
            {task.description || "No description provided."}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">

            <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                task.status === "TODO"
                ? "bg-slate-700"
                : task.status === "IN_PROGRESS"
                ? "bg-yellow-600"
                : "bg-green-600"
            }`}
            >
            {task.status}
            </span>

            <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                task.priority === "LOW"
                ? "bg-blue-900 text-blue-300"
                : task.priority === "MEDIUM"
                ? "bg-yellow-900 text-yellow-300"
                : "bg-red-900 text-red-300"
            }`}
            >
            {task.priority}
            </span>

            {task.dueDate && (

                <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    isOverdue
                        ? "bg-red-600 text-white"
                        : isDueToday
                        ? "bg-yellow-600 text-white"
                        : "bg-slate-700 text-slate-200"
                    }`}
                >
                    {isOverdue
                    ? "🚨 Overdue"
                    : isDueToday
                    ? "📅 Due Today"
                    : `📅 ${new Date(
                        task.dueDate
                        ).toLocaleDateString()}`}
                </span>

                )}

        </div>

    </div>

  )
}

export default MyTaskCard