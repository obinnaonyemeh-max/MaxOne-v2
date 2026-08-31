import { useState } from "react"
import { Info } from "lucide-react"
import { Banner, DatePickerField } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TransferUploadSection } from "@/pages/transfer-detail/TransferUploadSection"

const LIC_DOCS = [
  { id: "vlhp",    label: "Vehicle License / Hackney Permit (VL/HP)" },
  { id: "rw",      label: "Road Worthiness (RW)"                     },
  { id: "mot",     label: "MOT"                                       },
  { id: "sc",      label: "State Carriage"                           },
  { id: "autovin", label: "Autovin"                                  },
]

type DocState = { expiry: Date | undefined; file: File | null }

const initDocStates = (): Record<string, DocState> =>
  Object.fromEntries(LIC_DOCS.map(({ id }) => [id, { expiry: undefined, file: null }]))

interface Props {
  onMarkCompleted: () => void
}

export function LicensingStageBody({ onMarkCompleted }: Props) {
  const [plateNumber, setPlateNumber] = useState("")
  const [docStates, setDocStates]     = useState<Record<string, DocState>>(initDocStates)

  const setDocExpiry = (id: string, expiry: Date | undefined) =>
    setDocStates((prev) => ({ ...prev, [id]: { ...prev[id], expiry } }))

  const setDocFile = (id: string, file: File) =>
    setDocStates((prev) => ({ ...prev, [id]: { ...prev[id], file } }))

  return (
    <>
      <Banner
        variant="info"
        icon={<Info className="h-5 w-5 text-status-info shrink-0" />}
        title="All 5 documents must be uploaded with valid expiry dates before licensing can be marked complete."
      />

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

      {LIC_DOCS.map(({ id, label }) => {
        const state = docStates[id]
        return (
          <div key={id} className="flex flex-col gap-3">
            <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "13px" }}>
              {label} <span className="text-status-danger">*</span>
            </p>
            <DatePickerField
              value={state.expiry}
              onChange={(d) => setDocExpiry(id, d)}
              placeholder="Expiry date"
            />
            <TransferUploadSection
              uploadedFile={state.file}
              onFileSelect={(f) => setDocFile(id, f)}
              showCard={false}
            />
          </div>
        )
      })}

      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-8 text-xs bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onMarkCompleted}
        >
          Submit licence and registration
        </Button>
      </div>
    </>
  )
}
