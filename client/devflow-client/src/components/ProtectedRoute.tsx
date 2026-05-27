import { Navigate } from "react-router-dom"

import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ProtectedRoute = ({
  children,
}: Props) => {

  const token =
    localStorage.getItem("token")

  const user =
    localStorage.getItem("user")

  if (!token || !user) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute