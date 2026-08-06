import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import {
  TopBar,
  PageHeader,
  StatusTabs,
  BatteryStatusFilterChips,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  mockChargerRegisterItems,
  chargerStatusCounts,
  totalChargers,
  checkedOutCount,
  checkedInCount,
  type CheckStatus,
} from "@/data/mockChargerData"
import { ChargerListCard } from "./ChargerListCard"
import { ChargersMap } from "./ChargersMap"

export default function ChargerRegisterPage() {
  const navigate = useNavigate()
  const [activeCheckTab, setActiveCheckTab] = useState<CheckStatus>("checked-out")
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null)
  const [selectedChargerId, setSelectedChargerId] = useState<string | null>(
    mockChargerRegisterItems[0]?.id ?? null
  )
  const [expandedChargerId, setExpandedChargerId] = useState<string | null>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)

  const checkTabs = [
    { id: "checked-out", label: "Checked Out", count: checkedOutCount },
    { id: "checked-in", label: "Checked In", count: checkedInCount },
  ]

  const filterChips = chargerStatusCounts.map((item) => ({
    id: item.status,
    label: item.label,
    count: item.count,
    color: item.color,
  }))

  const filteredChargers = useMemo(() => {
    let chargers = mockChargerRegisterItems

    if (activeCheckTab) {
      chargers = chargers.filter((c) => c.checkStatus === activeCheckTab)
    }

    if (activeStatusFilter) {
      chargers = chargers.filter((c) => c.status === activeStatusFilter)
    }

    return chargers
  }, [activeCheckTab, activeStatusFilter])

  useEffect(() => {
    if (filteredChargers.length === 0) {
      setSelectedChargerId(null)
      return
    }
    if (
      !selectedChargerId ||
      !filteredChargers.some((charger) => charger.id === selectedChargerId)
    ) {
      setSelectedChargerId(filteredChargers[0].id)
    }
  }, [filteredChargers, selectedChargerId])

  useEffect(() => {
    if (!selectedChargerId || !listContainerRef.current) return
    const card = listContainerRef.current.querySelector(
      `[data-charger-id="${selectedChargerId}"]`
    )
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedChargerId])

  const displayCount = activeStatusFilter
    ? filteredChargers.length
    : activeCheckTab === "checked-out"
      ? checkedOutCount
      : checkedInCount

  const handleStatusFilterClick = (statusId: string | null) => {
    setActiveStatusFilter(statusId)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Falcon" },
          { label: "EV Chargers" },
        ]}
      />

      <PageHeader
        title="Charger Register"
        subtitle="View and manage all chargers in your fleet with real-time status and location tracking."
        className="shrink-0"
      />

      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-4">
        {/* Left Panel - Charger List */}
        <div className="w-[390px] shrink-0 border border-gray-200 rounded-lg flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="text-gray-950"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {totalChargers.toLocaleString()}
                </h2>
                <span
                  className="text-gray-500"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Total chargers
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  // Refresh action
                }}
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* Check Status Tabs */}
            <StatusTabs
              tabs={checkTabs}
              activeTab={activeCheckTab}
              onTabChange={(tabId) => setActiveCheckTab(tabId as CheckStatus)}
              className="px-0 mb-4 justify-center"
            />

            {/* Status Filter Chips */}
            <BatteryStatusFilterChips
              chips={filterChips}
              activeChipId={activeStatusFilter}
              onChipClick={handleStatusFilterClick}
            />
          </div>

          {/* Showing count */}
          <div className="px-4 py-2 border-b border-gray-100">
            <span
              className="text-gray-500"
              style={{ fontSize: "12px" }}
            >
              Showing all {displayCount.toLocaleString()} chargers
            </span>
          </div>

          {/* Charger List */}
          <div ref={listContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredChargers.map((charger) => (
              <div key={charger.id} data-charger-id={charger.id}>
                <ChargerListCard
                  id={charger.id}
                  status={charger.status}
                  lastUpdate={charger.lastUpdate}
                  isSelected={selectedChargerId === charger.id}
                  isExpanded={expandedChargerId === charger.id}
                  imei={charger.imei}
                  assignedTo={charger.assignedTo}
                  assignedToAvatar={charger.assignedToAvatar}
                  chargerType={charger.chargerType}
                  lifecycleStatus={charger.lifecycleStatus}
                  manufacturer={charger.manufacturer}
                  chargerModel={charger.chargerModel}
                  currentLocation={charger.currentLocation}
                  stateDeployed={charger.stateDeployed}
                  lastReportedTime={charger.lastReportedTime}
                  onClick={() => setSelectedChargerId(charger.id)}
                  onExpandClick={() => setExpandedChargerId(
                    expandedChargerId === charger.id ? null : charger.id
                  )}
                  onMenuItemClick={(action) => {
                    if (action === "view-charge-spots") {
                      navigate(`/falcon/ev-chargers/${charger.id}/charge-spots`, {
                        state: { from: "/falcon/ev-chargers" },
                      })
                      return
                    }
                    const tabMap: Record<string, string> = {
                      "view-charger-info": "info",
                      "view-charge-sessions": "sessions",
                    }
                    const tab = tabMap[action]
                    if (tab) {
                      navigate(`/falcon/ev-chargers/${charger.id}?tab=${tab}`)
                    }
                  }}
                  onViewFullInfo={() => navigate(`/falcon/ev-chargers/${charger.id}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="relative z-0 flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white p-2 min-h-0 isolate">
          <ChargersMap
            chargers={filteredChargers}
            selectedChargerId={selectedChargerId}
            onSelectCharger={setSelectedChargerId}
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </>
  )
}
