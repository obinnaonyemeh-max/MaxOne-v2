import type { ReactNode } from "react"
import { format } from "date-fns"
import { Banner, InfoGrid } from "@/components/max"
import { mockRepricingRules } from "@/data/mockRepricingEngine"
import {
  equityFundingPercent,
  formatCurrency,
  formatPercent,
  totalCapitalInvestment,
  totalRedeploymentCost,
} from "../calculations"
import { RECOVERY_COMPONENTS } from "../referenceData"
import { type WizardState } from "../types"

interface Step8Props {
  values: WizardState
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">{title}</span>
      {children}
    </div>
  )
}

export function Step8ReviewActivate({ values }: Step8Props) {
  const existingActiveRule = mockRepricingRules.find(
    (r) => r.status === "Active" && r.country === values.country && r.vehicleType === values.vehicleType
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard title="Rule Details">
          <InfoGrid
            columns={2}
            items={[
              { label: "Rule Name", value: values.ruleName || "—" },
              { label: "Country", value: values.country || "—" },
              { label: "Vehicle Type", value: values.vehicleType || "—" },
              { label: "Vehicle Model", value: values.vehicleModel || "—" },
              { label: "Effective Date", value: values.effectiveDate ? format(values.effectiveDate, "dd MMM yyyy") : "—" },
              { label: "Status", value: values.status },
            ]}
          />
        </SummaryCard>

        <SummaryCard title="Eligibility">
          <div className="flex flex-col gap-3">
            {[
              { label: "Process Stage", value: [...values.processStages].join(", ") || "—" },
              { label: "Refurbishment Status", value: [...values.refurbishmentStatuses].join(", ") || "—" },
              { label: "Vehicle Type Eligibility", value: [...values.vehicleTypeEligibility].join(", ") || "—" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs font-medium text-breadcrumb-root">{item.label}</p>
                <p className="font-medium text-sidebar-item-active" style={{ fontSize: "14px" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Recovery">
          <div className="flex flex-col divide-y divide-gray-100">
            {RECOVERY_COMPONENTS.map((component) => {
              const rule = values.recoveryRules[component.key]
              return (
                <div key={component.key} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-table-text">{component.label}</span>
                  <span className="font-medium text-table-text-primary">
                    {rule.percent === null ? "—" : `${rule.percent}%`} · {rule.method}
                  </span>
                </div>
              )
            })}
          </div>
        </SummaryCard>

        <SummaryCard title="Investment">
          <InfoGrid
            columns={2}
            items={[
              { label: "Total Capital Investment", value: formatCurrency(totalCapitalInvestment(values)) },
              { label: "Total Redeployment Cost", value: formatCurrency(totalRedeploymentCost(values)) },
            ]}
          />
        </SummaryCard>

        <SummaryCard title="Commercial">
          <InfoGrid
            columns={2}
            items={[
              { label: "Debt / Equity Funding", value: `${formatPercent(values.debtFundingPercent, 0)} / ${formatPercent(equityFundingPercent(values), 0)}` },
              { label: "Debt Interest Rate", value: formatPercent(values.debtInterestRatePercent, 1) },
              { label: "VAT", value: formatPercent(values.vatPercent, 1) },
              { label: "Daily Battery Swap Subsidy", value: formatCurrency(values.dailyBatterySwapSubsidy) },
            ]}
          />
        </SummaryCard>

        <SummaryCard title="Constraints">
          <InfoGrid
            columns={2}
            items={[
              { label: "Max Daily Remittance", value: `${values.maxDailyRemittancePercent}% of previous` },
              { label: "Min Daily Remittance", value: formatCurrency(values.minDailyRemittance) },
              { label: "Max Tenor", value: `${values.maxTenorMonths} months` },
              { label: "Min Gross / Net Margin", value: `${values.minGrossMarginPercent}% / ${values.minNetMarginPercent}%` },
            ]}
          />
        </SummaryCard>
      </div>

      <Banner
        variant={existingActiveRule ? "warning" : "info"}
        title="Activating this rule retires the current active rule and applies to all future repricing sessions."
        description={
          existingActiveRule
            ? `Activating this rule retires "${existingActiveRule.name}" (${existingActiveRule.code}), the current active rule for ${values.country || "—"} · ${values.vehicleType || "—"}, and applies to all future repricing sessions from the effective date.`
            : `No rule is currently active for ${values.country || "—"} · ${values.vehicleType || "—"} — this will become the active rule and apply to all future repricing sessions from the effective date.`
        }
      />
    </div>
  )
}
