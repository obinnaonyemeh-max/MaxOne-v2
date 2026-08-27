import { CheckCircle2, AlertTriangle } from "lucide-react"
import { FormSection } from "@/pages/vehicles/FormControls"
import { InfoGrid } from "@/components/max"
import {
  buildIncomeStatement,
  formatCurrency,
  formatPercent,
  fundingMixIsValid,
  totalCostOfFunds,
  totalMaxAdvantageCosts,
  totalOnboardingCosts,
  totalOperationalCosts,
  totalRiskContingencyCosts,
  totalSalesMarketingCosts,
  totalVehiclePurchaseCost,
} from "../calculations"
import { type WizardState } from "../types"

interface Stage11Props {
  values: WizardState
}

export function Stage11Summary({ values }: Stage11Props) {
  const statement = buildIncomeStatement(values)
  const mixValid = fundingMixIsValid(values)
  const coreFieldsFilled = values.templateName.trim() !== "" && values.templateCode.trim() !== "" && values.vehicleTypeSubtype !== ""
  const auditPassed = mixValid && coreFieldsFilled

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Summary Income Statement">
          <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
            Full read-only P&amp;L derived from every stage above. Review before publishing.
          </p>

          <InfoGrid
            columns={2}
            items={[
              { label: "Required Revenue", value: formatCurrency(statement.requiredRevenue) },
              { label: "Cost of Sales", value: formatCurrency(statement.costOfSales) },
              { label: "Gross Profit", value: formatCurrency(statement.grossProfit) },
              { label: "Gross Margin", value: formatPercent(statement.grossMargin) },
              { label: "Total Opex", value: formatCurrency(statement.opex) },
              { label: "Net Profit", value: formatCurrency(statement.netProfit) },
              { label: "Net Margin", value: formatPercent(statement.netMargin) },
              { label: "Total Days (Tenor × Days/Month)", value: statement.totalDays },
            ]}
          />
        </FormSection>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Daily Remittance Targets">
          <InfoGrid
            columns={3}
            items={[
              { label: "Daily Remittance Target", value: formatCurrency(statement.dailyRemittanceTarget) },
              { label: "Max Advantage (Daily)", value: formatCurrency(statement.maxAdvantageDailyTarget) },
              { label: "Battery Access (Daily)", value: formatCurrency(statement.batteryAccessDailyTarget) },
            ]}
          />
        </FormSection>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Cost Breakdown Recap">
          <InfoGrid
            columns={2}
            items={[
              { label: "Vehicle Purchase Cost", value: formatCurrency(totalVehiclePurchaseCost(values)) },
              { label: "Cost of Funds", value: formatCurrency(totalCostOfFunds(values)) },
              { label: "Onboarding Costs", value: formatCurrency(totalOnboardingCosts(values)) },
              { label: "Operational Costs", value: formatCurrency(totalOperationalCosts(values)) },
              { label: "MAX Advantage Costs", value: formatCurrency(totalMaxAdvantageCosts(values)) },
              { label: "Sales & Marketing Costs", value: formatCurrency(totalSalesMarketingCosts(values)) },
              { label: "Risk & Contingency Costs", value: formatCurrency(totalRiskContingencyCosts(values)) },
            ]}
          />
        </FormSection>
      </div>

      <div
        className={`rounded-md border px-4 py-3 flex items-start gap-2 ${
          auditPassed ? "border-status-success/30 bg-status-success/5" : "border-status-danger/30 bg-status-danger/5"
        }`}
      >
        {auditPassed ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-status-success" />
        ) : (
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-status-danger" />
        )}
        <div>
          <p className={`text-sm font-medium ${auditPassed ? "text-status-success" : "text-status-danger"}`}>
            {auditPassed ? "Audit check passed — ready to publish." : "Audit check failed — resolve before publishing."}
          </p>
          {!auditPassed && (
            <ul className="mt-1 text-xs text-status-danger list-disc list-inside">
              {!coreFieldsFilled && <li>Template name, code and vehicle subtype are required (Stage 1).</li>}
              {!mixValid && <li>Debt and equity funding mix must sum to 100% (Stage 4).</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
