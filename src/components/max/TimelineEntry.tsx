import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"
import { Clock } from "lucide-react"

export interface TimelineEntryData {
  id: string
  date: string
  status: string
  statusVariant: "success" | "warning" | "info" | "danger"
  description: {
    template: string
    highlights: Record<string, string>
  }
  actor: {
    action: string
    name: string
    avatar?: string
  }
  duration: {
    range: string
    total: string
  }
}

interface TimelineEntryProps {
  entry: TimelineEntryData
  className?: string
}

function formatDescription(
  template: string,
  highlights: Record<string, string>
): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const regex = /\{(\w+)\}/g
  let match

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="font-medium text-breadcrumb-root">
          {template.slice(lastIndex, match.index)}
        </span>
      )
    }

    const key = match[1]
    const value = highlights[key] || match[0]
    parts.push(
      <span key={`highlight-${match.index}`} className="font-medium text-sidebar-item-active">
        {value}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < template.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className="font-medium text-breadcrumb-root">
        {template.slice(lastIndex)}
      </span>
    )
  }

  return parts
}

export function TimelineEntry({ entry, className }: TimelineEntryProps) {
  return (
    <div className={cn("", className)}>
      <StatusBadge variant={entry.statusVariant} withDot>
        {entry.status}
      </StatusBadge>

      <p className="mt-3 text-sm leading-relaxed">
        {formatDescription(entry.description.template, entry.description.highlights)}
      </p>

      <div className="mt-2 flex items-center gap-1.5" style={{ fontSize: '12px' }}>
        <span className="text-breadcrumb-root font-medium">{entry.actor.action}</span>
        {entry.actor.avatar ? (
          <img
            src={entry.actor.avatar}
            alt={entry.actor.name}
            className="h-4 w-4 rounded-full object-cover"
          />
        ) : (
          <div className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[8px] font-medium text-sidebar-item">
              {entry.actor.name.charAt(0)}
            </span>
          </div>
        )}
        <span className="font-medium text-sidebar-item-active">{entry.actor.name}</span>
        <span className="text-breadcrumb-root">•</span>
        <Clock className="h-3 w-3 text-breadcrumb-root" />
        <span className="font-medium text-breadcrumb-root">
          {entry.duration.range} ({entry.duration.total})
        </span>
      </div>
    </div>
  )
}
