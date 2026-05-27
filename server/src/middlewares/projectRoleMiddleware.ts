import {
  Response,
  NextFunction,
} from "express"

import prisma from "../config/prisma"

import {
  AuthRequest,
} from "./authMiddleware"

const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = req.user

    if (!user) {

      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    const projectId =
      req.params.projectId as string

    const member =
      await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: user.id,
        },
      })

    if (!member) {

      return res.status(403).json({
        message:
          "You are not a project member",
      })
    }

    if (member.role !== "ADMIN") {

      return res.status(403).json({
        message:
          "Admin access required",
      })
    }

    next()

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export default requireAdmin