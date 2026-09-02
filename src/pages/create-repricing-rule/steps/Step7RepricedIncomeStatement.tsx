import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Banner, InfoGrid, StatCard } from "@/components/max"
import { FormSection } from "@/pages/vehicles/FormControls"
import { buildRepricedIncomeStatement, evaluateConstraintBreaches, formatCurrency, formatPercent } from "../calculations"
import { type WizardState } from "../types"

interface Step7Props {
  values: WizardState
}

export function Step7RepricedIncomeStatement({ values }: Step7Props) {
  const statement = buildRepricedIncomeStatement(values)
  const breaches = evaluateConstraintBreaches(values, statement)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        <StatCard title="Total Customer Contract Value" value={formatCurrency(statement.totalCustomerContractValue)} indicatorColor="var(--color-brand-primary)" />
        <StatCard title="Daily Remittance" value={formatCurrency(statement.dailyRemittance)} indicatorColor="var(--color-status-info)" />
        <StatCard title="Feasible Tenor" value={`${statement.feasibleTenorMonths} mo`} indicatorColor="var(--color-status-info)" />
        <StatCard title="Gross Margin" value={formatPercent(statement.grossMarginPercent)} indicatorColor="var(--color-status-success)" />
        <StatCard title="Net Margin" value={formatPercent(statement.netMarginPercent)} indicatorColor="var(--color-status-success)" />
        <StatCard title="Binding Constraint" value={statement.bindingConstraint} indicatorColor="var(--color-status-warning)" />
        <StatCard title="Max Daily" value={formatCurrency(statement.maxAllowedDailyRemittance)} indicatorColor="var(--color-status-purple)" />
      </div>

      {breaches.length > 0 ? (
        <div className="flex flex-col gap-2">
          {breaches.map((breach) => (
            <Banner key={breach.key} variant="warning" title="Constraint breach detected" description={breach.message} />
          ))}
        </div>
      ) : (
        <Banner variant="success" title="All pricing constraints are satisfied at the feasible tenor." />
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <FormSection title="Repriced Income Statement">
          <p className="-mt-2 text-sm font-medium text-breadcrumb-root">
            Read-only P&amp;L computed from Steps 3–6. Recalculates live as those inputs change.
          </p>

          <InfoGrid
            columns={2}
            showDividers
            items={[
              { label: "Total Customer Contract Value", value: formatCurrency(statement.totalCustomerContractValue) },
              { label: "New Financed Capital", value: formatCurrency(statement.newFinancedCapital) },
              { label: "New Cost of Funds", value: formatCurrency(statement.newCostOfFunds) },
              { label: "Total Cost of Sales", value: formatCurrency(statement.totalCostOfSales) },
              { label: "Gross Profit", value: formatCurrency(statement.grossProfit) },
              { label: "Operating Expenses", value: formatCurrency(statement.operatingExpenses) },
              { label: "Carried-Forward Recoveries", value: formatCurrency(statement.carriedForwardRecoveries) },
              { label: "Net Profit", value: formatCurrency(statement.netProfit) },
            ]}
          />
        </FormSection>
      </div>

      <div className={`rounded-md border px-4 py-3 flex items-start gap-2 ${breaches.length === 0 ? "border-status-success/30 bg-status-success/5" : "border-status-warning/30 bg-status-warning/5"}`}>
        {breaches.length === 0 ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-status-success" />
        ) : (
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-status-warning" />
        )}
        <p className={`text-sm font-medium ${breaches.length === 0 ? "text-status-success" : "text-status-warning"}`}>
          {breaches.length === 0
            ? "Ready to review and activate."
            : `${breaches.length} constraint ${breaches.length === 1 ? "breach" : "breaches"} recorded — this rule can still be activated. Matching contracts that breach will route to the Exception Queue instead of blocking the session.`}
        </p>
      </div>
    </div>
  )
}
