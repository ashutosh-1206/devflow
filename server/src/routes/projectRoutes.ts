import express from "express"

import {
  createProject,
  getProjects,
  getProjectTasks,
  inviteMember,
  getProjectMembers,
  removeMember,
  deleteProject,
} from "../controllers/projectController"

import { getProjectActivity } from "../controllers/activityController"

import authMiddleware from "../middlewares/authMiddleware"

import requireAdmin from "../middlewares/projectRoleMiddleware"

const router = express.Router()

router.post("/", authMiddleware, createProject)

router.get("/", authMiddleware, getProjects)

router.get("/:projectId/tasks", authMiddleware, getProjectTasks)

router.post(
  "/:projectId/members",
  authMiddleware,
  requireAdmin,
  inviteMember
)

router.get(
  "/:projectId/members",
  authMiddleware,
  getProjectMembers
)

router.delete(
  "/:projectId/members/:memberId",
  authMiddleware,
  requireAdmin,
  removeMember
)

router.get(
  "/:projectId/activity",
  authMiddleware,
  getProjectActivity
)

router.delete(
  "/:projectId",
  authMiddleware,
  requireAdmin,
  deleteProject
)

export default router