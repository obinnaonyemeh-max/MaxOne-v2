import { useMemo, useState, type ReactNode, type ComponentType } from "react"
import { useSearchParams } from "react-router-dom"
import { ShieldCheck, CheckCircle2, AlertTriangle, Info, FileText, Wallet, ChevronDown } from "lucide-react"

import { TopBar, StatCard, ConfirmModal, LoaderModal, ContractInformation } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { mockEarlyTerminationContracts } from "@/data/mockEarlyTermination"
import { ChampionContractSelector } from "./ChampionContractSelector"
import {
  buildSettlementQuote,
  buildSettlementComputation,
  buildContractProgress,
  formatCurrency,
  type SettlementValidationLevel,
} from "./earlyTerminationCalculations"
import { RecoveryAnalysisTab } from "./RecoveryAnalysisTab"
import { AmortisationTab } from "./AmortisationTab"
import { SettlementTab } from "./SettlementTab"
import { SettlementActionsCard } from "./SettlementActionsCard"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "recovery", label: "Recovery Analysis" },
  { value: "amortisation", label: "Amortisation" },
  { value: "settlement", label: "Settlement" },
]

const validationIcon: Record<SettlementValidationLevel, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const validationTextClass: Record<SettlementValidationLevel, string> = {
  success: "text-status-success",
  warning: "text-status-warning",
  info: "text-muted-foreground",
}

