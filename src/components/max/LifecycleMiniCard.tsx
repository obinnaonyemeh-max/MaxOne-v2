import { cn } from "@/lib/utils"

interface LifecycleMiniCardProps {
  title: string
  value: string | number
  subtitle: string
  showSla?: boolean
  titleVariant?: "default" | "warning"
  className?: string
}

export function LifecycleMiniCard({
  title,
  value,
  subtitle,
  showSla = false,
  titleVariant = "default",
  className,
}: LifecycleMiniCardProps) {
  return (
    <div
      className={cn(
        "bg-white border rounded-lg shrink-0",
        showSla ? "border-status-warning" : "border-gray-200",
        className
      )}
      style={{ padding: "16px", minWidth: "160px" }}
    >
      <span
        className={cn(
          "block mb-2",
          titleVariant === "warning" ? "text-status-warning" : "text-gray-600"
        )}
        style={{ fontSize: "13px", fontWeight: 500 }}
      >
        {title}
      </span>

      <div
        className="text-gray-950 mb-2"
        style={{ fontSize: "24px", fontWeight: 500 }}
      >
        {value}
      </div>

      <div className="flex items-center" style={{ gap: "6px" }}>
        <span
          className="text-gray-500"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {subtitle}
        </span>
        {showSla && (
          <>
            <span
              className="text-gray-400"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              •
            </span>
            <div className="flex items-center" style={{ gap: "4px" }}>
              <img
                src="/images/sla.svg"
                alt="SLA"
                className="h-3.5 w-3.5"
              />
              <span
                className="text-status-warning"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                SLA
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
