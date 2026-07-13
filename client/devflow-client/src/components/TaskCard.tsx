import type { Task } from "../types/task"

interface TaskCardProps {
  task: Task
  editingTaskId: string | null
  editTitle: string
  editDescription: string
  setEditingTaskId: (
    id: string | null
  ) => void
  setEditTitle: (
    title: string
  ) => void
  setEditDescription: (
    description: string
  ) => void
  handleEditTask: (
    taskId: string
  ) => void
  handleDeleteTask: (
    taskId: string
  ) => void

  canEdit: boolean
  canDelete: boolean
  canDrag: boolean

  handleUpdateStatus: (
    taskId: string,
    status: string
  ) => void
}

const TaskCard = ({
  task,
  editingTaskId,
  editTitle,
  editDescription,
  setEditingTaskId,
  setEditTitle,
  setEditDescription,
  handleEditTask,
  handleDeleteTask,

  canEdit,
  canDelete,
  canDrag,

  handleUpdateStatus,
  }: TaskCardProps) => {

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

  const isDueToday =
    due &&
    due.getTime() === today.getTime() &&
    task.status !== "DONE"

  return (

    <div
      className={`rounded-2xl p-5 border transition-all hover:border-slate-600 ${
        isOverdue
          ? "bg-red-950/30 border-red-500"
          : isDueToday
          ? "bg-yellow-950/30 border-yellow-500"
          : "bg-slate-900 border-slate-800"
      }`}
    >

      {editingTaskId === task.id ? (

        <div className="space-y-4">

          <input
            type="text"
            value={editTitle}
            onChange={(e) =>
              setEditTitle(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          />

          <div className="flex gap-3">

            <button
              onClick={() =>
                handleEditTask(task.id)
              }
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              SAVE
            </button>

            <button
              onClick={() =>
                setEditingTaskId(null)
              }
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              CANCEL
            </button>

          </div>

        </div>

      ) : (

        <>

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <h2 className="text-lg font-bold text-white leading-snug">
                {task.title}
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    task.status === "TODO"
                      ? "bg-slate-700 text-slate-200"
                      : task.status === "IN_PROGRESS"
                      ? "bg-yellow-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {task.status}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    task.priority === "LOW"
                      ? "bg-blue-600 text-white"
                      : task.priority === "MEDIUM"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {task.priority}
                </span>

                {task.dueDate && (

                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                      isOverdue
                        ? "bg-red-600 text-white"
                        : isDueToday
                        ? "bg-yellow-600 text-white"
                        : "bg-slate-800 border border-slate-700 text-slate-300"
                    }`}
                  >
                    {isOverdue
                      ? "Overdue"
                      : isDueToday
                      ? "Due Today"
                      : `Due ${new Date(
                          task.dueDate
                        ).toLocaleDateString()}`}
                  </span>

                )}

              </div>

            </div>

          </div>

          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            {task.description}
          </p>

          {task.assignedTo ? (

            <div className="mt-4 flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-xl p-3">

              <div className="h-9 w-9 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                {task.assignedTo.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-slate-200 truncate">
                  {task.assignedTo.name}
                </p>

                <p className="text-xs text-slate-500">
                  Assigned member
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-4 bg-slate-800/80 border border-slate-700 rounded-xl p-3">

              <p className="text-sm text-slate-500">
                Unassigned
              </p>

            </div>

          )}

          <div className="flex flex-wrap gap-2 mt-6">

            {canEdit && (

            <button
              onClick={() => {

                setEditingTaskId(task.id)

                setEditTitle(task.title)

                setEditDescription(
                  task.description
                )
              }}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              EDIT
            </button>

            )}

            {canDelete && (

            <button
              onClick={() =>
                handleDeleteTask(task.id)
              }
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              DELETE
            </button>

            )}

            {canDrag && (

              <>
                {task.status !== "TODO" && (

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        task.id,
                        "TODO"
                      )
                    }
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    TODO
                  </button>

                  )}

                {task.status !== "IN_PROGRESS" && (

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        task.id,
                        "IN_PROGRESS"
                      )
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    IN PROGRESS
                  </button>

                  )}

                {task.status !== "DONE" && (

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        task.id,
                        "DONE"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    DONE
                  </button>

                  )}
              </>

            )}

          </div>

        </>

      )}

    </div>
  )
}

export default TaskCard