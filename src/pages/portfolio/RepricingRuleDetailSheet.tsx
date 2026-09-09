import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { InfoGrid, StatusBadge } from "@/components/max"
import { type RepricingRule, repricingRuleStatusVariantMap } from "@/data/mockRepricingEngine"
import { mockPricingBatchRecords } from "@/data/mockPricingBatchRecords"
import { RECOVERY_COMPONENTS } from "@/pages/create-repricing-rule/referenceData"

interface RepricingRuleDetailSheetProps {
  rule: RepricingRule | null
  onClose: () => void
}

function formatCurrency(amount: number): string {
  return "₦" + amount.toLocaleString()
}

function formatPercent(value: number): string {
  return `${value}%`
}

type SectionKey = "details" | "eligibility" | "recovery" | "investment" | "commercial" | "constraints"

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-sm text-muted-foreground">&mdash;</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-sidebar-item-active"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function RepricingRuleDetailSheet({ rule, onClose }: RepricingRuleDetailSheetProps) {
  const [openSection, setOpenSection] = useState<SectionKey>("details")
  const toggleSection = (key: SectionKey) => setOpenSection((prev) => (prev === key ? prev : key))

  if (!rule) return null

  const params = rule.parameters
  const pricingBatch = params?.pricingBatchId
    ? mockPricingBatchRecords.find((batch) => batch.id === params.pricingBatchId)
    : undefined

  const sections: { key: SectionKey; title: string; content: ReactNode }[] = [
    {
      key: "details",
      title: "Rule Details",
      content: (
        <div className="flex flex-col gap-3">
          {params?.description && (
            <p className="text-sm text-table-text leading-relaxed">{params.description}</p>
          )}
          <InfoGrid
            columns={2}
            items={[
              { label: "Rule Name", value: rule.name },
              { label: "Pricing Batch", value: pricingBatch?.code ?? "Not attached" },
              { label: "Country", value: rule.country },
              { label: "Vehicle Type", value: rule.vehicleType },
              { label: "Vehicle Model", value: rule.vehicleModel },
              { label: "Version", value: rule.version },
              { label: "Effective Date", value: rule.effectiveDate },
              { label: "Status", value: rule.status },
            ]}
          />
        </div>
      ),
    },
    {
      key: "eligibility",
      title: "Contract Eligibility",
      content: params ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Process Stages</p>
            <ChipList items={params.processStages} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Refurbishment Statuses</p>
            <ChipList items={params.refurbishmentStatuses} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Vehicle Type Eligibility</p>
            <ChipList items={params.vehicleTypeEligibility} />
          </div>
        </div>
      ) : null,
    },
    {
      key: "recovery",
      title: "Recovery Rules",
      content: params ? (
        <div className="flex flex-col divide-y divide-gray-100">
          {RECOVERY_COMPONENTS.map((component) => {
            const recoveryRule = params.recoveryRules[component.key]
            return (
              <div key={component.key} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-table-text">{component.label}</span>
                <span className="font-medium text-table-text-primary text-right">
                  {recoveryRule ? `${recoveryRule.method}${recoveryRule.percent !== null ? ` · ${recoveryRule.percent}%` : ""}` : "—"}
                </span>
              </div>
            )
          })}
        </div>
      ) : null,
    },
    {
      key: "investment",
      title: "New Investment Rules",
      content: params ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Capital Investments</p>
            <InfoGrid
              columns={2}
              items={[
                { label: "Refurbishment Cost", value: formatCurrency(params.refurbishmentCost) },
                { label: "Battery Cost", value: formatCurrency(params.batteryCost) },
                { label: "Charger Cost", value: formatCurrency(params.chargerCost) },
                { label: "Tracker Cost", value: formatCurrency(params.trackerCost) },
              ]}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Redeployment Costs</p>
            <InfoGrid
              columns={2}
              items={[
                { label: "Licensing & Registration", value: formatCurrency(params.licensingRegistrationCost) },
                { label: "Painting & Branding", value: formatCurrency(params.paintingBrandingCost) },
                { label: "Helmet", value: formatCurrency(params.helmetCost) },
                { label: "Vest", value: formatCurrency(params.vestCost) },
                { label: "Recovery Fee", value: formatCurrency(params.recoveryFeeCost) },
              ]}
            />
          </div>
        </div>
      ) : null,
    },
    {
      key: "commercial",
      title: "Commercial Assumptions",
      content: params ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Contract Structure</p>
            <InfoGrid columns={2} items={[{ label: "Collection Days / Month", value: params.collectionDaysPerMonth }]} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Funding</p>
            <InfoGrid
              columns={2}
              items={[
                { label: "Debt Funding", value: formatPercent(params.debtFundingPercent) },
                { label: "Debt Interest Rate", value: formatPercent(params.debtInterestRatePercent) },
                { label: "Equity Cost", value: formatPercent(params.equityCostPercent) },
                { label: "Lender Processing Fee", value: formatPercent(params.lenderProcessingFeePercent) },
              ]}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root mb-2">Commercial</p>
            <InfoGrid
              columns={2}
              items={[
                { label: "VAT", value: formatPercent(params.vatPercent) },
                { label: "Daily Battery Swap Subsidy", value: formatCurrency(params.dailyBatterySwapSubsidy) },
              ]}
            />
          </div>
        </div>
      ) : null,
    },
    {
      key: "constraints",
      title: "Pricing Constraints",
      content: params ? (
        <InfoGrid
          columns={2}
          items={[
            { label: "Max Daily Remittance", value: formatPercent(params.maxDailyRemittancePercent) },
            { label: "Min Daily Remittance", value: formatCurrency(params.minDailyRemittance) },
            { label: "Max Tenor", value: `${params.maxTenorMonths} months` },
            { label: "Min Gross Margin", value: formatPercent(params.minGrossMarginPercent) },
            { label: "Min Net Margin", value: formatPercent(params.minNetMarginPercent) },
          ]}
        />
      ) : null,
    },
  ]

  return (
    <Sheet open={rule !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{rule.name}</SheetTitle>
            <StatusBadge variant={repricingRuleStatusVariantMap[rule.status]}>{rule.status}</StatusBadge>
          </div>
          <SheetDescription>
            {rule.code} &middot; {rule.vehicleType} &middot; {rule.vehicleModel} &middot; {rule.country}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {!params && (
            <p className="text-sm text-muted-foreground">
              This rule was created before detailed parameters were tracked — only its core identity is available.
            </p>
          )}
          {sections.map((section) => (
            <div key={section.key} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.key)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                  {section.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === section.key ? "rotate-180" : ""}`}
                />
              </button>
              {openSection === section.key && <div className="px-4 pb-4">{section.content}</div>}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
