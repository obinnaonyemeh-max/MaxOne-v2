import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Banknote } from "lucide-react"

import { TopBar, StatusBadge, StatCard, InfoGrid, DatePickerField } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FormField } from "@/pages/vehicles/FormControls"
import { mockCountries } from "@/data/mockCountries"
import { mockEarlyTerminationContracts, earlyTerminationStatusVariantMap } from "@/data/mockEarlyTermination"
import { buildSettlementQuote, formatCurrency } from "./earlyTerminationCalculations"
import { GenerateSettlementQuoteModal } from "./GenerateSettlementQuoteModal"
import { RecoveryAnalysisTab } from "./RecoveryAnalysisTab"
import { AmortisationTab } from "./AmortisationTab"
import { SettlementTab } from "./SettlementTab"
import { SummaryActionsTab } from "./SummaryActionsTab"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "recovery", label: "Recovery Analysis" },
  { value: "amortisation", label: "Amortisation" },
  { value: "settlement", label: "Settlement" },
  { value: "summary", label: "Summary & Actions" },
]

export default function EarlyTerminationEnginePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "overview"
  const handleTabChange = (value: string) => setSearchParams(value === "overview" ? {} : { tab: value }, { replace: true })

  const [contracts, setContracts] = useState(mockEarlyTerminationContracts)
  const [countryId, setCountryId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [contractId, setContractId] = useState("")
  const [settlementDate, setSettlementDate] = useState<Date | undefined>(new Date())
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  const customerOptions = useMemo(
    () => [...new Set(contracts.filter((c) => c.countryId === countryId).map((c) => c.customerName))],
    [contracts, countryId]
  )
  const contractOptions = useMemo(
    () => contracts.filter((c) => c.countryId === countryId && c.customerName === customerName),
    [contracts, countryId, customerName]
  )
  const contract = useMemo(() => contracts.find((c) => c.id === contractId) ?? null, [contracts, contractId])

  const quote = useMemo(
    () => (contract && settlementDate ? buildSettlementQuote(contract, settlementDate) : null),
    [contract, settlementDate]
  )

  const handleCountryChange = (value: string) => {
    setCountryId(value)
    setCustomerName("")
    setContractId("")
  }

  const handleCustomerChange = (value: string) => {
    setCustomerName(value)
    setContractId("")
  }

  const handleApprove = (id: string) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Completed" } : c)))
  }

  const handleCancel = () => {
    setCountryId("")
    setCustomerName("")
    setContractId("")
  }

  const settlementDateLabel = settlementDate
    ? settlementDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

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
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            disabled={!contract || !quote}
            onClick={() => setShowQuoteModal(true)}
          >
            <Banknote className="h-4 w-4" />
            Generate Settlement Quote
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="mx-6 mb-2 w-fit gap-4 bg-transparent p-0 border-b border-gray-200 rounded-none justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClass}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto pb-6">
          <TabsContent value="overview" className="flex flex-col gap-4 mt-0">
            <div className="px-6">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="grid grid-cols-6 gap-4 items-end">
                  <FormField label="Country">
                    <Select value={countryId} onValueChange={handleCountryChange}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCountries.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.flag} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Customer">
                    <Select value={customerName} onValueChange={handleCustomerChange} disabled={!countryId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder={countryId ? "Select customer" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {customerOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Contract">
                    <Select value={contractId} onValueChange={setContractId} disabled={!customerName}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder={customerName ? "Select contract" : "Select customer first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {contractOptions.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.contractNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Vehicle">
                    <Input
                      value={contract ? `${contract.vehicleManufacturer} ${contract.vehicleModel} · ${contract.vehiclePlate}` : ""}
                      disabled
                      placeholder="Select a contract"
                      className="h-9 bg-gray-100"
                    />
                  </FormField>
                  <FormField label="Settlement Date">
                    <DatePickerField
                      value={settlementDate}
                      onChange={setSettlementDate}
                      placeholder="DD/MM/YYYY"
                      dateFormat="dd/MM/yyyy"
                      triggerClassName="bg-input-soft"
                    />
                  </FormField>
                  <FormField label="Contract Status">
                    <div className="h-9 flex items-center">
                      {contract ? (
                        <StatusBadge variant={earlyTerminationStatusVariantMap[contract.status]}>{contract.status}</StatusBadge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </FormField>
                </div>
              </div>
            </div>

            {!contract || !quote ? (
              <div className="px-6">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
                  <p className="text-sm font-medium text-breadcrumb-root">
                    Select a country, customer and contract to generate a settlement overview.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 grid grid-cols-3 gap-3">
                  <StatCard
                    title="Settlement Amount"
                    value={formatCurrency(quote.settlementAmount)}
                    subtitle="Total payout balance"
                    indicatorColor="var(--color-brand-primary)"
                    className="border-brand-primary bg-brand-primary/5"
                  />
                  <StatCard
                    title="Outstanding Balance"
                    value={formatCurrency(quote.outstandingBalance)}
                    subtitle="Active debt balance"
                    indicatorColor="var(--color-status-danger)"
                  />
                  <StatCard
                    title="Collection Rate"
                    value={`${quote.collectionRate.toFixed(1)}%`}
                    subtitle="Actual vs. expected"
                    indicatorColor="var(--color-status-success)"
                  />
                </div>

                <div className="px-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Contract Summary</span>
                    <InfoGrid
                      columns={2}
                      showDividers
                      items={[
                        { label: "Customer", value: contract.customerName },
                        { label: "Vehicle", value: `${contract.vehicleManufacturer} ${contract.vehicleModel} (${contract.vehicleTypeLabel})` },
                        { label: "Contract Number", value: contract.contractNumber },
                        { label: "Pricing Template", value: contract.pricingTemplateName },
                        { label: "Start Date", value: contract.startDate },
                        { label: "Settlement Date", value: settlementDateLabel },
                        { label: "Tenor", value: `${contract.tenorMonths} months` },
                        { label: "Months Elapsed", value: quote.monthsElapsed },
                        { label: "Remaining Tenor", value: `${quote.remainingTenorMonths} months` },
                      ]}
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Collections Summary</span>
                    <InfoGrid
                      columns={2}
                      showDividers
                      items={[
                        { label: "Daily Remittance", value: formatCurrency(contract.dailyRemittance) },
                        { label: "Collection Days", value: `${contract.collectionDaysPerMonth} / month` },
                        { label: "Expected Collections", value: formatCurrency(quote.expectedCollections) },
                        { label: "Actual Collections", value: formatCurrency(contract.actualCollections) },
                        { label: "Collection Rate", value: `${quote.collectionRate.toFixed(1)}%` },
                        { label: "Outstanding Balance", value: formatCurrency(quote.outstandingBalance) },
                        { label: "Outstanding DPD", value: `${contract.outstandingDPD} days` },
                        { label: "Total Contract Revenue", value: formatCurrency(contract.totalContractRevenue) },
                        { label: "Applicable Credits", value: formatCurrency(contract.applicableCredits) },
                      ]}
                    />
                  </div>
                </div>
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
          <TabsContent value="summary" className="mt-0">
            <SummaryActionsTab contract={contract} quote={quote} onApprove={handleApprove} onCancel={handleCancel} />
          </TabsContent>
        </div>
      </Tabs>

      {contract && quote && (
        <GenerateSettlementQuoteModal
          open={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          contract={contract}
          quote={quote}
          settlementDateLabel={settlementDateLabel}
        />
      )}
    </>
  )
}
