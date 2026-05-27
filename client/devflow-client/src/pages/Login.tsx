import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { loginUser } from "../api/authApi"

const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    try {

      const data = await loginUser(
        email,
        password
      )

      localStorage.setItem(
        "token",
        data.token
      )

      localStorage.setItem(
  "user",
  JSON.stringify(data.user)
)

      navigate("/dashboard")

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {

        console.log(error.response?.data)

        alert(
          error.response?.data?.message ||
          "Login failed"
        )

      } else {

        console.log(error)

        alert("Login failed")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black bg-white"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black bg-white"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </p>

      </form>

    </div>
  )
}

export default Login