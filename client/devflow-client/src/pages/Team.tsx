import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"

import API from "../api/axios"

import MemberCard from "../components/MemberCard"

import type { Member }
  from "../types/member"

interface Project {
  id: string
  title: string
  description?: string
}

const Team = () => {

  const [projects, setProjects] =
    useState<Project[]>([])

  const [selectedProjectId, setSelectedProjectId] =
    useState("")

  const [members, setMembers] =
    useState<Member[]>([])

  const [loadingProjects, setLoadingProjects] =
    useState(true)

  const [loadingMembers, setLoadingMembers] =
    useState(false)

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const response =
          await API.get("/projects")

        const projectData =
          response.data.projects ||
          response.data ||
          []

        setProjects(projectData)

      } catch (error) {

        console.log(error)

        setProjects([])

      } finally {

        setLoadingProjects(false)
      }
    }

    fetchProjects()

  }, [])

  useEffect(() => {

    const fetchMembers = async () => {

      if (!selectedProjectId) {

        setMembers([])

        return
      }

      try {

        setLoadingMembers(true)

        const response =
          await API.get(
            `/projects/${selectedProjectId}/members`
          )

        const memberData =
          response.data.members ||
          response.data ||
          []

        setMembers(memberData)

      } catch (error) {

        console.log(error)

        setMembers([])

      } finally {

        setLoadingMembers(false)
      }
    }

    fetchMembers()

  }, [selectedProjectId])

  return (

    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Team
        </h1>

        <p className="text-slate-400">
          View team members by project.
        </p>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 mb-8 max-w-3xl">

        <h2 className="text-2xl font-bold mb-4">
          Select Project
        </h2>

        {loadingProjects ? (

          <p className="text-slate-500">
            Loading projects...
          </p>

        ) : projects.length === 0 ? (

          <p className="text-slate-500">
            No projects found.
          </p>

        ) : (

          <select
            value={selectedProjectId}
            onChange={(e) =>
              setSelectedProjectId(
                e.target.value
              )
            }
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none text-white"
          >

            <option
              value=""
              className="bg-slate-800 text-white"
            >
              Choose a project
            </option>

            {projects.map((project) => (

              <option
                key={project.id}
                value={project.id}
                className="bg-slate-800 text-white"
              >
                {project.title}
              </option>

            ))}

          </select>

        )}

      </div>

      {selectedProjectId && (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 max-w-3xl">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                Project Members
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {members.length} members in this project
              </p>

            </div>

          </div>

          {loadingMembers ? (

            <p className="text-slate-500">
              Loading members...
            </p>

          ) : members.length === 0 ? (

            <div className="border border-dashed border-slate-700 rounded-2xl p-8 text-center">

              <p className="text-slate-500">
                No members found.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {members.map((member) => (

                <MemberCard
                  key={member.id}
                  memberId={member.id}
                  name={member.user.name}
                  email={member.user.email}
                  role={member.role}
                  handleRemoveMember={() => {}}
                />

              ))}

            </div>

          )}

        </div>

      )}

    </DashboardLayout>
  )
}

export default Team