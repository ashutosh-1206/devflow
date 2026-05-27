import React from "react"

type InputProps = {
  label: string
  type: string
  placeholder: string
  value?: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      
      <label className="text-white text-sm">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
      />

    </div>
  )
}

export default Input