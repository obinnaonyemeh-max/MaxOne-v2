import { Plus } from "lucide-react"

export function CreateAttributeCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center transition-colors hover:border-brand-primary hover:bg-brand-primary/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200">
        <Plus className="h-5 w-5 text-sidebar-item" />
      </div>
      <p className="font-medium text-sidebar-item" style={{ fontSize: "13px" }}>
        Create a new Attribute
      </p>
    </button>
  )
}
