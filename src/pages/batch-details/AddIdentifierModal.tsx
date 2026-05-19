import { Modal } from "@/components/max"
import { Input } from "@/components/ui/input"

export function AddIdentifierModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Vehicle Identifier"
      subtitle="Enter the vehicle identifier details below."
      maxHeight="85vh"
      className="max-w-2xl"
      primaryAction={{
        label: "Add Identifier",
        onClick: () => onOpenChange(false),
        icon: true,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
          <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
            Vehicle Identifiers
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Chassis Number (VIN)</label>
            <Input placeholder="Enter chassis number (VIN)" className="h-12 bg-input-soft" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Engine Number</label>
            <Input placeholder="Enter engine number" className="h-12 bg-input-soft" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Ignition Number</label>
            <Input placeholder="Enter ignition number" className="h-12 bg-input-soft" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Battery Serial Number</label>
            <Input placeholder="Enter battery serial number" className="h-12 bg-input-soft" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Color</label>
            <Input placeholder="Enter color" className="h-12 bg-input-soft" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>Receiver / Destination Unit</label>
            <Input placeholder="Enter receiver / destination unit" className="h-12 bg-input-soft" />
          </div>
        </div>
      </div>
    </Modal>
  )
}
