import { Request, Response } from "express"
import { AuthRequest } from "../middlewares/authMiddleware"
import prisma from "../config/prisma";

export const createProject = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const user = req.user

    if (!user) {

      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    const {
      title,
      description,
    } = req.body

    const project =
      await prisma.project.create({

        data: {
          title,
          description,

          members: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },

        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      })

    res.status(201).json({
      message:
        "Project created successfully",
      project,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const projects = await prisma.project.findMany({
      include: {
        tasks: true
      }
    })

    res.json(projects)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })
  }
}

export const getProjectTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.projectId as string

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },

      include: {
        tasks: true,
      },
    })

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }

    res.status(200).json(project)

  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const inviteMember = async (
  req: Request,
  res: Response
) => {

  try {

    const projectId =
      req.params.projectId as string

    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      })
    }

    const existingMember =
      await prisma.projectMember.findFirst({
        where: {
          userId: user.id,
          projectId,
        },
      })

    if (existingMember) {

      return res.status(400).json({
        message: "User already in project",
      })
    }

    const member =
      await prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId,
        },
      })

    res.status(201).json({
      message: "Member invited successfully",
      member,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getProjectMembers = async (
  req: Request,
  res: Response
) => {

  try {

    const projectId =
      req.params.projectId as string

    const members =
      await prisma.projectMember.findMany({
        where: {
          projectId,
        },

        include: {
          user: true,
        },
      })

    res.status(200).json({
      members,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const removeMember = async (
  req: Request,
  res: Response
) => {

  try {

    const memberId =
      req.params.memberId as string

    await prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    })

    res.status(200).json({
      message:
        "Member removed successfully",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.projectId as string

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    })

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      })
    }

    await prisma.task.deleteMany({
      where: {
        projectId,
      },
    })

    await prisma.activityLog.deleteMany({
      where: {
        projectId,
      },
    })

    await prisma.projectMember.deleteMany({
      where: {
        projectId,
      },
    })

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    })

    res.status(200).json({
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}