import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { DataTable, Pagination } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type WriteOffBatch } from "@/data/mockWriteOffBatches"
import { getWriteOffColumns, type SortDirection, type SortKey } from "./writeOffColumns"

interface WriteOffTableProps {
  batches: WriteOffBatch[]
  isLoading?: boolean
  onAction: (action: "approve" | "reject", row: WriteOffBatch) => void
}

export function WriteOffTable({ batches, isLoading = false, onAction }: WriteOffTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const filteredBatches = useMemo(() => {
    if (!searchQuery) return batches
    const q = searchQuery.toLowerCase()
    return batches.filter(
      (batch) =>
        batch.referenceId.toLowerCase().includes(q) ||
        batch.submittedBy.toLowerCase().includes(q)
    )
  }, [batches, searchQuery])

  const sortedBatches = useMemo(() => {
    if (!sortKey) return filteredBatches
    const sorted = [...filteredBatches].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue
      }
      return String(aValue).localeCompare(String(bValue))
    })
    return sortDirection === "asc" ? sorted : sorted.reverse()
  }, [filteredBatches, sortKey, sortDirection])

  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedBatches.slice(start, start + pageSize)
  }, [sortedBatches, currentPage, pageSize])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const allSelected = paginatedBatches.length > 0 && paginatedBatches.every((b) => selectedIds.includes(b.id))

  const columns = getWriteOffColumns({
    selectedIds,
    allSelected,
    onToggle: (id) =>
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])),
    onToggleAll: () =>
      setSelectedIds((prev) =>
        allSelected
          ? prev.filter((id) => !paginatedBatches.some((b) => b.id === id))
          : [...new Set([...prev, ...paginatedBatches.map((b) => b.id)])]
      ),
    sortKey,
    sortDirection,
    onSort: handleSort,
    onAction,
  })

  return (
    <div className="px-6 mt-2 flex flex-col flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2 shrink-0">
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by reference, submitter..."
                className="h-9 w-80"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false)
                    setSearchQuery("")
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery("")
                }}
              >
                ×
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={paginatedBatches}
            isLoading={isLoading}
            emptyMessage="No write-off batches found."
          />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(sortedBatches.length / pageSize))}
          totalItems={sortedBatches.length}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="write-off batches"
        />
      </div>
    </div>
  )
}
