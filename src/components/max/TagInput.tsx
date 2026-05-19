import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  separators?: string[]
}

export function TagInput({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  separators = [",", "Enter"],
}: TagInputProps) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const input = inputRef.current
    if (!container || !input) return
    container.scrollLeft = input.offsetLeft + input.offsetWidth - container.clientWidth
  }, [value, draft])

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !value.includes(s))
    if (parts.length === 0) return
    onChange([...value, ...parts])
    setDraft("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault()
      commit(draft)
      return
    }
    if (e.key === "Backspace" && draft === "" && value.length > 0) {
      e.preventDefault()
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex h-12 w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-md border border-input bg-input-soft px-3 transition-[color,box-shadow]",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "focus-within:border-brand-primary focus-within:ring-[2px] focus-within:ring-brand-primary/10",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-200 px-2 py-1 font-medium text-brand-dark" style={{ fontSize: "13px" }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(i)
            }}
            className="flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-gray-300 hover:text-foreground transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => {
          const next = e.target.value
          if (next.includes(",")) {
            commit(next)
          } else {
            setDraft(next)
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (draft.trim()) commit(draft) }}
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={disabled}
        className="flex-1 min-w-[80px] bg-transparent outline-none font-medium text-brand-dark placeholder:font-medium placeholder:text-gray-500" style={{ fontSize: "14px" }}
      />
    </div>
  )
}
