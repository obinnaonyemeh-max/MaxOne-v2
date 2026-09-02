import { useState } from "react"
import { ClipboardList, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAttributeMarks, type ScorecardAttribute } from "@/data/mockRetailScorecardAttributes"

interface AttributeScorecardCardProps {
  attribute: ScorecardAttribute
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function AttributeScorecardCard({ attribute, onClick, onEdit, onDelete }: AttributeScorecardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const marks = getAttributeMarks(attribute)

  return (
    <div
      onClick={onClick}
      className="flex min-h-[148px] cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
          <ClipboardList className="h-4 w-4 text-sidebar-item" />
        </div>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-sidebar-item-active"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40 p-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onEdit?.()
              }}
              className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              Edit Attribute
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onDelete?.()
              }}
              className="w-full rounded px-3 py-2 text-left text-sm text-status-danger transition-colors hover:bg-status-danger/10"
            >
              Delete Attribute
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>
          {attribute.name}
        </h3>
        <span
          className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 px-1.5 font-semibold text-gray-950"
          style={{ fontSize: "11px" }}
        >
          {marks}
        </span>
      </div>

      <p className="mt-2 font-medium text-breadcrumb-root" style={{ fontSize: "12px" }}>
        {attribute.options.length} option{attribute.options.length === 1 ? "" : "s"} • Created on{" "}
        {format(new Date(attribute.createdAt), "dd/MMM/yyyy")}
      </p>
    </div>
  )
}
