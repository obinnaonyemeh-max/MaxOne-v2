import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 resize-none rounded-md border border-input bg-[#F8F8F8] px-3 py-2 text-base font-medium text-[#121314] transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:font-medium placeholder:text-[#888989] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-brand-primary focus-visible:ring-[2px] focus-visible:ring-brand-primary/10",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
