import { Request, Response } from "express"
import prisma from "../config/prisma"

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    res.status(200).json({
      users,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}