import { Download } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ContractDocumentDetails {
  championName: string
  championId: string
  contractId: string
  startDate: string
  endDate: string
  vehicleAssigned: string
  dailyRemittance: string
  outstandingBalance: string
  status: string
}

interface ContractDocumentModalProps {
  open: boolean
  onClose: () => void
  contract: ContractDocumentDetails
}

export function ContractDocumentModal({ open, onClose, contract }: ContractDocumentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle>Contract Document</DialogTitle>
          <DialogDescription>MAX-HP-{contract.contractId}.pdf</DialogDescription>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Document Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                <svg className="h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-breadcrumb-root">
                  MAX Fleet Operations
                </p>
                <h3 className="text-lg font-bold text-brand-dark">Hire Purchase Contract Agreement</h3>
              </div>
            </div>
            <div className="h-px bg-gray-200" />
          </div>

          {/* Parties */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Parties</p>
            <div className="text-sm text-sidebar-item-active leading-relaxed space-y-1">
              <p>
                <span className="font-medium">Lessor:</span> MAX Fleet Operations Ltd. ("MAX")
              </p>
              <p>
                <span className="font-medium">Champion:</span> {contract.championName} ({contract.championId})
              </p>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Contract Terms</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <p><span className="text-breadcrumb-root">Contract ID:</span>{" "}<span className="text-sidebar-item-active">{contract.contractId}</span></p>
              <p><span className="text-breadcrumb-root">Status:</span>{" "}<span className="text-sidebar-item-active">{contract.status}</span></p>
              <p><span className="text-breadcrumb-root">Start Date:</span>{" "}<span className="text-sidebar-item-active">{contract.startDate}</span></p>
              <p><span className="text-breadcrumb-root">End Date:</span>{" "}<span className="text-sidebar-item-active">{contract.endDate}</span></p>
              <p><span className="text-breadcrumb-root">Vehicle Assigned:</span>{" "}<span className="text-sidebar-item-active">{contract.vehicleAssigned}</span></p>
              <p><span className="text-breadcrumb-root">Daily Remittance:</span>{" "}<span className="text-sidebar-item-active">{contract.dailyRemittance}</span></p>
              <p><span className="text-breadcrumb-root">Outstanding Balance:</span>{" "}<span className="text-sidebar-item-active">{contract.outstandingBalance}</span></p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Terms &amp; Conditions</p>
            <ol className="list-decimal list-inside text-sm text-sidebar-item-active leading-relaxed space-y-1.5">
              <li>The Champion agrees to remit the daily amount stated above for the full duration of this contract.</li>
              <li>Full ownership of the vehicle described above transfers to the Champion upon settlement of the outstanding balance.</li>
              <li>MAX may pause or terminate this contract for non-remittance, vehicle misuse, or breach of these terms.</li>
              <li>The Champion is responsible for the vehicle's upkeep, licensing and insurance for the duration of this contract.</li>
              <li>Any disputes arising from this agreement shall be resolved in accordance with MAX Fleet Operations' standard dispute process.</li>
            </ol>
          </div>

          {/* Signatures */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">Signatures</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-2">
                <div className="h-px border-t border-dashed border-gray-300" />
                <p className="text-xs text-breadcrumb-root">MAX Fleet Operations (Authorised Signatory)</p>
              </div>
              <div className="space-y-6 pt-2">
                <div className="h-px border-t border-dashed border-gray-300" />
                <p className="text-xs text-breadcrumb-root">{contract.championName} (Champion)</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />
          <p className="text-[10px] text-center text-breadcrumb-root">
            Document generated {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            {" "}&middot; {contract.contractId} &middot; MAX Fleet Operations Ltd.
          </p>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex items-center gap-2">
          <Button variant="outline" className="h-9" onClick={onClose}>
            Close
          </Button>
          <Button
            className="h-9 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => toast.info("PDF generation isn't available in this preview.")}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
