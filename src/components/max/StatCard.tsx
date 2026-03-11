import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  indicatorColor: string
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  indicatorColor,
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg transition-colors hover:border-gray-950",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="pt-2 pl-2">
        <span
          className="block h-2 w-2 rounded-full"
          style={{ backgroundColor: indicatorColor, marginBottom: "10px" }}
        />
      </div>

      <div className="px-4 pb-4">
        <span
          className="block text-gray-600 mb-2"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {title}
        </span>

        <div
          className="text-gray-950 mb-2"
          style={{ fontSize: "28px", fontWeight: 500 }}
        >
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center" style={{ gap: "6px" }}>
            {subtitle && (
              <span
                className="text-gray-500"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                {subtitle}
              </span>
            )}
            {trend && (
              <>
                {subtitle && (
                  <span
                    className="text-gray-400"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    •
                  </span>
                )}
                <div className="flex items-center" style={{ gap: "6px" }}>
                  <img
                    src={
                      trend.direction === "up"
                        ? "/images/trend_up1.svg"
                        : "/images/trend_down1.svg"
                    }
                    alt={trend.direction === "up" ? "Trending up" : "Trending down"}
                    className="h-3.5 w-3.5"
                  />
                  <span
                    className={cn(
                      trend.direction === "up"
                        ? "text-status-success"
                        : "text-status-danger"
                    )}
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {trend.value}%
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
