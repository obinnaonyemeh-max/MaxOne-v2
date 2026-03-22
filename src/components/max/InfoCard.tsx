import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface InfoCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <div 
      className={cn("bg-gray-50 border border-gray-100 rounded-md p-5", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
        <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}
