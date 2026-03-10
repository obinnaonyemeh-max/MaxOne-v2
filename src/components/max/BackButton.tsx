import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  onClick?: () => void
  className?: string
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-[7px] bg-[#FAFAFA] border border-[#E5E5E6] transition-colors hover:bg-gray-200",
        className
      )}
      style={{
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px'
      }}
    >
      <ChevronLeft className="h-[18px] w-[18px] text-sidebar-item" />
    </button>
  )
}