function SummaryList({ items }: { items: Array<{ label: string; value: string | number }> }) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="text-breadcrumb-root">{item.label}</span>
          <span className="font-medium text-sidebar-item-active text-right">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function AccordionSummaryCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-5 py-4"
      >
        <Icon className="h-4 w-4 text-breadcrumb-root shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">{title}</span>
        <ChevronDown className={`ml-auto h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function EarlyTerminationEnginePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"
  const handleTabChange = (value: string) => setSearchParams(value === "overview" ? {} : { tab: value }, { replace: true })

  const [contracts, setContracts] = useState(mockEarlyTerminationContracts)
  const [championId, setChampionId] = useState("")
  const [settlementDate, setSettlementDate] = useState<Date | undefined>(new Date())
  const [terminateStep, setTerminateStep] = useState<"idle" | "confirm" | "running">("idle")

  // A champion holds exactly one contract at a time.
  const contract = useMemo(() => contracts.find((c) => c.championId === championId) ?? null, [contracts, championId])

  const quote = useMemo(
    () => (contract && settlementDate ? buildSettlementQuote(contract, settlementDate) : null),
    [contract, settlementDate]
  )

  const settlement = useMemo(
    () => (contract && quote ? buildSettlementComputation(contract, quote, false) : null),
    [contract, quote]
  )

  const contractProgress = useMemo(
    () => (contract && settlementDate ? buildContractProgress(contract, settlementDate) : null),
    [contract, settlementDate]
  )

  const handleCancel = () => {
    setChampionId("")
  }

  const handleTerminateConfirm = () => {
    setTerminateStep("running")
    setTimeout(() => {
      setTerminateStep("idle")
      if (contract) {
        setContracts((prev) => prev.map((c) => (c.id === contract.id ? { ...c, status: "Completed" } : c)))
      }
    }, 1200)
  }

  const settlementDateLabel = settlementDate
    ? settlementDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

  const isTerminated = contract?.status === "Completed"

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Products & Pricing" }, { label: "Early Termination Engine" }]} />

      <div className="px-6 flex items-start justify-between">
        <div className="py-6">
          <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
            Early Termination Engine
            <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </h1>
          <p className="mt-1 text-sm font-medium text-breadcrumb-root max-w-2xl">
            Settlement calculator that analyses component-level recovery from the pricing template, breakdown
            and amortisation schedule.
          </p>
        </div>
        <div className="py-6">
          <Button
            variant="destructive"
            className="h-10 gap-2"
            disabled={!contract || !settlement || isTerminated}
            onClick={() => setTerminateStep("confirm")}
          >
            <ShieldCheck className="h-4 w-4" />
            {isTerminated ? "Contract Terminated" : "Terminate Contract"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <ChampionContractSelector
              contracts={contracts}
              championId={championId}
              onChampionChange={setChampionId}
              contract={contract}
              settlementDate={settlementDate}
              onSettlementDateChange={setSettlementDate}
            />

            {contract && quote ? (
              <>
                {contractProgress && (
                  <ContractInformation
                    percentage={contractProgress.percentage}
                    totalDays={contractProgress.totalDays}
                    daysElapsed={contractProgress.daysElapsed}
                    startDate={contractProgress.startDate}
                    endDate={contractProgress.endDate}
                    animate={false}
                  />
                )}

                <AccordionSummaryCard icon={FileText} title="Contract Summary">
                  <SummaryList
                    items={[
                      { label: "Customer Name", value: contract.customerName },
                      { label: "Vehicle Model & Plate", value: `${contract.vehicleManufacturer} ${contract.vehicleModel} · ${contract.vehiclePlate}` },
                      { label: "Contract Number", value: contract.contractNumber },
                      { label: "Pricing Template", value: contract.pricingTemplateName },
                      { label: "Start Date", value: contract.startDate },
                      { label: "Settlement Date", value: settlementDateLabel },
                      { label: "Tenor", value: `${contract.tenorMonths} months` },
                      { label: "Months Elapsed", value: quote.monthsElapsed },
                      { label: "Remaining Tenor", value: `${quote.remainingTenorMonths} months` },
                    ]}
                  />
                </AccordionSummaryCard>

                <AccordionSummaryCard icon={Wallet} title="Collections Summary">
                  <SummaryList
                    items={[
                      { label: "Daily Remittance", value: formatCurrency(contract.dailyRemittance) },
                      { label: "Collection Days", value: `${contract.collectionDaysPerMonth} / month` },
                      { label: "Expected Collections", value: formatCurrency(quote.expectedCollections) },
                      { label: "Actual Collections", value: formatCurrency(contract.actualCollections) },
                      { label: "Collection Rate (%)", value: `${quote.collectionRate.toFixed(1)}%` },
                      { label: "Outstanding Balance", value: formatCurrency(quote.outstandingBalance) },
                      { label: "Outstanding DPD", value: `${contract.outstandingDPD} days` },
                      { label: "Total Contract Revenue", value: formatCurrency(contract.totalContractRevenue) },
                      { label: "Applicable Credits", value: formatCurrency(contract.applicableCredits) },
                    ]}
                  />
                </AccordionSummaryCard>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16 px-4">
                <p className="text-sm font-medium text-breadcrumb-root text-center">
                  Search a champion to populate the settlement summary.
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 min-w-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col">
              <TabsList variant="line" className="mb-4 w-fit gap-4 border-b border-gray-200 justify-start">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex flex-col gap-4">
                {!contract || !quote || !settlement ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
                    <p className="text-sm font-medium text-breadcrumb-root">
                      Search a champion to generate a settlement overview.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <StatCard
                        title="Settlement amount"
                        value={formatCurrency(settlement.settlementAmount)}
                        subtitle="Total payout balance"
                        indicatorColor="var(--color-status-warning)"
                        className="border-yellow-400 bg-yellow-50/40"
                      />
                      <StatCard
                        title="Outstanding balance"
                        value={formatCurrency(quote.outstandingBalance)}
                        subtitle="Active debt balance"
                        indicatorColor="var(--color-status-danger)"
                      />
                      <StatCard
                        title="Collection rate"
                        value={`${quote.collectionRate.toFixed(1)}%`}
                        subtitle="Actual vs. expected"
                        indicatorColor="var(--color-status-success)"
                      />
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                        Settlement Validation Checklist
                      </span>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {settlement.validation.map((item) => {
                          const Icon = validationIcon[item.level]
                          return (
                            <div key={item.key} className="flex items-start gap-2">
                              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${validationTextClass[item.level]}`} />
                              <span className={`text-sm ${item.level === "info" ? "text-muted-foreground" : "text-table-text-primary"}`}>
                                {item.message}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <SettlementActionsCard contract={contract} onCancel={handleCancel} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="recovery" className="mt-0">
                <RecoveryAnalysisTab contract={contract} quote={quote} />
              </TabsContent>
              <TabsContent value="amortisation" className="mt-0">
                <AmortisationTab contract={contract} quote={quote} />
              </TabsContent>
              <TabsContent value="settlement" className="mt-0">
                <SettlementTab contract={contract} quote={quote} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {contract && settlement && (
        <>
          <ConfirmModal
            open={terminateStep === "confirm"}
            onOpenChange={(open) => !open && setTerminateStep("idle")}
            variant="destructive"
            icon={ShieldCheck}
            title="Terminate this contract?"
            subtitle={`${contract.contractNumber} will be marked as terminated and settled for ${formatCurrency(settlement.settlementAmount)}. This cannot be undone.`}
            primaryAction={{ label: "Terminate Contract", onClick: handleTerminateConfirm }}
            secondaryAction={{ label: "Cancel", onClick: () => setTerminateStep("idle") }}
          />
          <LoaderModal open={terminateStep === "running"} message="Terminating contract..." />
        </>
      )}
    </>
  )
}
