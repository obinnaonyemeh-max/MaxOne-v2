import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ExpandableSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  onSubmit?: (query: string) => void
  className?: string
  inputClassName?: string
}

export function ExpandableSearch({
  open,
  onOpenChange,
  value,
  onValueChange,
  placeholder = "Search...",
  onSubmit,
  className,
  inputClassName,
}: ExpandableSearchProps) {
  const close = () => {
    onOpenChange(false)
    onValueChange("")
  }

  if (open) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Input
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn("h-9 w-48", inputClassName)}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Escape") close()
            if (event.key === "Enter") onSubmit?.(value)
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Close search"
          onClick={close}
        >
          <span aria-hidden>×</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 bg-gray-100 hover:bg-gray-200"
      aria-label="Search"
      onClick={() => onOpenChange(true)}
    >
      <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
    </Button>
  )
}
