import type { ReactNode } from "react"

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

const AuthLayout = ({
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          {title}
        </h1>

        <p className="text-slate-400 text-center mb-8">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  )
}

export default AuthLayout