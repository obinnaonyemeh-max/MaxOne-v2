import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  onMarkCompleted: () => void
}

export function LicensingStageBody({ onMarkCompleted }: Props) {
  const [plateNumber, setPlateNumber] = useState("")

  return (
    <>
      <div>
        <label className="text-gray-600 font-medium block mb-1.5" style={{ fontSize: "12px" }}>
          Plate Number
        </label>
        <Input
          placeholder="Enter plate number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="h-9 bg-white"
        />
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          disabled={!plateNumber.trim()}
          onClick={onMarkCompleted}
        >
          Submit licence and registration
        </Button>
      </div>
    </>
  )
}
