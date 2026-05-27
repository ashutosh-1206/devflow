import type { ReactNode } from "react"
import {
  NavLink,
  useNavigate,
} from "react-router-dom"

type DashboardLayoutProps = {
  children: ReactNode
}

const DashboardLayout = ({
  children,
}: DashboardLayoutProps) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean
  }) =>
    `block px-4 py-3 rounded-lg transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:translate-x-1"
    }`

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 bg-slate-900 border-b border-slate-800 p-4">

        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-bold text-blue-500">
            DevFlow
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Logout
          </button>

        </div>

        <nav className="grid grid-cols-4 gap-2 mt-4 text-sm">

          <NavLink
            to="/dashboard"
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={navLinkClass}
          >
            Projects
          </NavLink>

          <NavLink
            to="/tasks"
            className={navLinkClass}
          >
            Tasks
          </NavLink>

          <NavLink
            to="/team"
            className={navLinkClass}
          >
            Team
          </NavLink>

        </nav>

      </div>

      <div className="flex">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 bg-slate-900 border-r border-slate-800 p-6 flex-col justify-between sticky top-0 h-screen">

          <div>

            <h1 className="text-2xl font-bold text-blue-500 mb-10">
              DevFlow
            </h1>

            <nav className="space-y-2">

              <NavLink
                to="/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/projects"
                className={navLinkClass}
              >
                Projects
              </NavLink>

              <NavLink
                to="/tasks"
                className={navLinkClass}
              >
                Tasks
              </NavLink>

              <NavLink
                to="/team"
                className={navLinkClass}
              >
                Team
              </NavLink>

            </nav>

          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition-all px-4 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </aside>

        <main className="flex-1 min-w-0 p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout