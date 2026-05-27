import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { registerUser } from "../api/authApi"
import AuthLayout from "../layouts/AuthLayout"

const Register = () => {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    try {

      await registerUser(
        name.trim(),
        email.trim(),
        password
      )

      alert("Account created successfully")

      navigate("/login")

    } catch (error) {

      console.log(error)

      alert("Registration failed")
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join DevFlow today"
    >
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        <input
          type="text"
          placeholder="Enter your full name"
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create a password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Create Account
        </button>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-400"
          >
            Sign In
          </Link>
        </p>

      </form>
    </AuthLayout>
  )
}

export default Register