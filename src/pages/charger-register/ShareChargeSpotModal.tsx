import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Modal } from "@/components/max"
import type { ChargeSpot } from "@/data/mockChargerData"

interface ShareChargeSpotModalProps {
  open: boolean
  spot: ChargeSpot | null
  onOpenChange: (open: boolean) => void
}

export function getChargeSpotShareLink(spotId: string): string {
  const token = btoa(spotId)
    .replace(/=+$/, "")
    .replace(/[+\/]/g, "")
    .padEnd(16, "A")
    .slice(0, 16)
  return `https://falcon/maps/${token}`
}

export function ShareChargeSpotModal({
  open,
  spot,
  onOpenChange,
}: ShareChargeSpotModalProps) {
  const [copied, setCopied] = useState(false)
  const shareLink = spot ? getChargeSpotShareLink(spot.id) : ""

  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const handleCopy = async () => {
    if (!shareLink) return
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast.success("Link copied", {
        description: "Charge spot location link copied to clipboard",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Share charge spots location"
      className="max-w-lg"
    >
      {spot ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <img
              src="/images/charge_spot.svg"
              alt=""
              className="h-12 w-12 shrink-0"
            />
            <div className="min-w-0 flex flex-col gap-1 pt-0.5">
              <p
                className="text-sidebar-item-active font-semibold"
                style={{ fontSize: "16px" }}
              >
                {spot.title}
              </p>
              <p className="text-breadcrumb-root" style={{ fontSize: "13px" }}>
                Long {spot.location.lng.toFixed(6)}, Lat{" "}
                {spot.location.lat.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex flex-col gap-2">
            <p className="text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Copy live link below
            </p>
            <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3">
              <p
                className="min-w-0 flex-1 truncate text-gray-500"
                style={{ fontSize: "13px" }}
              >
                {shareLink}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 font-semibold text-sidebar-item-active hover:opacity-80 transition-opacity"
                style={{ fontSize: "12px" }}
              >
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-breadcrumb-root" style={{ fontSize: "14px" }}>
          No charge spot selected.
        </p>
      )}
    </Modal>
  )
}
