import { useState } from "react"
import { DatePickerField } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  onMarkCompleted: () => void
}

export function InsuranceStageBody({ onMarkCompleted }: Props) {
  const [policyNumber, setPolicyNumber] = useState("")
  const [policyExpiry, setPolicyExpiry] = useState<Date | undefined>(undefined)
  const [insurer, setInsurer]           = useState("")

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 font-medium block mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px" }}>
            Policy Number
          </label>
          <Input
            placeholder="Policy number"
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            className="h-9 bg-white"
          />
        </div>
        <div>
          <label className="text-gray-400 font-medium block mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px" }}>
            Policy Expiry
          </label>
          <DatePickerField
            value={policyExpiry}
            onChange={setPolicyExpiry}
            placeholder="dd/mm/yyyy"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-400 font-medium block mb-1.5 uppercase tracking-wide" style={{ fontSize: "11px" }}>
          Insurer
        </label>
        <Input
          placeholder="Insurance provider"
          value={insurer}
          onChange={(e) => setInsurer(e.target.value)}
          className="h-9 bg-white"
        />
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onMarkCompleted}
        >
          Confirm insurance
        </Button>
      </div>
    </>
  )
}
