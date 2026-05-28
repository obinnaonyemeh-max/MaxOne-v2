import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type ToastVariant = "success" | "error"

export interface ToastProps {
  message: string | null
  variant?: ToastVariant
  className?: string
}

export function Toast({ message, variant = "success", className }: ToastProps) {
  if (!message) return null

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border bg-content-card px-4 py-3 shadow-lg",
        variant === "error" ? "border-status-danger/30" : "border-border",
        className
      )}
    >
      <img
        src={
          variant === "error"
            ? "/images/rejected.png"
            : "/images/success_Checkmark.svg"
        }
        alt={variant === "error" ? "Error" : "Success"}
        className="h-6 w-6 shrink-0"
      />
      <span
        className={cn(
          "text-sm font-medium",
          variant === "error" ? "text-status-danger" : "text-table-text"
        )}
      >
        {message}
      </span>
    </div>
  )
}

interface ToastState {
  message: string
  variant: ToastVariant
}

export function useToast(durationMs = 2500) {
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), durationMs)
    return () => clearTimeout(t)
  }, [toast, durationMs])

  const showToast = useCallback((message: string | null, variant: ToastVariant = "success") => {
    setToast(message ? { message, variant } : null)
  }, [])

  const showError = useCallback((message: string) => {
    setToast({ message, variant: "error" })
  }, [])

  return {
    message: toast?.message ?? null,
    variant: toast?.variant ?? "success",
    showToast,
    showError,
  }
}
