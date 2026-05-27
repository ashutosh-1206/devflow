import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import prisma from "../config/prisma"
import jwt from "jsonwebtoken"

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const { password: _, ...safeUser } = user

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    })
  }
}

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    )

    const { password: _, ...safeUser } = user

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getMe = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as Request & {
      userId?: string
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authReq.userId,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const { password: _, ...safeUser } = user

    res.status(200).json(safeUser)

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    })
  }
}