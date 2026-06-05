import { useState, useRef, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
  inputClassName?: string
}

const defaultSuggestions = [
  "Allen Avenue, Ikeja, Lagos",
  "Admiralty Way, Lekki Phase 1, Lagos",
  "Adeola Odeku Street, Victoria Island, Lagos",
  "Awolowo Road, Ikoyi, Lagos",
  "Broad Street, Lagos Island, Lagos",
  "Herbert Macaulay Way, Yaba, Lagos",
  "Ikorodu Road, Maryland, Lagos",
  "Isaac John Street, GRA Ikeja, Lagos",
  "Lekki-Epe Expressway, Ajah, Lagos",
  "Mobolaji Bank Anthony Way, Ikeja, Lagos",
  "Obafemi Awolowo Way, Ikeja, Lagos",
  "Opebi Road, Ikeja, Lagos",
  "Toyin Street, Ikeja, Lagos",
  "Wuse 2, Abuja",
  "Garki Area 11, Abuja",
  "Maitama District, Abuja",
  "Aminu Kano Crescent, Wuse 2, Abuja",
  "Sabon Gari, Kano",
  "Ring Road, Ibadan",
  "Bodija Estate, Ibadan",
  "Trans Amadi, Port Harcourt",
  "GRA Phase 2, Port Harcourt",
  "Aba Road, Port Harcourt",
]

export function LocationAutocomplete({
  value,
  onChange,
  suggestions = defaultSuggestions,
  placeholder = "Search for a location...",
  className,
  inputClassName,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = value.trim()
    ? suggestions.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      )
    : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => { if (value.trim()) setIsOpen(true) }}
        placeholder={placeholder}
        className={cn("pl-9 h-9", inputClassName)}
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
          {filtered.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                onChange(loc)
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-sidebar-item-active">{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
