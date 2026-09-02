import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, Plus, Play } from "lucide-react"
import { toast } from "sonner"

import { TopBar, StatusBadge, StatCard, DataTable, InfoGrid, Modal, Banner } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  mockRepricingRules,
  mockRepricingSessions,
  mockRepricingMetrics,
  mockAutomationConfig,
  repricingRuleStatusVariantMap,
  type RepricingRule,
  type RepricingSession,
} from "@/data/mockRepricingEngine"
import { repricingSessionColumns } from "./repricingSessionColumns"
import { RepricingRulesTable } from "./RepricingRulesTable"
import { EvRepricingTab } from "./EvRepricingTab"
import { IceRepricingTab } from "./IceRepricingTab"
import { RepricingSessionsTab } from "./RepricingSessionsTab"
import { ExceptionQueueTab } from "./ExceptionQueueTab"
import { AuditTrailTab } from "./AuditTrailTab"
import { RunRepricingModal } from "./RunRepricingModal"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const tabs = [
  { value: "dashboard", label: "Dashboard" },
  { value: "rules", label: "Repricing Rules" },
  { value: "ev", label: "EV Repricing" },
  { value: "ice", label: "ICE Repricing" },
  { value: "sessions", label: "Repricing Sessions" },
  { value: "exceptions", label: "Exception Queue" },
  { value: "audit", label: "Audit Trail" },
]

