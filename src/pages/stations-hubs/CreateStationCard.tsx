import { Plus } from "lucide-react"

interface CreateStationCardProps {
  onClick?: () => void
  label?: string
}

export function CreateStationCard({
  onClick,
  label = "Create a swap station",
}: CreateStationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[164px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/80 px-4 py-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500">
        <Plus className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </button>
  )
}
