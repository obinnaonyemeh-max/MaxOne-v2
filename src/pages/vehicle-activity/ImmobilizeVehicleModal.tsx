import { useEffect, useState } from "react"
import { Banner, Modal, StatusBadge } from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getVehicleMarkerIcon } from "@/data/mockVehicleActivity"
import type { VehicleCategory, VehicleType } from "@/data/mockVehicleRegister"

const IMMOBILISE_REASONS = [
  "Overdue payment",
  "Theft / suspected theft",
  "Geofence breach",
  "Safety incident",
  "Enforcement action",
  "Other",
]

const MOBILISE_REASONS = [
  "Payment received",
  "False alarm",
  "Enforcement cleared",
  "Issue resolved",
  "Other",
]

interface ImmobilizeVehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  immobilized: boolean
  plateNumber: string
  championName: string
  imei: string
  vehicleType: VehicleType
  category: VehicleCategory
  currentSpeed: number
  onConfirm: (payload: { reason: string; note: string }) => void
}

export function ImmobilizeVehicleModal({
  open,
  onOpenChange,
  immobilized,
  plateNumber,
  championName,
  imei,
  vehicleType,
  category,
  currentSpeed,
  onConfirm,
}: ImmobilizeVehicleModalProps) {
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const reasons = immobilized ? MOBILISE_REASONS : IMMOBILISE_REASONS

  useEffect(() => {
    if (!open) {
      setReason("")
      setNote("")
    }
  }, [open])

  const handleConfirm = () => {
    if (!reason) return
    onConfirm({ reason, note: note.trim() })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={immobilized ? "Mobilise vehicle?" : "Immobilise vehicle?"}
      subtitle={
        immobilized
          ? "This sends a secure engine-restore command to the vehicle's IoT device. The engine will be re-enabled until immobilised again."
          : "This sends a secure engine-cutoff command to the vehicle's IoT device. The engine will be disabled until re-mobilised."
      }
      className="max-w-lg"
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
      primaryAction={{
        label: immobilized ? "Confirm mobilisation" : "Confirm immobilisation",
        onClick: handleConfirm,
        disabled: !reason,
        className: immobilized
          ? undefined
          : "bg-status-danger hover:bg-status-danger/90",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white">
            <img
              src={getVehicleMarkerIcon(vehicleType, category)}
              alt=""
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sidebar-item-active font-semibold" style={{ fontSize: "15px" }}>
                {plateNumber}
              </p>
              <StatusBadge variant={immobilized ? "danger" : "success"} withDot size="sm">
                {immobilized ? "Immobilised" : "Mobilised"}
              </StatusBadge>
            </div>
            <p className="text-breadcrumb-root truncate mt-0.5" style={{ fontSize: "12px" }}>
              Champion: {championName} • IMEI {imei}
            </p>
          </div>
        </div>

        <Banner
          variant={immobilized ? "info" : "warning"}
          className="py-3 px-4 gap-3 items-start"
          title={
            immobilized
              ? `Vehicle is currently immobilised. Mobilising will restore engine power. Current speed: ${currentSpeed} kmph.`
              : `For safety, immobilisation only takes effect when the vehicle is stationary or below 20 kmph. Current speed: ${currentSpeed} kmph.`
          }
        />

        <div className="flex flex-col gap-2">
          <label className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
            {immobilized ? "Reason for mobilisation" : "Reason for immobilisation"}
          </label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-12 w-full bg-white border border-gray-200">
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-500 font-medium" style={{ fontSize: "13px" }}>
            Note (optional)
          </label>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add context for the audit log..."
            className="min-h-[96px] resize-y bg-white border-gray-200"
          />
        </div>
      </div>
    </Modal>
  )
}
