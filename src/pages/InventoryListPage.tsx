import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Minus, SlidersHorizontal, Pencil } from "lucide-react"

import {
  TopBar,
  PageHeader,
  DataTable,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  ExpandableSearch,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CITY_HUB_OPTIONS } from "@/data/cities"
import { useCan, useCityScopedRecords } from "@/contexts/RoleSimulationContext"
import { useInventoryParts } from "@/data/inventoryStore"
import {
  availableQuantity,
  type InventoryPart,
} from "@/data/mockInventoryParts"
import { AddPartFlow } from "@/pages/inventory/AddPartFlow"
import { BulkAddQuantitiesFlow } from "@/pages/inventory/BulkAddQuantitiesFlow"
import { AdjustQuantityModal } from "@/pages/inventory/AdjustQuantityModal"
import { EditPartPriceModal } from "@/pages/inventory/EditPartPriceModal"
import type { InventoryApprovalType } from "@/data/mockInventoryApprovals"

const filterSections: FilterSection[] = [
  {
    id: "location",
    title: "Location",
    defaultExpanded: true,
    options: CITY_HUB_OPTIONS,
  },
]

const defaultFilters: GenericFilterState = {
  location: [],
}

function formatNaira(amount: number | undefined): string {
  if (amount == null) return "—"
  return "₦" + Math.round(amount).toLocaleString()
}

function getColumns(
  onEditPrice: (part: InventoryPart) => void,
  onAdjust: (part: InventoryPart, type: InventoryApprovalType) => void,
  canEditCostPrice: boolean
): ColumnDef<InventoryPart>[] {
  return [
    {
      accessorKey: "skuId",
      header: "SKU ID",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.skuId}
        </span>
      ),
    },
    {
      accessorKey: "partName",
      header: "Part name",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.partName}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.location}
        </span>
      ),
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {formatNaira(row.original.costPrice)}
        </span>
      ),
    },
    {
      accessorKey: "onHandQuantity",
      header: "On-hand Quantity",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.onHandQuantity}
        </span>
      ),
    },
    {
      id: "availableQuantity",
      header: "Available Quantity",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {availableQuantity(row.original)}
        </span>
      ),
    },
    {
      accessorKey: "awaitingPickup",
      header: "Awaiting pickup",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.awaitingPickup}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onAdjust(row.original, "Addition")
                }}
                aria-label={`Request addition for ${row.original.skuId}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Addition</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onAdjust(row.original, "Depletion")
                }}
                aria-label={`Request depletion for ${row.original.skuId}`}
              >
                <Minus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Depletion</TooltipContent>
          </Tooltip>
          {canEditCostPrice && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditPrice(row.original)
                }}
                aria-label={`Edit cost price for ${row.original.skuId}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit cost price</TooltipContent>
          </Tooltip>
          )}
        </div>
      ),
    },
  ]
}

export default function InventoryListPage() {
  const parts = useInventoryParts()
  const scopedParts = useCityScopedRecords(parts, "location")
  const canEditCostPrice = useCan("inventory.editCostPrice")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [showAddParts, setShowAddParts] = useState(false)
  const [showBulkQuantities, setShowBulkQuantities] = useState(false)
  const [editingPart, setEditingPart] = useState<InventoryPart | null>(null)
  const [adjustingPart, setAdjustingPart] = useState<InventoryPart | null>(null)
  const [adjustType, setAdjustType] = useState<InventoryApprovalType | null>(null)
  const activeFilterCount = getActiveFilterCount(filters)

  const columns = useMemo(
    () =>
      getColumns(
        setEditingPart,
        (part, type) => {
          setAdjustingPart(part)
          setAdjustType(type)
        },
        canEditCostPrice
      ),
    [canEditCostPrice]
  )

  const filteredParts = useMemo(() => {
    let result = scopedParts

    if (filters.location?.length) {
      result = result.filter((part) => filters.location!.includes(part.location))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (part) =>
          part.skuId.toLowerCase().includes(query) ||
          part.partName.toLowerCase().includes(query)
      )
    }

    return result
  }, [scopedParts, filters, searchQuery])

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Lifecycle" }, { label: "Inventory" }, { label: "Inventory List" }]}
      />
      <PageHeader
        title="Inventory List"
        subtitle="Parts stocked across hubs, with on-hand and available quantities"
        className="shrink-0"
      />

      <div className="px-4 md:px-6 flex flex-col flex-1 min-h-0">
        <div className="mt-0 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <GenericFilterPopover
                    sections={filterSections}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </PopoverContent>
              </Popover>

              <ExpandableSearch
                open={searchOpen}
                onOpenChange={setSearchOpen}
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Search SKU or part name..."
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <Button
                variant="outline"
                className="h-9 flex-1 gap-2 bg-gray-100 text-foreground hover:bg-gray-200 px-3 sm:flex-none"
                onClick={() => setShowBulkQuantities(true)}
              >
                <img src="/images/bulk_update.svg" alt="" className="h-4 w-4" />
                <span className="text-sm">Bulk Add Quantities</span>
              </Button>
              <Button
                className="h-9 flex-1 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90 px-3 sm:flex-none"
                onClick={() => setShowAddParts(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Parts</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto">
            <DataTable
              columns={columns}
              data={filteredParts}
              emptyMessage="No parts in inventory"
            />
          </div>
        </div>

        <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredParts.length / pageSize))}
            totalItems={filteredParts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="parts"
          />
        </div>
      </div>

      <AddPartFlow open={showAddParts} onClose={() => setShowAddParts(false)} />
      <BulkAddQuantitiesFlow
        open={showBulkQuantities}
        onClose={() => setShowBulkQuantities(false)}
      />
      <EditPartPriceModal
        part={canEditCostPrice ? editingPart : null}
        open={canEditCostPrice && !!editingPart}
        onOpenChange={(open) => {
          if (!open) setEditingPart(null)
        }}
      />
      <AdjustQuantityModal
        part={adjustingPart}
        type={adjustType}
        open={!!adjustingPart && !!adjustType}
        onOpenChange={(open) => {
          if (!open) {
            setAdjustingPart(null)
            setAdjustType(null)
          }
        }}
      />
    </>
  )
}
