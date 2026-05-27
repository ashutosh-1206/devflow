import express from "express"

import { getUsers } from "../controllers/userController"

import authMiddleware from "../middlewares/authMiddleware"

const router = express.Router()

router.get(
  "/",
  authMiddleware,
  getUsers
)

export default router