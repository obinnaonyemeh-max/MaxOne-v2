import { useState } from "react"
import { SlidersHorizontal, Upload } from "lucide-react"
import {
  DataTable,
  GenericFilterPopover,
  getActiveFilterCount,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { mockDocuments } from "@/data/mockBatchDetailRows"
import { documentColumns } from "./columns"
import { defaultDocFilters, docFilterSections } from "./options"

export function DocumentsTab({ onUpload }: { onUpload: () => void }) {
  const [docFilters, setDocFilters] = useState<GenericFilterState>(defaultDocFilters)
  const docActiveFilterCount = getActiveFilterCount(docFilters)

  return (
    <div className="mt-4 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filter</span>
                {docActiveFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                    {docActiveFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <GenericFilterPopover
                sections={docFilterSections}
                filters={docFilters}
                onFiltersChange={setDocFilters}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          className="h-9 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
          onClick={onUpload}
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DataTable
          columns={documentColumns}
          data={mockDocuments}
          emptyMessage="No documents yet. Select a type and upload a file."
        />
      </div>
    </div>
  )
}
