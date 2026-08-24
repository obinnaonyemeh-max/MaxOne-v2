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
      role="status"
      data-type={variant}
      className={cn("max-toast max-toast-custom", className)}
    >
      <span className="max-toast-title">{message}</span>
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
