import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import { useNavigate } from "react-router-dom"
import {
  getProjects,
  createProject,
} from "../api/projectApi"
import toast from "react-hot-toast"

interface Project {
  id: string
  title: string
  description: string
}

const Projects = () => {

  const [projects, setProjects] =
    useState<Project[]>([])

  const [title, setTitle] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const navigate = useNavigate()

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

  const handleCreateProject = async () => {

    if (
      !title.trim() ||
      !description.trim()
    ) {

      toast.error(
        "Please fill all fields"
      )

      return
    }

    try {

      setLoading(true)

      await createProject(
        title,
        description
      )

      const updatedProjects =
        await getProjects()

      setProjects(
        updatedProjects.projects ||
        updatedProjects ||
        []
      )

      setTitle("")
      setDescription("")

      toast.success("Project created")

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to create project"
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Projects
        </h1>

        <p className="text-slate-400">
          Manage your projects here.
        </p>

      </div>

      {/* Create Project Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 mb-8 max-w-4xl">

        <h2 className="text-2xl font-bold mb-6">
          Create New Project
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white min-h-28"
          />

          <button
            onClick={handleCreateProject}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>

        </div>

      </div>

      {/* Projects List */}
      {projects.length === 0 ? (

        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-500">
          No projects yet. Create your first project.
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {projects.map((project) => (

            <div
              key={project.id}
              onClick={() =>
                navigate(
                  `/projects/${project.id}`
                )
              }
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 cursor-pointer hover:border-blue-500 hover:-translate-y-1 transition-all"
            >

              <h2 className="text-xl md:text-2xl font-bold">
                {project.title}
              </h2>

              <p className="text-slate-400 mt-2 line-clamp-3">
                {project.description}
              </p>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  )
}

export default Projects