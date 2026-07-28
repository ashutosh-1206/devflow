import express from "express"

import {
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTask,
  getMyTasks,
} from "../controllers/taskController"

import authMiddleware
  from "../middlewares/authMiddleware"
import { getAllTasks } from "../controllers/taskController"

const router = express.Router()

router.post("/", authMiddleware, createTask)
router.get("/", authMiddleware, getAllTasks)
router.get("/my", authMiddleware, getMyTasks)
router.patch("/:taskId", authMiddleware, updateTaskStatus)
router.delete("/:taskId", authMiddleware, deleteTask)
router.put("/:taskId", authMiddleware, updateTask)

export default router