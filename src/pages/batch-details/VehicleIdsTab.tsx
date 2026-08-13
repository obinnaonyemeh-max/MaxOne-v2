import { Plus, Upload } from "lucide-react"
import { DataTable } from "@/components/max"
import { Button } from "@/components/ui/button"
import { mockIdentifiers } from "@/data/mockBatchDetailRows"
import { useCan } from "@/contexts/RoleSimulationContext"
import { identifierColumns } from "./columns"

export function VehicleIdsTab({ onAddIdentifier }: { onAddIdentifier: () => void }) {
  const canAddIdentifier = useCan("inbound.batches.addIdentifier")
  const canUploadCsv = useCan("inbound.batches.uploadCsv")

  return (
    <div className="flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
        <span className="text-sm font-medium text-muted-foreground">
          {mockIdentifiers.length} identifier{mockIdentifiers.length !== 1 ? "s" : ""}
        </span>
        {(canUploadCsv || canAddIdentifier) && (
          <div className="flex items-center gap-2">
            {canUploadCsv && (
              <Button variant="outline" className="h-9 gap-2">
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
            )}
            {canAddIdentifier && (
              <Button className="h-9 gap-2" onClick={onAddIdentifier}>
                <Plus className="h-4 w-4" />
                Add Identifier
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <DataTable columns={identifierColumns} data={mockIdentifiers} />
      </div>
    </div>
  )
}
