import {
  Request,
  Response,
  NextFunction,
} from "express"

import jwt from "jsonwebtoken"

export interface AuthRequest
  extends Request {

  user?: {
  id: string
  name: string
  email: string
}
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader =
      req.headers.authorization

    if (!authHeader) {

      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    const token =
      authHeader.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: string
      name: string
      email: string
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    }

    next()

  } catch (error) {

    console.log(error)

    res.status(401).json({
      message: "Invalid token",
    })
  }
}

export default authMiddleware