import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes"
import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  res.send("DevFlow API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})