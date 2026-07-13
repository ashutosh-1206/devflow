import { Request, Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest }
  from "../middlewares/authMiddleware"
import logActivity
  from "../utils/logActivity"
import { getTaskPermission }
  from "../utils/taskPermissions"  



export const createTask = async (
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
      priority,
      projectId,
      assignedToId,
      dueDate,
    } = req.body

    const projectMember =
      await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: user.id,
        },
      })

    if (!projectMember) {

      return res.status(403).json({
        message: "You are not a member of this project.",
      })
    }

    if (projectMember.role !== "ADMIN") {

      return res.status(403).json({
        message:
          "Only project admins can create tasks.",
      })
    }

    const task =
      await prisma.task.create({

        data: {
          title,
          description,
          priority,
          projectId,

          assignedToId: assignedToId || undefined,

          dueDate: dueDate
            ? new Date(dueDate)
            : undefined,
        },

        include: {
          assignedTo: true,
        },
      })

    await logActivity(
      projectId,
      user.id,
      `${user.name} created task "${title}"`
    )

    if (assignedToId) {

      const assignedUser =
        await prisma.user.findUnique({
          where: {
            id: assignedToId,
          },
        })

      if (assignedUser) {

        await logActivity(
          projectId,
          user.id,
          `${user.name} assigned task "${title}" to ${assignedUser.name}`
        )
      }
    }

    return res.status(201).json({
      message: "Task created successfully",
      task,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const updateTaskStatus = async (
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

    const taskId =
      req.params.taskId as string

    const { status } = req.body

    const permission =
      await getTaskPermission(
        taskId,
        user.id
      )

    if (!permission.task) {

      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (
      !permission.isAdmin &&
      !permission.isAssigned
    ) {

      return res.status(403).json({
        message:
          "You are not authorized to update this task.",
      })
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          status,
        },

        include: {
          assignedTo: true,
        },
      })

    await logActivity(
      permission.task.projectId,
      user.id,
      `${user.name} moved task "${permission.task.title}" to ${status}`
    )

    return res.status(200).json({
      message:
        "Task updated successfully",
      task: updatedTask,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const updateTask = async (
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

    const taskId =
      req.params.taskId as string

    const {
      title,
      description,
      assignedToId,
      dueDate,
    } = req.body

    const permission =
      await getTaskPermission(
        taskId,
        user.id
      )

    if (!permission.task) {

      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (
      !permission.isAdmin &&
      !permission.isAssigned
    ) {

      return res.status(403).json({
        message:
          "You are not authorized to update this task.",
      })
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          title,
          description,

          assignedToId:
            assignedToId === undefined
              ? permission.task.assignedToId
              : assignedToId || null,

          dueDate:
            dueDate === undefined
              ? permission.task.dueDate
              : dueDate
              ? new Date(dueDate)
              : null,
        },

        include: {
          assignedTo: true,
        },
      })

    await logActivity(
      permission.task.projectId,
      user.id,
      `${user.name} updated task "${updatedTask.title}"`
    )

    if (
      assignedToId !== undefined &&
      assignedToId !== permission.task.assignedToId
    ) {

      if (assignedToId) {

        const assignedUser =
          await prisma.user.findUnique({
            where: {
              id: assignedToId,
            },
          })

        if (assignedUser) {

          await logActivity(
            permission.task.projectId,
            user.id,
            `${user.name} reassigned task "${updatedTask.title}" to ${assignedUser.name}`
          )
        }

      } else {

        await logActivity(
          permission.task.projectId,
          user.id,
          `${user.name} removed assignee from task "${updatedTask.title}"`
        )
      }
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getAllTasks = async (
  req: Request,
  res: Response
) => {

  try {

    const tasks =
      await prisma.task.findMany({
        include: {
          assignedTo: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

    return res.status(200).json({
      tasks,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const deleteTask = async (
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

    const taskId =
      req.params.taskId as string

    const permission =
      await getTaskPermission(
        taskId,
        user.id
      )

    if (!permission.task) {

      return res.status(404).json({
        message: "Task not found",
      })
    }

    if (!permission.isAdmin) {

      return res.status(403).json({
        message:
          "Only project admins can delete tasks.",
      })
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    await logActivity(
      permission.task.projectId,
      user.id,
      `${user.name} deleted task "${permission.task.title}"`
    )

    return res.status(200).json({
      message:
        "Task deleted successfully",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}