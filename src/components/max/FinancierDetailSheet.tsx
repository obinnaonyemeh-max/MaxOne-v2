import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { InfoGrid } from "./InfoGrid"
import { StatusBadge } from "./StatusBadge"
import {
  type Financier,
  financierStatusVariantMap,
  remittanceStatusVariantMap,
} from "@/data/mockFinanciers"

interface FinancierDetailSheetProps {
  financier: Financier | null
  isOpen: boolean
  onClose: () => void
}

function formatCurrency(amount: number, denomination: string): string {
  const symbol = denomination === "NGN" ? "₦" : denomination === "USD" ? "$" : denomination === "GBP" ? "£" : denomination === "EUR" ? "€" : ""
  return symbol + amount.toLocaleString()
}

type SectionKey = "financier" | "loan" | "remittance"

export function FinancierDetailSheet({ financier, isOpen, onClose }: FinancierDetailSheetProps) {
  const [openSection, setOpenSection] = useState<SectionKey>("financier")

  useEffect(() => {
    setOpenSection("financier")
  }, [financier?.id])

  if (!financier) return null

  const toggleSection = (key: SectionKey) => setOpenSection(key)

  const remittanceProgress =
    financier.loanAmount > 0 ? Math.round((financier.totalAmountRemitted / financier.loanAmount) * 100) : 0

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent size="lg" className="flex flex-col h-full max-w-[40vw]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <SheetTitle className="text-sidebar-item-active">{financier.financierName}</SheetTitle>
            <StatusBadge variant={financierStatusVariantMap[financier.status]}>{financier.status}</StatusBadge>
            <StatusBadge variant={remittanceStatusVariantMap[financier.remittanceStatus]}>
              {financier.remittanceStatus}
            </StatusBadge>
          </div>
          <SheetDescription>
            {financier.financingPartner} &middot; {financier.numberOfVehicles} vehicles &middot; Added {financier.dateCreated}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-25 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Remittance Progress
              </span>
              <span className="text-sm font-medium text-sidebar-item-active">{remittanceProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: `${Math.min(100, remittanceProgress)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-breadcrumb-root">
                {formatCurrency(financier.totalAmountRemitted, financier.collectionDenomination)} remitted
              </span>
              <span className="text-breadcrumb-root">
                {formatCurrency(financier.outstandingBalance, financier.collectionDenomination)} outstanding
              </span>
            </div>
          </div>

          {/* Financier Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("financier")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Financier Details
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "financier" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "financier" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Financier Name", value: financier.financierName },
                    { label: "Financing Partner", value: financier.financingPartner },
                    { label: "Number of Vehicles", value: financier.numberOfVehicles.toLocaleString() },
                    { label: "Vehicle Cost", value: formatCurrency(financier.vehicleCost, financier.collectionDenomination) },
                    { label: "Total Vehicle Cost", value: formatCurrency(financier.totalVehicleCost, financier.collectionDenomination) },
                    { label: "Date of Purchase", value: financier.dateOfPurchase },
                    { label: "Collection Denomination", value: financier.collectionDenomination },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Loan & Contribution Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("loan")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Loan &amp; Contribution Details
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "loan" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "loan" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Loan Amount", value: formatCurrency(financier.loanAmount, financier.collectionDenomination) },
                    { label: "Tenor", value: `${financier.tenorInMonths} months` },
                    { label: "Moratorium", value: `${financier.moratoriumInMonths} months` },
                    { label: "Interest Rate", value: `${financier.interestRate}%` },
                    { label: "Transaction Fees", value: formatCurrency(financier.transactionFees, financier.collectionDenomination) },
                    { label: "Financier Contribution", value: `${financier.financierContributionPercent}%` },
                    { label: "Equity Contribution", value: `${financier.equityContributionPercent}%` },
                    { label: "Equity", value: formatCurrency(financier.equity, financier.collectionDenomination) },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Remittance & Metadata */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("remittance")}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
                Remittance &amp; Metadata
              </span>
              <ChevronDown
                className={`h-4 w-4 text-breadcrumb-root transition-transform duration-200 ${openSection === "remittance" ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === "remittance" && (
              <div className="px-4 pb-4">
                <InfoGrid
                  columns={2}
                  items={[
                    { label: "Remittance Status", value: financier.remittanceStatus },
                    { label: "Total Amount Remitted", value: formatCurrency(financier.totalAmountRemitted, financier.collectionDenomination) },
                    { label: "Outstanding Balance", value: formatCurrency(financier.outstandingBalance, financier.collectionDenomination) },
                    { label: "Status", value: financier.status },
                    { label: "Date Created", value: financier.dateCreated },
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-wrap items-center justify-start gap-2">
          <Button variant="outline" className="h-9 px-3" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
