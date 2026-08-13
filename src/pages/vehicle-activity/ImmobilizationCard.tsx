import { StatusBadge } from "@/components/max/StatusBadge"
import { Button } from "@/components/ui/button"

interface ImmobilizationCardProps {
  immobilized: boolean
  onImmobiliseClick: () => void
  onDiagnosticsClick: () => void
  className?: string
}

export function ImmobilizationCard({
  immobilized,
  onImmobiliseClick,
  onDiagnosticsClick,
  className,
}: ImmobilizationCardProps) {
  return (
    <div className={`bg-content-card border border-border rounded-lg p-5 flex flex-col ${className ?? ""}`}>
      <div className="flex items-start gap-3 mb-4">
        <div
          className="shrink-0 rounded-lg flex items-center justify-center"
          style={{
            width: "44px",
            height: "44px",
            backgroundColor: "rgba(220, 38, 38, 0.08)",
          }}
        >
          <img
            src="/images/lock_halo.png"
            alt=""
            className="object-contain"
            style={{ width: "32px", height: "32px" }}
          />
        </div>
        <div>
          <h3 className="text-sidebar-item-active" style={{ fontSize: "16px", fontWeight: 600 }}>
            Immobilization
          </h3>
          <p className="text-breadcrumb-root mt-0.5" style={{ fontSize: "13px" }}>
            {immobilized ? "Remotely restore engine power" : "Remotely cut engine / restore"}
          </p>
        </div>
      </div>

      <p
        className="text-breadcrumb-root mb-6"
        style={{ fontSize: "13px", lineHeight: 1.6 }}
      >
        Vehicle is currently{" "}
        <StatusBadge
          variant={immobilized ? "danger" : "success"}
          withDot
          size="sm"
          className="align-middle mx-1"
        >
          {immobilized ? "Immobilised" : "Mobilised"}
        </StatusBadge>{" "}
        {immobilized
          ? "Mobilisation sends a secure engine-restore command to the on-board IoT device."
          : "Immobilisation sends a secure engine-cutoff command to the on-board IoT device."}
      </p>

      <div className="mt-auto flex flex-col gap-3 w-full">
        <Button
          onClick={onImmobiliseClick}
          className={
            immobilized
              ? "h-11 w-full bg-sidebar-item-active hover:bg-sidebar-item-active/90 text-white"
              : "h-11 w-full bg-status-danger hover:bg-status-danger/90 text-white"
          }
        >
          {immobilized ? "Mobilise Vehicle" : "Immobilise Vehicle"}
        </Button>
        <Button
          variant="outline"
          onClick={onDiagnosticsClick}
          className="h-11 w-full"
        >
          Request Diagnostics
        </Button>
      </div>
    </div>
  )
}
