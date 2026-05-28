# 🚀 DevFlow

DevFlow is a full stack collaborative project management platform designed to help teams manage projects, organize tasks, and collaborate more efficiently through a modern Kanban style workflow.

I built this project to simulate a real world SaaS application while improving my understanding of full stack development, authentication systems, database relationships, role based access control, and scalable frontend/backend architecture.

The goal was not just to build another CRUD app, but to create something that actually feels like a real collaborative workspace.

---

# ✨ Features

### 🔐 Authentication & Authorization

* JWT based authentication
* Protected routes
* Persistent login sessions
* Role based access control (Admin / Member)

### 📁 Project Management

* Create and manage projects
* Invite team members to projects
* Delete projects (Admin only)
* Project-specific collaboration system

### ✅ Task Management

* Create, edit, and delete tasks
* Drag and drop Kanban workflow
* Task priorities:

  * Low
  * Medium
  * High
* Due dates and overdue tracking
* Assign tasks to project members

### 📊 Dashboard & Analytics

* Project statistics
* Task completion tracking
* Overdue task monitoring
* High priority task insights
* Productivity overview

### 👥 Team Collaboration

* Invite registered users
* Admin/member permissions
* Team activity tracking
* Assignee filtering system

### 🔍 Search & Filtering

* Search tasks instantly
* Filter tasks by:

  * status
  * assignee
  * priority
  * overdue tasks

### 📱 Responsive UI

* Mobile friendly design
* Reusable component architecture
* Clean dark themed interface

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* Axios
* React Router DOM
* @hello-pangea/dnd

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt

---

# 📸 Screenshots

## Dashboard

![Dashboard](./client/devflow-client/public/screenshots/dashboard.png)

## Tasks Page

![Tasks](./client/devflow-client/public/screenshots/Tasks_Page.png)

## Team Collaboration

![Team](./client/devflow-client/public/screenshots/Team_Collaboration.png)

## Project Details / Kanban Board

![Project Details](./client/devflow-client/public/screenshots/Kanban_Board.png)

---

# 📂 Project Structure

```bash
devflow/
│
├── client/
│   └── devflow-client/
│
└── server/
```

---

# ⚙️ Environment Variables

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Backend `.env`

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ashutosh-1206/devflow.git
cd devflow
```

---

## 2. Install frontend dependencies

```bash
cd client/devflow-client
npm install
```

---

## 3. Install backend dependencies

```bash
cd ../../server
npm install
```

---

## 4. Configure environment variables

Create `.env` files for both frontend and backend.

---

## 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

---

## 6. Start backend server

```bash
npm run dev
```

---

## 7. Start frontend

```bash
cd ../client/devflow-client
npm run dev
```

---

# 💡 What I Learned

Building DevFlow helped me gain hands-on experience with:

* full stack application architecture
* authentication & authorization
* Prisma relationships
* protected APIs
* role based access control
* drag and drop systems
* responsive UI design
* reusable component patterns
* Git & GitHub workflows

It also taught me a lot about debugging real world issues across both frontend and backend systems.

---

# 👨‍💻 Author

Ashutosh Singh

GitHub:
https://github.com/ashutosh-1206

---