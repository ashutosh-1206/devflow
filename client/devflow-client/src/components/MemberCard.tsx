import getInitials from "../utils/getInitials"

interface MemberCardProps {
  memberId: string
  name: string
  email: string
  role: string
  canRemove: boolean
  handleRemoveMember: (
    memberId: string
  ) => void
}

const MemberCard = ({
  memberId,
  name,
  email,
  role,
  canRemove,
  handleRemoveMember,
}: MemberCardProps) => {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">

          {getInitials(name)}

        </div>

        <div>

          <h2 className="font-semibold">
            {name}
          </h2>

          <p className="text-slate-400 text-sm">
            {email}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">

          {role}

        </span>

        {canRemove && role !== "ADMIN" && (

          <button
            onClick={() =>
              handleRemoveMember(memberId)
            }
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
          >
            Remove
          </button>

        )}

      </div>

    </div>
  )
}

export default MemberCard