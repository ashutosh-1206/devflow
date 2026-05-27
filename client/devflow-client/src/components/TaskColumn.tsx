import {
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

import TaskCard from "./TaskCard"

import type { Task } from "../types/task"

interface TaskColumnProps {
  title: string
  status: string
  tasks: Task[]

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

  handleUpdateStatus: (
    taskId: string,
    status: string
  ) => void
}

const TaskColumn = ({
  title,
  status,
  tasks,

  editingTaskId,

  editTitle,
  editDescription,

  setEditingTaskId,
  setEditTitle,
  setEditDescription,

  handleEditTask,
  handleDeleteTask,
  handleUpdateStatus,
}: TaskColumnProps) => {

  return (

    <Droppable droppableId={status}>

      {(provided) => (

        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[calc(100vh-320px)]"
        >

          <div
            className={`sticky top-6 z-10 rounded-2xl p-4 mb-4 ${
              status === "TODO"
                ? "bg-slate-800"
                : status === "IN_PROGRESS"
                ? "bg-yellow-600"
                : "bg-green-600"
            }`}
          >

            <h2 className="text-xl font-bold">
              {title}
            </h2>

          </div>

          <div className="space-y-4">

            {tasks.length === 0 && (

              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 bg-slate-900/40">

                <p className="text-sm">
                  Drop tasks here
                </p>

              </div>

            )}

            {tasks.map((task, index) => (

              <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}
                isDragDisabled={
                  editingTaskId === task.id
                }
              >

                {(provided) => (

                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >

                    <TaskCard
                      task={task}
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

                )}

              </Draggable>

            ))}

            {provided.placeholder}

          </div>

        </div>

      )}

    </Droppable>
  )
}

export default TaskColumn