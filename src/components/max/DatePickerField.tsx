import type React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export interface DatePickerFieldProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  dateFormat?: string
  className?: string
  triggerClassName?: string
  disabled?: React.ComponentProps<typeof Calendar>["disabled"]
}

export function DatePickerField({
  value,
  onChange,
  placeholder = "Pick a date",
  dateFormat = "dd MMM yyyy",
  className,
  triggerClassName,
  disabled,
}: DatePickerFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start gap-2 bg-white font-normal",
            triggerClassName
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value ? format(value, dateFormat) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)} align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} disabled={disabled} />
      </PopoverContent>
    </Popover>
  )
}
