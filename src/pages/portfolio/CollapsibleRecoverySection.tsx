import { Fragment, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatCurrency } from "./earlyTerminationCalculations"
import { type RecoverySection } from "./earlyTerminationCalculations"

function cellClass(isTotal?: boolean) {
  return `text-sm ${isTotal ? "font-semibold text-sidebar-item-active" : "font-medium text-table-text"}`
}

interface CollapsibleRecoverySectionProps {
  columns: string[]
  sections: RecoverySection[]
}

export function CollapsibleRecoverySection({ columns, sections }: CollapsibleRecoverySectionProps) {
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
            {columns.map((label, i) => (
              <TableHead
                key={label}
                className={`h-11 bg-table-header-bg text-table-header-text font-medium uppercase ${i === columns.length - 1 ? "pr-4" : ""}`}
                style={{ fontSize: "13px" }}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => {
            const isCollapsed = collapsedSections.has(section.key)

            return (
              <Fragment key={section.key}>
                <TableRow className="bg-gray-25 hover:bg-gray-25 border-gray-100">
                  <TableCell colSpan={columns.length + 1} className="py-2 pl-4">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.key)}
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-breadcrumb-root"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                      {section.title}
                    </button>
                  </TableCell>
                </TableRow>
                {!isCollapsed &&
                  section.rows.map((row) => (
                    <TableRow key={row.key} className="border-gray-100">
                      <TableCell className={`pl-4 ${cellClass(row.isTotal)}`}>
                        <div>{row.label}</div>
                        {row.note && <div className="mt-0.5 text-xs font-normal italic text-muted-foreground">{row.note}</div>}
                      </TableCell>
                      {row.values.map((value, i) => (
                        <TableCell key={i} className={`${cellClass(row.isTotal)} ${i === row.values.length - 1 ? "pr-4" : ""}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      ))}
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
