import { Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest } from "../middlewares/authMiddleware"

export const getProjectActivity = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = req.params.projectId as string

    const activities =
      await prisma.activityLog.findMany({
        where: {
          projectId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

    res.status(200).json({
      activities,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}