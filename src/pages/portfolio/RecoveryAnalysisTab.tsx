import { useMemo } from "react"

import { Banner } from "@/components/max"
import { type EarlyTerminationContract } from "@/data/mockEarlyTermination"
import { type SettlementQuote, buildRecoveryAnalysis } from "./earlyTerminationCalculations"
import { CollapsibleRecoverySection } from "./CollapsibleRecoverySection"

interface RecoveryAnalysisTabProps {
  contract: EarlyTerminationContract | null
  quote: SettlementQuote | null
}

export function RecoveryAnalysisTab({ contract, quote }: RecoveryAnalysisTabProps) {
  const breakdown = useMemo(() => (contract && quote ? buildRecoveryAnalysis(contract, quote) : null), [contract, quote])

  if (!breakdown) {
    return (
      <div className="px-6">
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-16">
          <p className="text-sm font-medium text-breadcrumb-root">
            Select a country, customer and contract to generate a recovery analysis.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 flex flex-col gap-4">
      <Banner
        title="How recovery is calculated"
        description={
          <>
            Every naira collected is allocated across components in proportion to each component's share of total
            contract revenue. <strong>Overdue</strong> = billed to date less recovered. <strong>Un-billed forward</strong>{" "}
            is only recouped on capitalised and sunk costs; recurring operating costs stop at what has been earned to
            date.
          </>
        }
      />

      <CollapsibleRecoverySection columns={breakdown.componentColumns} sections={breakdown.componentSections} />
      <CollapsibleRecoverySection columns={breakdown.marginColumns} sections={[breakdown.marginSection]} />
    </div>
  )
}
