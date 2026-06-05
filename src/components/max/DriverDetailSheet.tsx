import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { InfoCard } from "./InfoCard"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import {
  riskLevelVariantMap,
  type DriverRiskRecord,
} from "@/data/mockDriverSafety"

interface DriverDetailSheetProps {
  driver: DriverRiskRecord | null
  isOpen: boolean
  onClose: () => void
}

export function DriverDetailSheet({ driver, isOpen, onClose }: DriverDetailSheetProps) {
  if (!driver) return null

  const scoreColor =
    driver.safetyScore >= 80
      ? "text-badge-active-text"
      : driver.safetyScore >= 60
        ? "text-status-warning"
        : "text-badge-inactive-text"

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <SheetTitle className="text-sidebar-item-active">{driver.championName}</SheetTitle>
            <StatusBadge variant={riskLevelVariantMap[driver.riskLevel]} withDot>
              {driver.riskLevel}
            </StatusBadge>
          </div>
          <SheetDescription>
            {driver.championId} &middot; {driver.location}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Champion Profile */}
          <InfoCard title="Champion Profile">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/champvatar.png"
                alt={driver.championName}
                className="w-[54px] h-[54px] rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-medium text-sidebar-item-active text-[15px] tracking-[-0.15px]">
                  {driver.championName}
                </p>
                <p className="text-breadcrumb-root text-xs mt-0.5">{driver.championId}</p>
              </div>
            </div>
            <InfoGrid
              columns={2}
              items={[
                { label: "Location", value: driver.location },
                { label: "Last Activity", value: driver.lastActivity },
              ]}
            />
          </InfoCard>

          {/* Safety Overview */}
          <InfoCard title="Safety Overview">
            <InfoGrid
              columns={2}
              items={[
                {
                  label: "Safety Score",
                  value: (
                    <span className={`font-semibold ${scoreColor}`}>
                      {driver.safetyScore}
                    </span>
                  ),
                },
                {
                  label: "Risk Level",
                  value: (
                    <StatusBadge variant={riskLevelVariantMap[driver.riskLevel]} size="sm">
                      {driver.riskLevel}
                    </StatusBadge>
                  ),
                },
                { label: "Total Safety Events", value: String(driver.totalSafetyEvents) },
                { label: "Recent Incident", value: driver.recentIncident },
              ]}
            />
          </InfoCard>

          {/* Safety Score Breakdown */}
          <InfoCard title="Score Breakdown">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-breadcrumb-root font-medium">Overall Score</span>
                <span className={`font-semibold text-sm ${scoreColor}`}>{driver.safetyScore}/100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${driver.safetyScore}%`,
                    backgroundColor:
                      driver.safetyScore >= 80
                        ? "var(--color-badge-active-text)"
                        : driver.safetyScore >= 60
                          ? "var(--color-status-warning)"
                          : "var(--color-badge-inactive-text)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-breadcrumb-root">
                <span>0 — Critical</span>
                <span>100 — Excellent</span>
              </div>
            </div>
          </InfoCard>

          {/* Activity Summary */}
          <InfoCard title="Activity Summary">
            <InfoGrid
              columns={2}
              items={[
                { label: "Champion ID", value: driver.championId },
                { label: "Location", value: driver.location },
                { label: "Last Active", value: driver.lastActivity },
                { label: "Total Events", value: String(driver.totalSafetyEvents) },
                { label: "Most Recent Incident", value: driver.recentIncident },
                { label: "Risk Classification", value: driver.riskLevel },
              ]}
            />
          </InfoCard>
        </div>
      </SheetContent>
    </Sheet>
  )
}
