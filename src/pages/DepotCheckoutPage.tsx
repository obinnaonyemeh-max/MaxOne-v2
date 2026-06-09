import { useState, useMemo } from "react"
import { Loader2, FileText } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { TopBar, PageHeader, StatusBadge, DataTable, Toast, useToast } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ReleaseVehicle {
  id: string
  vehicleId: string
  plateNumber: string
  description: string
}

const checkoutProfile = {
  initials: "AO",
  name: "Adebayo Okon",
  reference: "BID-00891 · Lagos Disposal Run #14",
  paymentStatus: "Payment verified",
}

const releaseVehicles: ReleaseVehicle[] = [
  {
    id: "v1",
    vehicleId: "VH-00421",
    plateNumber: "LND-421-HB",
    description: "Honda CB125F · 2W · ICE · Lagos Main",
  },
  {
    id: "v2",
    vehicleId: "VH-00421",
    plateNumber: "LND-421-HB",
    description: "Honda CB125F · 2W · ICE · Lagos Main",
  },
]

export default function DepotCheckoutPage() {
  const [pickupCode, setPickupCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validated, setValidated] = useState(false)
  const [releasedIds, setReleasedIds] = useState<string[]>(["v2"])
  const { message, variant, showToast } = useToast()

  const handleValidate = () => {
    setIsValidating(true)
    setTimeout(() => {
      setIsValidating(false)
      setValidated(true)
    }, 1500)
  }

  const handleMarkReleased = (id: string) => {
    setReleasedIds((prev) => [...prev, id])
  }

  const columns = useMemo<ColumnDef<ReleaseVehicle>[]>(
    () => [
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        cell: ({ row }) => (
          <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
            {row.original.vehicleId}
          </span>
        ),
      },
      {
        accessorKey: "plateNumber",
        header: "Plate No.",
        cell: ({ row }) => (
          <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
            {row.original.plateNumber}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
            {row.original.description}
          </span>
        ),
      },
      {
        id: "transferDocs",
        header: "Transfer Docs",
        cell: ({ row }) =>
          releasedIds.includes(row.original.id) ? (
            <StatusBadge variant="info">VAMS → Disposed</StatusBadge>
          ) : (
            <StatusBadge variant="success" withDot>
              Ready
            </StatusBadge>
          ),
      },
      {
        id: "release",
        header: "Release",
        cell: ({ row }) =>
          releasedIds.includes(row.original.id) ? (
            <StatusBadge variant="success" withDot>
              Released
            </StatusBadge>
          ) : (
            <Button
              onClick={() => handleMarkReleased(row.original.id)}
              className="h-9 px-4 bg-brand-dark text-white hover:bg-brand-dark/90"
            >
              Release
            </Button>
          ),
      },
    ],
    [releasedIds]
  )

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Disposal & Auction" }, { label: "Depot Checkout" }]}
      />
      <PageHeader
        title="Depot Checkout"
        subtitle="Release auctioned vehicles from the depot to buyers once payment clears"
        className="shrink-0"
      />

      <div className="px-6 pt-24 flex flex-1 min-h-0 items-start justify-center overflow-y-auto">
        {!validated ? (
          <div className="w-full max-w-md space-y-3">
            <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "15px" }}>
              Enter Pickup Code
            </h3>
            <div className="flex items-center gap-3">
              <Input
                value={pickupCode}
                onChange={(e) => setPickupCode(e.target.value)}
                placeholder="PU - XXXX - XXXX"
                className="h-12 flex-1"
                disabled={isValidating}
              />
              <Button
                onClick={handleValidate}
                disabled={!pickupCode.trim() || isValidating}
                className="h-12 px-6 bg-brand-dark text-white hover:bg-brand-dark/90"
              >
                {isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isValidating ? "Validating..." : "Validate"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl pb-10">
            <div className="bg-content-card border border-border rounded-lg px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-brand-dark font-semibold shrink-0">
                    {checkoutProfile.initials}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-sidebar-item-active text-[17px] tracking-[-0.17px]">
                      {checkoutProfile.name}
                    </p>
                    <p className="font-medium text-breadcrumb-root text-[13px] tracking-[-0.13px]">
                      {checkoutProfile.reference}
                    </p>
                  </div>
                </div>
                <StatusBadge variant="info">{checkoutProfile.paymentStatus}</StatusBadge>
              </div>

              <div className="border-t border-border mt-5 pt-5">
                <p className="font-semibold text-breadcrumb-root text-[11px] tracking-[0.5px] uppercase mb-3">
                  Vehicles to Release
                </p>

                <div className="rounded-lg border border-table-border py-2">
                  <DataTable columns={columns} data={releaseVehicles} />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <Button
                    variant="outline"
                    className="h-10 gap-2"
                    onClick={() =>
                      showToast("Checkout receipt generated and sent to adebayo@example.com")
                    }
                  >
                    <FileText className="h-4 w-4" />
                    Generate Receipt
                  </Button>
                  <Button
                    className="h-10 bg-brand-dark text-white hover:bg-brand-dark/90"
                    onClick={() => {
                      setValidated(false)
                      setPickupCode("")
                      setReleasedIds(["v2"])
                    }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast message={message} variant={variant} />
    </>
  )
}
