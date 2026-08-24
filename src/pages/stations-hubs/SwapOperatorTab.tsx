import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search, UserPlus } from "lucide-react"
import {
  ConfirmModal,
  DataTable,
  Pagination,
  StatusBadge,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReassignTechnicianModal } from "@/pages/falcon-alerts/ReassignTechnicianModal"
import {
  assignOperatorToStation,
  getOperatorsForStation,
  revokeOperatorAccess,
  swapOperatorStatusVariantMap,
  type StationSwapOperator,
} from "@/data/mockStationOperators"

interface SwapOperatorTabProps {
  stationId: string
  stationName: string
}

export function SwapOperatorTab({ stationId, stationName }: SwapOperatorTabProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [version, setVersion] = useState(0)
  const [assignOpen, setAssignOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<StationSwapOperator | null>(null)

  const operators = useMemo(
    () => getOperatorsForStation(stationId),
    [stationId, version]
  )

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return operators
    return operators.filter(
      (operator) =>
        operator.name.toLowerCase().includes(query) ||
        operator.maxId.toLowerCase().includes(query) ||
        operator.status.toLowerCase().includes(query)
    )
  }, [operators, searchQuery])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [currentPage, filtered, pageSize])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const assignedTechnicianIds = operators.map((operator) => operator.technicianId)

  const columns: ColumnDef<StationSwapOperator>[] = [
    {
      accessorKey: "name",
      header: "Operator",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src="/images/champvatar.png"
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "maxId",
      header: "MAX ID",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.maxId}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={swapOperatorStatusVariantMap[row.original.status]} withDot>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "dateAssigned",
      header: "Date assigned",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.dateAssigned}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-status-danger border-status-danger/30 hover:bg-status-danger/10"
          onClick={(event) => {
            event.stopPropagation()
            setRevokeTarget(row.original)
          }}
        >
          Revoke access
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex items-center gap-2 px-2 py-2">
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search operator or MAX ID..."
                className="h-9 w-72"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false)
                    setSearchQuery("")
                    setCurrentPage(1)
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
                  setCurrentPage(1)
                }}
              >
                ×
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}

          <Button
            className="ml-auto h-9 gap-2 bg-brand-dark px-3 text-white hover:bg-brand-dark/90"
            onClick={() => setAssignOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            <span className="text-sm">Assign swap operator</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginated}
            emptyMessage="No swap operators to show yet."
          />
        </div>
      </div>

      <div className="mt-1 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          itemLabel="operators"
        />
      </div>

      <ReassignTechnicianModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        title="Assign swap operator"
        subtitle={`Search and select an operator to assign to ${stationName}.`}
        primaryLabel="Assign"
        searchPlaceholder="Search operator, specialty or city…"
        entityLabel="operator"
        excludeIds={assignedTechnicianIds}
        onReassign={(technician) => {
          assignOperatorToStation(stationId, technician)
          setVersion((current) => current + 1)
        }}
      />

      <ConfirmModal
        open={Boolean(revokeTarget)}
        onOpenChange={(next) => {
          if (!next) setRevokeTarget(null)
        }}
        variant="destructive"
        title="Revoke operator access?"
        subtitle={
          revokeTarget
            ? `${revokeTarget.name} will no longer be able to operate swaps at this station.`
            : undefined
        }
        secondaryAction={{
          label: "Cancel",
          onClick: () => setRevokeTarget(null),
        }}
        primaryAction={{
          label: "Revoke access",
          onClick: () => {
            if (!revokeTarget) return
            revokeOperatorAccess(revokeTarget.id)
            setRevokeTarget(null)
            setVersion((current) => current + 1)
            setCurrentPage(1)
          },
        }}
      />
    </>
  )
}
