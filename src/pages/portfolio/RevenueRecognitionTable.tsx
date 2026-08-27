import { Fragment, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { type RecognitionSection } from "./revenueRecognitionCalculations"

function formatCurrency(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString()
}

interface RevenueRecognitionTableProps {
  sections: RecognitionSection[]
}

export function RevenueRecognitionTable({ sections }: RevenueRecognitionTableProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-table-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-0">
            <TableHead className="h-11 bg-table-header-bg text-table-header-text font-medium pl-4" style={{ fontSize: "13px" }}>
              Component
            </TableHead>
            <TableHead className="h-11 bg-table-header-bg text-table-header-text font-medium" style={{ fontSize: "13px" }}>
              Total Revenue
            </TableHead>
            <TableHead className="h-11 bg-table-header-bg text-table-header-text font-medium" style={{ fontSize: "13px" }}>
              % Allocation
            </TableHead>
            <TableHead className="h-11 bg-table-header-bg text-table-header-text font-medium pr-4" style={{ fontSize: "13px" }}>
              Daily Remittance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => {
            const isCollapsed = section.collapsible && collapsedSections.has(section.key)
            const isProfitSection = section.key === "profit"

            return (
              <Fragment key={section.key}>
                <TableRow className="bg-gray-25 hover:bg-gray-25 border-gray-100">
                  <TableCell colSpan={4} className="py-2 pl-4">
                    {section.collapsible ? (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.key)}
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-breadcrumb-root"
                      >
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                        {section.title}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">{section.title}</span>
                    )}
                  </TableCell>
                </TableRow>
                {!isCollapsed &&
                  section.rows.map((row) => (
                    <TableRow key={row.key} className="border-gray-100">
                      <TableCell className={`pl-4 text-sm ${isProfitSection ? "font-semibold text-sidebar-item-active" : "font-medium text-table-text-primary"}`}>
                        {row.label}
                      </TableCell>
                      <TableCell className={`text-sm ${isProfitSection ? "font-semibold text-sidebar-item-active" : "font-medium text-table-text"}`}>
                        {formatCurrency(row.totalRevenue)}
                      </TableCell>
                      <TableCell className={`text-sm ${isProfitSection ? "font-semibold text-sidebar-item-active" : "font-medium text-table-text"}`}>
                        {row.percentAllocation.toFixed(2)}%
                      </TableCell>
                      <TableCell className={`pr-4 text-sm ${isProfitSection ? "font-semibold text-sidebar-item-active" : "font-medium text-table-text"}`}>
                        {formatCurrency(row.dailyRemittance)}
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
