import { Fragment } from "react"
import { cn } from "@/lib/utils"
import { LifecycleMiniCard } from "./LifecycleMiniCard"

export interface LifecycleStage {
  title: string
  value: string | number
  subtitle: string
  showSla?: boolean
  titleVariant?: "default" | "warning"
}

interface LifecycleFlowCardProps {
  title?: string
  stages: LifecycleStage[]
  className?: string
}

export function LifecycleFlowCard({
  title = "Lifecycle Flow",
  stages,
  className,
}: LifecycleFlowCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg",
        className
      )}
    >
      <div className="px-5 pt-5 pb-4">
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
      </div>

      <div className="px-5 pb-5 overflow-x-auto">
        <div className="flex items-center" style={{ gap: "8px" }}>
          {stages.map((stage, index) => (
            <Fragment key={stage.title}>
              <LifecycleMiniCard
                title={stage.title}
                value={stage.value}
                subtitle={stage.subtitle}
                showSla={stage.showSla}
                titleVariant={stage.titleVariant}
              />
              {index < stages.length - 1 && (
                <img
                  src="/images/arrow_connector.svg"
                  alt=""
                  className="shrink-0"
                  style={{ width: "24px", height: "24px" }}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
