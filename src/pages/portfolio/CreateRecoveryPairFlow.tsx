import { useState, useEffect, useMemo } from "react"

import { Modal } from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type RecoveryAgent, type RecoveryVehicle } from "@/data/mockRecoveryOfficers"

const zones = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"]

interface CreateRecoveryPairFlowProps {
  open: boolean
  onClose: () => void
  agents: RecoveryAgent[]
  vehicles: RecoveryVehicle[]
  onCreate: (input: { officerAId: string; officerBId: string; zone: string; vehicleId: string | null }) => void
}

export function CreateRecoveryPairFlow({ open, onClose, agents, vehicles, onCreate }: CreateRecoveryPairFlowProps) {
  const [officerAId, setOfficerAId] = useState("")
  const [officerBId, setOfficerBId] = useState("")
  const [zone, setZone] = useState("")
  const [vehicleId, setVehicleId] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) {
      setOfficerAId("")
      setOfficerBId("")
      setZone("")
      setVehicleId("")
      setSubmitted(false)
    }
  }, [open])

  const unassignedAgents = useMemo(
    () => agents.filter((a) => a.pairId === null && a.status === "Active"),
    [agents]
  )
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.status === "Available"), [vehicles])

  const officerAOptions = unassignedAgents.filter((a) => a.id !== officerBId)
  const officerBOptions = unassignedAgents.filter((a) => a.id !== officerAId)

  const handleCreate = () => {
    if (!officerAId || !officerBId || !zone) return
    onCreate({ officerAId, officerBId, zone, vehicleId: vehicleId || null })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Modal open={open} onOpenChange={onClose} hideHeader className="max-w-[320px]">
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          <p className="mt-6 text-center font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
            Recovery pair created
          </p>
          <p className="mt-1 text-center text-sm text-breadcrumb-root">
            The new pair is now active and ready for case assignment.
          </p>
          <button
            onClick={onClose}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Create Recovery Pair"
      subtitle="Pair two unassigned agents and issue an operational vehicle"
      className="max-w-lg"
      primaryAction={{
        label: "Create Pair",
        onClick: handleCreate,
        disabled: !officerAId || !officerBId || !zone,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-breadcrumb-root">Officer A</label>
            <Select value={officerAId} onValueChange={setOfficerAId}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {officerAOptions.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} &middot; {a.staffId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-breadcrumb-root">Officer B</label>
            <Select value={officerBId} onValueChange={setOfficerBId}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {officerBOptions.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} &middot; {a.staffId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {unassignedAgents.length < 2 && (
          <p className="text-xs text-status-warning">
            Fewer than two unassigned active agents are available right now.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-breadcrumb-root">Zone</label>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select operating zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-breadcrumb-root">Vehicle (optional)</label>
          <Select value={vehicleId} onValueChange={setVehicleId}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Assign an available vehicle" />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.plateNumber} &middot; {v.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  )
}
