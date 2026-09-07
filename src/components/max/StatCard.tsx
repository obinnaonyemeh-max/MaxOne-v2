import { cn } from "@/lib/utils"
import { clickableSurfaceProps } from "@/lib/clickableSurface"

interface StatCardProps {
  title: string
  value: string | number
  valueSuffix?: string
  subtitle?: string
  subtitleIndicatorColor?: string
  trend?: {
    value: number
    direction: "up" | "down"
  }
  indicatorColor: string
  onClick?: () => void
  className?: string
  contentClassName?: string
}

export function StatCard({
  title,
  value,
  valueSuffix,
  subtitle,
  subtitleIndicatorColor,
  trend,
  indicatorColor,
  onClick,
  className,
  contentClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "min-w-0 w-full flex flex-col bg-gray-25 border border-gray-200 rounded-lg transition-colors hover:border-gray-950",
        onClick && "cursor-pointer",
        className
      )}
      {...clickableSurfaceProps(onClick, title)}
    >
      <div className="pt-2 pl-2">
        <span
          className="block h-2 w-2 rounded-full"
          style={{ backgroundColor: indicatorColor, marginBottom: "10px" }}
        />
      </div>

      <div className={cn("px-4 pb-4", contentClassName)}>
        <span
          className="block text-gray-600 mb-2"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {title}
        </span>

        <div
          className="text-gray-950 mb-2"
          style={{ fontSize: "24px", fontWeight: 500 }}
        >
          {value}
          {valueSuffix && (
            <span className="ml-1 text-[20px] font-medium text-gray-400">
              {valueSuffix}
            </span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center" style={{ gap: "6px" }}>
            {subtitle && (
              <span className="flex items-center gap-1.5">
                {subtitleIndicatorColor && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: subtitleIndicatorColor }}
                    aria-hidden
                  />
                )}
                <span
                  className="text-gray-500"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  {subtitle}
                </span>
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
                        ? "text-status-success-text"
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
