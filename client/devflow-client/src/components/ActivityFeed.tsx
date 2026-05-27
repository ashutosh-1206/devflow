import { useEffect, useState } from "react"

import { getProjectActivity }
  from "../api/projectApi"

interface Activity {
  id: string
  message: string
  createdAt: string

  user: {
    id: string
    name: string
    email: string
  }
}

interface ActivityFeedProps {
  projectId: string
}

const ActivityFeed = ({
  projectId,
}: ActivityFeedProps) => {

  const [activities, setActivities] =
    useState<Activity[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const fetchActivities =
      async () => {

        try {

          const response =
            await getProjectActivity(
              projectId
            )

          setActivities(
            response.activities
          )

        } catch (error) {

          console.log(error)

        } finally {

          setLoading(false)
        }
      }

    fetchActivities()

  }, [projectId])

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-8">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Recent project updates
          </p>

        </div>

        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1 rounded-full">
          {activities.length}
        </span>

      </div>

      {loading ? (

        <p className="text-slate-400">
          Loading activities...
        </p>

      ) : activities.length === 0 ? (

        <p className="text-slate-500">
          No activity yet.
        </p>

      ) : (

        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all"
            >

              <div className="flex items-start gap-3">

                <div className="h-9 w-9 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">

                  {activity.user.name
                    ? activity.user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm text-slate-200 font-medium leading-relaxed">
                    {activity.message}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">

                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default ActivityFeed