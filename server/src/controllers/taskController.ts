import { Request, Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest }
  from "../middlewares/authMiddleware"
import logActivity
  from "../utils/logActivity"

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

    res.status(201).json({
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

    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      })

    if (!existingTask) {

      return res.status(404).json({
        message: "Task not found",
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
      existingTask.projectId,
      user.id,
      `${user.name} moved task "${existingTask.title}" to ${status}`
    )

    res.status(200).json({
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

    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignedTo: true,
        },
      })

    if (!existingTask) {

      return res.status(404).json({
        message: "Task not found",
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
              ? existingTask.assignedToId
              : assignedToId || null,

          dueDate:
            dueDate === undefined
              ? existingTask.dueDate
              : dueDate
              ? new Date(dueDate)
              : null,
        },

        include: {
          assignedTo: true,
        },
      })

    await logActivity(
      existingTask.projectId,
      user.id,
      `${user.name} updated task "${updatedTask.title}"`
    )

    if (
      assignedToId !== undefined &&
      assignedToId !== existingTask.assignedToId
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
            existingTask.projectId,
            user.id,
            `${user.name} reassigned task "${updatedTask.title}" to ${assignedUser.name}`
          )
        }

      } else {

        await logActivity(
          existingTask.projectId,
          user.id,
          `${user.name} removed assignee from task "${updatedTask.title}"`
        )
      }
    }

    res.status(200).json({
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

    res.status(200).json({
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

    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      })

    if (!existingTask) {

      return res.status(404).json({
        message: "Task not found",
      })
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    await logActivity(
      existingTask.projectId,
      user.id,
      `${user.name} deleted task "${existingTask.title}"`
    )

    res.status(200).json({
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