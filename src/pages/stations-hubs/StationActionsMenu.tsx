import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type StationMenuAction =
  | "view-details"
  | "view-battery-list"
  | "view-swap-history"
  | "manage-operators"
  | "add-batteries"
  | "initiate-transfer"
  | "view-transfer-log"

const menuItems: { id: StationMenuAction; label: string }[] = [
  { id: "view-details", label: "View Swap Station Details" },
  { id: "view-battery-list", label: "View Battery List" },
  { id: "view-swap-history", label: "View Battery Swap History" },
  { id: "manage-operators", label: "Manage Operators" },
  { id: "add-batteries", label: "Add Batteries to Swap Station" },
  { id: "initiate-transfer", label: "Initiate Battery Transfer" },
  { id: "view-transfer-log", label: "View Transfer Log" },
]

interface StationActionsMenuProps {
  onAction?: (action: StationMenuAction) => void
}

export function StationActionsMenu({ onAction }: StationActionsMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Station actions"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded p-1 transition-colors hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAction?.(item.id)
              setOpen(false)
            }}
            className="w-full rounded px-3 py-2 text-left text-sm text-gray-950 transition-colors hover:bg-gray-100"
          >
            {item.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
