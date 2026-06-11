import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, type LucideIcon } from "lucide-react"

import { StatCard } from "@/components/max/StatCard"
import { cn } from "@/lib/utils"
import type { ConditionPart, PartCondition } from "@/data/mockAuction"

const conditionMeta: Record<
  PartCondition,
  { Icon: LucideIcon; label: string; color: string; bg: string }
> = {
  GOOD: { Icon: CheckCircle2, label: "Good", color: "text-status-success", bg: "bg-status-success" },
  FAIR: { Icon: AlertTriangle, label: "Needs Repair", color: "text-status-warning", bg: "bg-status-warning" },
  POOR: { Icon: XCircle, label: "Needs Replacement", color: "text-status-danger", bg: "bg-status-danger" },
  "N/A": { Icon: HelpCircle, label: "N/A", color: "text-gray-400", bg: "bg-gray-300" },
}

const legend: PartCondition[] = ["GOOD", "FAIR", "POOR", "N/A"]

const partIcons: Record<string, string> = {
  Engine: "/images/part_engine.svg",
  Transmission: "/images/part_transmission.svg",
  "Frame / Chassis": "/images/part_frame.svg",
  "Front Suspension": "/images/part_suspension.svg",
  "Rear Suspension": "/images/part_suspension.svg",
  "Front Brake": "/images/part_brake.svg",
  "Rear Brake": "/images/part_brake.svg",
  Tyres: "/images/part_tyres.svg",
  "Fuel Tank": "/images/part_fuel.svg",
  Exhaust: "/images/part_exhaust.svg",
  "Electrics / Wiring": "/images/part_electrics.svg",
  Instruments: "/images/part_instruments.svg",
  "Body / Fairings": "/images/part_body.svg",
  "Chain & Sprocket": "/images/part_chain.svg",
  Battery: "/images/part_battery.svg",
}

interface ConditionAssessmentProps {
  parts: ConditionPart[]
}

export function ConditionAssessment({ parts }: ConditionAssessmentProps) {
  const goodCount = parts.filter((p) => p.condition === "GOOD").length
  const total = parts.length
  const score = total ? Math.round((goodCount / total) * 100) : 0
  const scoreColor =
    score >= 80 ? "var(--color-status-success)" : score >= 50 ? "var(--color-status-warning)" : "var(--color-status-danger)"

  return (
    <div>
      <div className="max-w-xs">
        <StatCard
          title="Overall Condition Score"
          value={score}
          subtitle={`${goodCount} of ${total} parts in good condition`}
          indicatorColor={scoreColor}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {legend.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-sm", conditionMeta[c].bg)} />
            <span className="text-sm text-table-text">{conditionMeta[c].label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-4">
        {parts.map((part) => {
          const { Icon, color, bg, label } = conditionMeta[part.condition]
          const customIcon = partIcons[part.name]
          return (
            <div key={part.id} className="flex items-start gap-3 border-b border-r border-border p-4">
              {customIcon ? (
                <span
                  className={cn("mt-0.5 h-5 w-5 shrink-0", bg)}
                  style={{
                    maskImage: `url(${customIcon})`,
                    WebkitMaskImage: `url(${customIcon})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              ) : (
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", color)} />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>
                  {part.name}
                </p>
                <p className={cn("font-medium", color)} style={{ fontSize: "12px" }}>
                  {label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Assessment completed by Fleet Operations Officer · Score = (Good parts / Total assessed parts) × 100
      </p>
    </div>
  )
}