export default function DynamicRepricingEnginePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "dashboard"
  const handleTabChange = (value: string) => setSearchParams(value === "dashboard" ? {} : { tab: value }, { replace: true })

  const [sessions, setSessions] = useState<RepricingSession[]>(mockRepricingSessions)
  const [rules, setRules] = useState<RepricingRule[]>(mockRepricingRules)
  const [viewRule, setViewRule] = useState<RepricingRule | null>(null)
  const [showRunModal, setShowRunModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const handleDuplicateRule = (rule: RepricingRule) => {
    const duplicate: RepricingRule = {
      ...rule,
      id: crypto.randomUUID(),
      name: `${rule.name} (Copy)`,
      version: "v1",
      status: "Draft",
    }
    setRules((prev) => [duplicate, ...prev])
    toast.success("Rule duplicated", { description: `${duplicate.name} created as a draft.` })
  }

  const handleDeactivateRule = (rule: RepricingRule) => {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, status: "Inactive" } : r)))
    toast.success("Rule deactivated", { description: `${rule.name} is now inactive.` })
  }

  const handleRunComplete = () => {
    const now = new Date()
    const timestamp = now.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + ", " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    const newSession: RepricingSession = {
      id: `RPS-MANUAL-${now.getTime().toString().slice(-6)}`,
      sessionType: "Manual",
      trigger: "Manual run",
      startTime: timestamp,
      endTime: timestamp,
      duration: "1m 12s",
      found: mockRepricingMetrics.awaitingRepricing,
      repriced: mockRepricingMetrics.awaitingRepricing,
      exceptions: 0,
      failed: 0,
      status: "Completed",
    }
    setSessions((prev) => [newSession, ...prev])
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Products & Pricing" }, { label: "Dynamic Repricing Engine" }]} />

      <div className="px-6 flex items-start justify-between">
        <div className="py-6">
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
            Dynamic Repricing Engine
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root max-w-2xl">
            Configuration and automation layer. Finance and Product define the rules once; scheduled jobs
            reprice every contract that enters the Repricing stage.
          </p>
        </div>
        <div className="flex items-center gap-2 py-6">
          <Button variant="outline" className="h-10 gap-2" onClick={() => setShowScheduleModal(true)}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2"
            onClick={() => navigate("/portfolio/products-pricing/repricing-engine/create-rule")}
          >
            <Plus className="h-4 w-4" />
            Create Rule
          </Button>
          <Button className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90" onClick={() => setShowRunModal(true)}>
            <Play className="h-4 w-4" />
            Run Repricing Now
          </Button>
        </div>
      </div>

      {mockRepricingMetrics.exceptionQueue > 0 && (
        <div className="px-6 mb-4">
          <Banner
            variant="warning"
            title={`${mockRepricingMetrics.exceptionQueue} contract exception(s) flagged behind active repricing rules`}
            description="These contracts breached a constraint during repricing and were routed to the Exception Queue for review."
            action={
              <Button variant="outline" size="sm" onClick={() => handleTabChange("exceptions")}>
                View Exception Queue
              </Button>
            }
          />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="mx-6 mb-2 w-fit gap-4 bg-transparent p-0 border-b border-gray-200 rounded-none justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto pb-6">
          <TabsContent value="dashboard" className="flex flex-col gap-4 mt-0">
            <div className="px-6 grid grid-cols-6 gap-2">
              <StatCard
                title="Awaiting Repricing"
                value={mockRepricingMetrics.awaitingRepricing}
                subtitle="In repricing stage"
                indicatorColor="var(--color-brand-primary)"
                className="border-brand-primary"
              />
              <StatCard
                title="Repriced Today"
                value={mockRepricingMetrics.repricedToday}
                subtitle={`Across ${mockRepricingMetrics.repricedTodaySessions} sessions`}
                indicatorColor="var(--color-status-success)"
              />
              <StatCard
                title="Failed Repricing"
                value={mockRepricingMetrics.failedRepricing}
                subtitle="Calculation errors"
                indicatorColor="var(--color-status-danger)"
              />
              <StatCard
                title="Exception Queue"
                value={mockRepricingMetrics.exceptionQueue}
                subtitle="Awaiting review"
                indicatorColor="var(--color-status-warning)"
              />
              <StatCard
                title="Last Repricing Run"
                value={mockRepricingMetrics.lastRunTime}
                subtitle={`${mockRepricingMetrics.lastRunDate} · completed`}
                indicatorColor="var(--color-status-info)"
              />
              <StatCard
                title="Next Scheduled Run"
                value={mockRepricingMetrics.nextRunTime}
                subtitle={`${mockRepricingMetrics.nextRunDate} · twice daily`}
                indicatorColor="var(--color-status-purple)"
              />
            </div>

            <div className="px-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Active Rules</span>
                <div className="flex flex-col divide-y divide-gray-100">
                  {rules.slice(0, 4).map((rule) => (
                    <div key={rule.id} className="flex items-start justify-between gap-2 py-2.5">
                      <div className="flex items-start gap-2">
                        <StatusBadge variant={rule.vehicleType === "EV" ? "info" : "warning"} size="sm">
                          {rule.vehicleType}
                        </StatusBadge>
                        <div>
                          <p className="font-medium text-sidebar-item-active text-sm">{rule.name}</p>
                          <p className="text-xs text-breadcrumb-root">
                            {rule.vehicleModel} &middot; {rule.country} &middot; {rule.version} &middot; Effective {rule.effectiveDate}
                          </p>
                        </div>
                      </div>
                      <StatusBadge variant={repricingRuleStatusVariantMap[rule.status]} size="sm">
                        {rule.status}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange("rules")}
                  className="mt-1 text-left text-sm font-medium text-status-info hover:underline"
                >
                  View rule register →
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Automation</span>
                <InfoGrid
                  columns={2}
                  showDividers
                  items={[
                    { label: "Frequency", value: mockAutomationConfig.frequency },
                    { label: "Run windows", value: mockAutomationConfig.runWindows },
                    { label: "Scope", value: mockAutomationConfig.scope },
                    { label: "Refurbishment gate", value: mockAutomationConfig.refurbishmentGate },
                    { label: "On constraint breach", value: mockAutomationConfig.onConstraintBreach },
                  ]}
                />
              </div>
            </div>

            <div className="px-6">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-sidebar-item-active text-sm">Recent Repricing Sessions</h3>
                    <p className="text-xs text-breadcrumb-root mt-0.5">Automated and manual runs from the last 72 hours</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTabChange("sessions")}>
                    All sessions
                  </Button>
                </div>
                <DataTable columns={repricingSessionColumns} data={sessions} emptyMessage="No repricing sessions yet." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            <div className="px-6">
              <RepricingRulesTable
                rules={rules}
                onView={setViewRule}
                onDuplicate={handleDuplicateRule}
                onDeactivate={handleDeactivateRule}
              />
            </div>
          </TabsContent>
          <TabsContent value="ev" className="mt-0">
            <EvRepricingTab />
          </TabsContent>
          <TabsContent value="ice" className="mt-0">
            <IceRepricingTab />
          </TabsContent>
          <TabsContent value="sessions" className="mt-0">
            <RepricingSessionsTab sessions={sessions} />
          </TabsContent>
          <TabsContent value="exceptions" className="mt-0">
            <ExceptionQueueTab />
          </TabsContent>
          <TabsContent value="audit" className="mt-0">
            <AuditTrailTab />
          </TabsContent>
        </div>
      </Tabs>

      <RunRepricingModal open={showRunModal} onClose={() => setShowRunModal(false)} onComplete={handleRunComplete} />

      <Modal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        title="Repricing Schedule"
        subtitle="Current automation configuration"
        secondaryAction={{ label: "Close", onClick: () => setShowScheduleModal(false) }}
      >
        <InfoGrid
          columns={2}
          items={[
            { label: "Frequency", value: mockAutomationConfig.frequency },
            { label: "Run windows", value: mockAutomationConfig.runWindows },
            { label: "Scope", value: mockAutomationConfig.scope },
            { label: "Refurbishment gate", value: mockAutomationConfig.refurbishmentGate },
            { label: "On constraint breach", value: mockAutomationConfig.onConstraintBreach },
          ]}
        />
      </Modal>

      <Modal
        open={viewRule !== null}
        onOpenChange={(open) => !open && setViewRule(null)}
        title={viewRule?.name}
        subtitle="Repricing rule details"
        secondaryAction={{ label: "Close", onClick: () => setViewRule(null) }}
      >
        {viewRule && (
          <InfoGrid
            columns={2}
            items={[
              { label: "Vehicle Type", value: viewRule.vehicleType },
              { label: "Vehicle Model", value: viewRule.vehicleModel },
              { label: "Country", value: viewRule.country },
              { label: "Version", value: viewRule.version },
              { label: "Effective Date", value: viewRule.effectiveDate },
              { label: "Status", value: viewRule.status },
            ]}
          />
        )}
      </Modal>
    </>
  )
}
