type DashboardCardProps = {
  title: string
  value: string
}

const DashboardCard = ({
  title,
  value,
}: DashboardCardProps) => {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-700 transition-all hover:-translate-y-1">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-slate-400 text-sm md:text-base mb-2">
            {title}
          </h3>

          <p className="text-2xl md:text-3xl font-bold">
            {value}
          </p>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">

          <div className="h-3 w-3 rounded-full bg-blue-500" />

        </div>

      </div>

    </div>
  )
}

export default DashboardCard