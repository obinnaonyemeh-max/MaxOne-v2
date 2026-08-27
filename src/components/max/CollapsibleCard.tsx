import { useState, type ReactNode } from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleCardProps {
  icon: LucideIcon
  title: string
  defaultOpen?: boolean
  helperText?: string
  children: ReactNode
}

export function CollapsibleCard({ icon: Icon, title, defaultOpen = false, helperText, children }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="flex-1 font-semibold text-sidebar-item-active text-sm">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-breadcrumb-root transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 px-5 py-4">
          {helperText && <p className="mb-3 text-xs font-medium text-breadcrumb-root">{helperText}</p>}
          {children}
        </div>
      )}
    </div>
  )
}
