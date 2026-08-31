import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, SlidersHorizontal, Upload } from "lucide-react"

import {
  ConfirmModal,
  DataTable,
  ExpandableSearch,
  GenericFilterPopover,
  Pagination,
  Toast,
  getActiveFilterCount,
  useToast,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { deleteIdentifier, updateIdentifier, useInboundStore } from "@/data/inboundStore"
import type { VehicleIdentifier } from "@/data/mockBatchDetailRows"
import { useCan } from "@/contexts/RoleSimulationContext"

import { AddIdentifierModal } from "./AddIdentifierModal"
import { getIdentifierColumns } from "./columns"
import { defaultIdentifierFilters, identifierFilterSections } from "./options"

export function VehicleIdsTab({
  batchId,
  subBatchId,
  onAddIdentifier,
  onUploadCsv,
  onSubBatchRemoved,
}: {
  batchId: string
  subBatchId?: string
  onAddIdentifier?: () => void
  onUploadCsv?: () => void
  onSubBatchRemoved?: (removedSubBatchId: string) => void
}) {
  const navigate = useNavigate()
  const { identifiers, subBatches } = useInboundStore()
  const canAddIdentifier = useCan("inbound.batches.addIdentifier")
  const canUploadCsv = useCan("inbound.batches.uploadCsv")
  const canEditIdentifier = useCan("inbound.batches.editIdentifier")
  const scopedToSubBatch = Boolean(subBatchId)

  const [filters, setFilters] = useState<GenericFilterState>(defaultIdentifierFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<VehicleIdentifier | null>(null)
  const { message: toast, variant: toastVariant, showToast } = useToast()

  const batchIdentifiers = useMemo(
    () => identifiers.filter((row) => row.batchId === batchId),
    [identifiers, batchId],
  )

  const rows = useMemo(() => {
    const scoped = subBatchId
      ? batchIdentifiers.filter((row) => row.subBatchId === subBatchId)
      : batchIdentifiers

    return scoped.filter((row) => {
      if (!scopedToSubBatch && filters.subBatchId.length > 0 && !filters.subBatchId.includes(row.subBatchId)) {
        return false
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const haystack = [
          row.subBatchId,
          row.chassisVin,
          row.engineNo,
          row.ignitionNo,
          row.batterySn,
          row.color,
          row.receiver,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [batchIdentifiers, filters.subBatchId, scopedToSubBatch, searchQuery, subBatchId])

  const subBatchOptions = useMemo(
    () =>
      [...new Set(subBatches.filter((sb) => sb.batchId === batchId).map((sb) => sb.subBatchId))].sort(),
    [batchId, subBatches],
  )

  const filterCount = getActiveFilterCount(filters)
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const showCreateActions = !scopedToSubBatch && (canUploadCsv || canAddIdentifier)

  const columns = useMemo(
    () =>
      getIdentifierColumns({
        showSubBatchId: !scopedToSubBatch,
        onSubBatchClick: (id) => navigate(`/inbound/batches/${batchId}/sub-batches/${id}`),
        onEdit: canEditIdentifier ? setEditing : undefined,
        onDelete: canEditIdentifier ? setPendingDeleteId : undefined,
      }),
    [batchId, canEditIdentifier, navigate, scopedToSubBatch],
  )

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return
    const { removedSubBatchId } = deleteIdentifier(pendingDeleteId)
    setPendingDeleteId(null)
    if (removedSubBatchId) {
      onSubBatchRemoved?.(removedSubBatchId)
    }
  }

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
            <div className="flex items-center gap-2">
              {!scopedToSubBatch && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {filterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {filterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={identifierFilterSections(subBatchOptions)}
                      filters={filters}
                      onFiltersChange={(next) => {
                        setFilters(next)
                        setCurrentPage(1)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}

              <ExpandableSearch
                open={searchOpen}
                onOpenChange={setSearchOpen}
                value={searchQuery}
                onValueChange={(value) => {
                  setSearchQuery(value)
                  setCurrentPage(1)
                }}
                placeholder="Search chassis, engine, sub-batch..."
                inputClassName="w-64"
              />

              <span className="text-sm font-medium text-muted-foreground">
                {rows.length} identifier{rows.length !== 1 ? "s" : ""}
              </span>
            </div>

            {showCreateActions && (
              <div className="flex items-center gap-2">
                {canUploadCsv && (
                  <Button variant="outline" className="h-9 gap-2" onClick={onUploadCsv}>
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
            <DataTable
              columns={columns}
              data={pagedRows}
              emptyMessage={
                scopedToSubBatch
                  ? "No vehicle identifiers in this sub-batch."
                  : "No vehicle identifiers yet. Upload a CSV or add an identifier to create a sub-batch."
              }
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={rows.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            itemLabel="identifiers"
          />
        </div>
      </div>

      <AddIdentifierModal
        open={Boolean(editing)}
        identifier={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        onSubmit={(input) => {
          if (!editing) return
          updateIdentifier(editing.id, input)
          showToast("Identifier updated")
          setEditing(null)
        }}
      />
      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
        title="Delete identifier"
        subtitle="This removes the vehicle identifier. If it is the last one in its sub-batch, that sub-batch will also be removed."
        variant="destructive"
        primaryAction={{
          label: "Delete",
          onClick: handleConfirmDelete,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setPendingDeleteId(null),
        }}
      />
      <Toast message={toast} variant={toastVariant} />
    </>
  )
}
