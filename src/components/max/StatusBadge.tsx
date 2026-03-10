import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type StatusVariant = "success" | "danger" | "warning" | "info" | "default" | "refurb" | "neutral"

interface StatusBadgeProps {
  variant?: StatusVariant
  children: ReactNode
  withDot?: boolean
  size?: "sm" | "md"
  className?: string
}

const variantStyles: Record<
  StatusVariant,
  { dot: string; bg: string; text: string }
> = {
  success: {
    dot: "bg-badge-active-text",
    bg: "bg-badge-active-bg",
    text: "text-badge-active-text",
  },
  danger: {
    dot: "bg-badge-inactive-text",
    bg: "bg-badge-inactive-bg",
    text: "text-badge-inactive-text",
  },
  warning: {
    dot: "bg-status-warning",
    bg: "bg-status-warning/10",
    text: "text-status-warning",
  },
  info: {
    dot: "bg-status-info",
    bg: "bg-status-info/10",
    text: "text-status-info",
  },
  default: {
    dot: "bg-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  refurb: {
    dot: "bg-[#DB2777]",
    bg: "bg-[#FDF2F8]",
    text: "text-[#DB2777]",
  },
  neutral: {
    dot: "bg-gray-500",
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
}

export function StatusBadge({
  variant = "default",
  children,
  withDot = true,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const styles = variantStyles[variant]

  const sizeStyles = {
    sm: {
      fontSize: '13px',
      paddingLeft: '8px',
      paddingRight: '12px',
      paddingTop: '4px',
      paddingBottom: '4px',
    },
    md: {
      fontSize: '13px',
      paddingLeft: '8px',
      paddingRight: '12px',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        styles.bg,
        styles.text,
        className
      )}
      style={sizeStyles[size]}
    >
      {withDot && (
        <span
          className={cn(
            "shrink-0 rounded-full h-2 w-2",
            styles.dot
          )}
        />
      )}
      {children}
    </span>
  )
}
