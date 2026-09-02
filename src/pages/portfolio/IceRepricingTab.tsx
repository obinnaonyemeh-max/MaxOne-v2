import { useMemo, useState } from "react"
import { format } from "date-fns"
import { History, Search, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import {
  Banner,
  DataTable,
  DatePickerField,
  GenericFilterPopover,
  getActiveFilterCount,
  InfoGrid,
  Modal,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { mockRepricingRules } from "@/data/mockRepricingEngine"
import {
  mockIceRepricedContracts,
  type IceRepricedContract,
  type IceRepricingStatus,
} from "@/data/mockIceRepricedContracts"
import { mockIceUploadBatches, type IceUploadBatch } from "@/data/mockIceUploadBatches"
import { getIceRepricingColumns, formatDailyRemittance } from "./iceRepricingColumns"
import { IceUploadWidget } from "./IceUploadWidget"
import { IceUploadHistorySheet } from "./IceUploadHistorySheet"
import { RerunContractModal } from "./RerunContractModal"

const repricingStatusOptions: IceRepricingStatus[] = ["Repriced", "Pending", "Exception", "Failed"]
const iceRuleOptions = mockRepricingRules.filter((rule) => rule.vehicleType === "ICE")

const defaultFilters: GenericFilterState = {
  country: [],
  city: [],
  model: [],
  rule: [],
  status: [],
}

let nextUploadSeq = mockIceUploadBatches.length + 1

function buildUploadBatchId(date: Date): string {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("")
  return `UP-ICE-${datePart}-${String(nextUploadSeq++).padStart(2, "0")}`
}

export function IceRepricingTab() {
  const [contracts, setContracts] = useState<IceRepricedContract[]>(mockIceRepricedContracts)
  const [uploadBatches, setUploadBatches] = useState<IceUploadBatch[]>(mockIceUploadBatches)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewContract, setViewContract] = useState<IceRepricedContract | null>(null)
  const [rerunContract, setRerunContract] = useState<IceRepricedContract | null>(null)
  const [showHistorySheet, setShowHistorySheet] = useState(false)

  const filterSections: FilterSection[] = useMemo(() => {
    const countries = [...new Set(contracts.map((c) => c.country))].sort()
    const cities = [...new Set(contracts.map((c) => c.city))].sort()
    const models = [...new Set(contracts.map((c) => c.vehicleModel))].sort()

    return [
      { id: "country", title: "Country", defaultExpanded: true, options: countries.map((c) => ({ value: c, label: c })) },
      { id: "city", title: "City", options: cities.map((c) => ({ value: c, label: c })) },
      { id: "model", title: "Manufacturer / Model", options: models.map((m) => ({ value: m, label: m })) },
      {
        id: "rule",
        title: "Rule Applied",
        options: iceRuleOptions.map((r) => ({ value: r.code, label: `${r.code} · ${r.version}` })),
      },
      { id: "status", title: "Status", options: repricingStatusOptions.map((s) => ({ value: s, label: s })) },
    ]
  }, [contracts])

  const activeFilterCount = getActiveFilterCount(filters)

  const filteredContracts = useMemo(() => {
    const startKey = startDate ? format(startDate, "yyyy-MM-dd") : null
    const endKey = endDate ? format(endDate, "yyyy-MM-dd") : null

    return contracts.filter((contract) => {
      if (filters.country.length > 0 && !filters.country.includes(contract.country)) return false
      if (filters.city.length > 0 && !filters.city.includes(contract.city)) return false
      if (filters.model.length > 0 && !filters.model.includes(contract.vehicleModel)) return false
      if (filters.rule.length > 0 && (!contract.ruleCode || !filters.rule.includes(contract.ruleCode))) return false
      if (filters.status.length > 0 && !filters.status.includes(contract.repricingStatus)) return false
      if (startKey && contract.lastRepricedAt < startKey) return false
      if (endKey && contract.lastRepricedAt > endKey) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !contract.contractId.toLowerCase().includes(q) &&
          !contract.championName.toLowerCase().includes(q) &&
          !contract.plateNumber.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [contracts, filters, startDate, endDate, searchQuery])

  const handleUpload = (_file: File, recordCount: number) => {
    const now = new Date()
    const newBatch: IceUploadBatch = {
      id: crypto.randomUUID(),
      batchId: buildUploadBatchId(now),
      uploadedAt: now.toISOString(),
      uploadedBy: "Desmond Nsogbuwa",
      records: recordCount,
      status: "Processing",
    }
    setUploadBatches((prev) => [newBatch, ...prev])
    toast.success("Upload started", { description: `${newBatch.batchId} is processing ${recordCount} records.` })

    setTimeout(() => {
      setUploadBatches((prev) => prev.map((b) => (b.id === newBatch.id ? { ...b, status: "Completed" } : b)))
      toast.success("Batch upload complete", { description: `${newBatch.batchId} finished processing.` })
    }, 1800)
  }

  const handleDownloadLog = (batch: IceUploadBatch) => {
    toast.success("Log downloaded", { description: `${batch.batchId} upload log downloaded.` })
  }

  const handleRerunComplete = (contract: IceRepricedContract) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contract.id
          ? {
              ...c,
              repricingStatus: "Repriced",
              dailyRemittance: c.dailyRemittance > 0 ? c.dailyRemittance : 3800,
              lastRepricedAt: new Date().toISOString().slice(0, 10),
            }
          : c
      )
    )
    toast.success("Repricing complete", { description: `${contract.contractId} has been re-evaluated.` })
  }

  const columns = getIceRepricingColumns({ onView: setViewContract, onRerun: setRerunContract })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6">
        <Banner
          variant="info"
          title="ICE contracts are managed via scheduled engine runs or bulk manual contract uploads."
          description="Uploaded contracts are processed against current active rules."
        />
      </div>

      <div className="px-6 flex justify-end">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistorySheet(true)}>
          <History className="h-4 w-4" />
          See Upload History
        </Button>
      </div>

      <div className="px-6">
        <IceUploadWidget onUpload={handleUpload} />
      </div>

      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
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
                  <GenericFilterPopover sections={filterSections} filters={filters} onFiltersChange={setFilters} />
                </PopoverContent>
              </Popover>

              <DatePickerField
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
                dateFormat="dd/MM/yyyy"
                triggerClassName="h-9 w-[150px]"
              />
              <DatePickerField
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
                dateFormat="dd/MM/yyyy"
                triggerClassName="h-9 w-[150px]"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ICE contracts..."
                className="h-9 w-64 pl-9"
              />
            </div>
          </div>

          <DataTable columns={columns} data={filteredContracts} emptyMessage="No ICE contracts match these filters." />
        </div>
      </div>

      <Modal
        open={viewContract !== null}
        onOpenChange={(open) => !open && setViewContract(null)}
        title={viewContract?.contractId}
        subtitle="ICE contract repricing details"
        secondaryAction={{ label: "Close", onClick: () => setViewContract(null) }}
      >
        {viewContract && (
          <InfoGrid
            columns={2}
            items={[
              { label: "Champion", value: `${viewContract.championName} (${viewContract.championId})` },
              { label: "Plate Number", value: viewContract.plateNumber },
              { label: "Vehicle Model", value: viewContract.vehicleModel },
              { label: "Location", value: `${viewContract.city}, ${viewContract.country}` },
              { label: "Refurbishment", value: viewContract.refurbishmentStatus },
              {
                label: "Rule Applied",
                value: viewContract.ruleCode
                  ? `${viewContract.ruleCode} · ${viewContract.ruleVersion}`
                  : "Not yet evaluated",
              },
              { label: "Repricing Status", value: viewContract.repricingStatus },
              { label: "Daily Remittance", value: formatDailyRemittance(viewContract.dailyRemittance) },
            ]}
          />
        )}
      </Modal>

      <RerunContractModal
        contract={rerunContract}
        onClose={() => setRerunContract(null)}
        onComplete={handleRerunComplete}
      />

      <IceUploadHistorySheet
        open={showHistorySheet}
        onClose={() => setShowHistorySheet(false)}
        batches={uploadBatches}
        onDownloadLog={handleDownloadLog}
      />
    </div>
  )
}
