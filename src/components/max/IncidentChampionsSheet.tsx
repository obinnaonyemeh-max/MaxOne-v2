import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { StatusBadge } from "./StatusBadge"
import {
  mockDriverRiskRecords,
  riskLevelVariantMap,
  type CriticalEventCategory,
} from "@/data/mockDriverSafety"

interface IncidentChampionsSheetProps {
  incident: CriticalEventCategory | null
  isOpen: boolean
  onClose: () => void
}

export function IncidentChampionsSheet({ incident, isOpen, onClose }: IncidentChampionsSheetProps) {
  if (!incident) return null

  const matchingDrivers = mockDriverRiskRecords.filter(
    (d) => d.recentIncident === incident.name
  )

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-3 pr-8">
            <span
              className="shrink-0 h-3 w-3 rounded-full"
              style={{ backgroundColor: incident.color }}
            />
            <SheetTitle className="text-sidebar-item-active">{incident.name}</SheetTitle>
            <span
              className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            >
              {incident.count} events
            </span>
          </div>
          <SheetDescription>
            Champions with a recent {incident.name.toLowerCase()} incident
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {matchingDrivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-breadcrumb-root font-medium">No champions found</p>
              <p className="text-xs text-gray-400 mt-1">
                No champions have a recent {incident.name.toLowerCase()} incident on record.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchingDrivers.map((driver) => {
                const scoreColor =
                  driver.safetyScore >= 80
                    ? "text-badge-active-text"
                    : driver.safetyScore >= 60
                      ? "text-status-warning"
                      : "text-badge-inactive-text"

                return (
                  <div
                    key={driver.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src="/images/champvatar.png"
                          alt={driver.championName}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>
                            {driver.championName}
                          </p>
                          <p className="text-breadcrumb-root text-xs mt-0.5">
                            {driver.championId}
                          </p>
                        </div>
                      </div>
                      <StatusBadge variant={riskLevelVariantMap[driver.riskLevel]} size="sm">
                        {driver.riskLevel}
                      </StatusBadge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-breadcrumb-root font-medium">Location</p>
                        <p className="text-sm text-sidebar-item-active font-medium">{driver.location}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-breadcrumb-root font-medium">Safety Score</p>
                        <p className={`text-sm font-semibold ${scoreColor}`}>{driver.safetyScore}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs text-breadcrumb-root font-medium">Total Events</p>
                        <p className="text-sm text-sidebar-item-active font-medium">{driver.totalSafetyEvents}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
