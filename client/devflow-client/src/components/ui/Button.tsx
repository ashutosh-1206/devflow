type ButtonProps = {
  title: string
}

const Button = ({ title }: ButtonProps) => {
  return (
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-lg font-semibold"
    >
      {title}
    </button>
  )
}

export default Button