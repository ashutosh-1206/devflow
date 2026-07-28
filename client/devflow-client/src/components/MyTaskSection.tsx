import MyTaskCard from "./MyTaskCard"

import type { Task } from "../types/task"

type MyTask = Task & {
  project: {
    id: string
    title: string
  }
}

interface MyTaskSectionProps {
  title: string
  tasks: MyTask[]
}

const MyTaskSection = ({
  title,
  tasks,
}: MyTaskSectionProps) => {

  return (

    <section>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

        {title === "TODO" && "📋"}

        {title === "IN_PROGRESS" && "🚀"}

        {title === "DONE" && "✅"}

        <div className="flex items-center gap-2">

          <span>
            {title.replace("_", " ")}
          </span>

          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>

        </div>

      </h2>

      <div className="space-y-4">

        {tasks.length === 0 ? (

          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 bg-slate-900/40">

            <p className="text-sm">
              No {title.replace("_", " ").toLowerCase()} tasks
            </p>

          </div>

        ) : (

          tasks.map((task) => (

            <MyTaskCard
              key={task.id}
              task={task}
            />

          ))

        )}

      </div>

    </section>

  )
}

export default MyTaskSection