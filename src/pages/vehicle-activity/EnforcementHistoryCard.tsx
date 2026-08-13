interface EnforcementLog {
  type: string
  timestamp: string
}

interface EnforcementHistoryCardProps {
  count: number
  latest: EnforcementLog[]
  onViewAllClick?: () => void
  className?: string
}

export function EnforcementHistoryCard({
  count,
  latest,
  onViewAllClick,
  className,
}: EnforcementHistoryCardProps) {
  const logs = latest.slice(0, 2)

  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 500 }}>
          Enforcement History
        </h3>
        <button
          onClick={onViewAllClick}
          className="hover:underline"
          style={{ fontSize: "11px", fontWeight: 600, color: "#E88E15" }}
        >
          VIEW ALL
        </button>
      </div>

      <div className="mb-4">
        <span className="block text-breadcrumb-root mb-1" style={{ fontSize: "11px", fontWeight: 500 }}>
          Numbers of enforcement
        </span>
        <span className="text-sidebar-item-active" style={{ fontSize: "28px", fontWeight: 600 }}>
          {count}
        </span>
      </div>

      <div className="mt-auto border border-border rounded-lg p-4">
        <div className="flex flex-col gap-3">
          {logs.map((log, index) => (
            <div
              key={`${log.type}-${log.timestamp}-${index}`}
              className={index > 0 ? "pt-3 border-t border-border" : undefined}
            >
              <span className="block text-sidebar-item-active mb-1" style={{ fontSize: "15px", fontWeight: 600 }}>
                {log.type}
              </span>
              <span className="text-breadcrumb-root" style={{ fontSize: "12px" }}>
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
