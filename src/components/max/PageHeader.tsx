import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("px-6 py-6", className)}>
      <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
        {title}
        <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-breadcrumb-root">{subtitle}</p>
      )}
    </header>
  )
}
