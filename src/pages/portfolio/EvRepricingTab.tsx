import { useMemo, useState } from "react"
import { format } from "date-fns"
import { Search, SlidersHorizontal } from "lucide-react"
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
  mockEvRepricedContracts,
  type EvRepricedContract,
  type EvRepricingStatus,
} from "@/data/mockEvRepricedContracts"
import { getEvRepricingColumns, formatDailyRemittance } from "./evRepricingColumns"
import { RerunContractModal } from "./RerunContractModal"

const repricingStatusOptions: EvRepricingStatus[] = ["Repriced", "Pending", "Exception", "Failed"]
const evRuleOptions = mockRepricingRules.filter((rule) => rule.vehicleType === "EV")

const defaultFilters: GenericFilterState = {
  country: [],
  city: [],
  model: [],
  rule: [],
  status: [],
}

export function EvRepricingTab() {
  const [contracts, setContracts] = useState<EvRepricedContract[]>(mockEvRepricedContracts)
  const [filters, setFilters] = useState<GenericFilterState>(defaultFilters)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewContract, setViewContract] = useState<EvRepricedContract | null>(null)
  const [rerunContract, setRerunContract] = useState<EvRepricedContract | null>(null)

  const filterSections: FilterSection[] = useMemo(() => {
    const countries = [...new Set(contracts.map((c) => c.country))].sort()
    const cities = [...new Set(contracts.map((c) => c.city))].sort()
    const models = [...new Set(contracts.map((c) => c.vehicleModel))].sort()

    return [
      { id: "country", title: "Country", defaultExpanded: true, options: countries.map((c) => ({ value: c, label: c })) },
      { id: "city", title: "City", options: cities.map((c) => ({ value: c, label: c })) },
      { id: "model", title: "Model", options: models.map((m) => ({ value: m, label: m })) },
      {
        id: "rule",
        title: "Rule",
        options: evRuleOptions.map((r) => ({ value: r.code, label: `${r.code} · ${r.version}` })),
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

  const handleRerunComplete = (contract: EvRepricedContract) => {
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

  const columns = getEvRepricingColumns({ onView: setViewContract, onRerun: setRerunContract })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6">
        <Banner
          variant="info"
          title="This register is read-only."
          description="EV contracts are repriced automatically by the scheduled engine — use Re-run Repricing to reprocess a contract under the current active rule."
        />
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
                placeholder="Search contracts..."
                className="h-9 w-64 pl-9"
              />
            </div>
          </div>

          <DataTable columns={columns} data={filteredContracts} emptyMessage="No EV contracts match these filters." />
        </div>
      </div>

      <Modal
        open={viewContract !== null}
        onOpenChange={(open) => !open && setViewContract(null)}
        title={viewContract?.contractId}
        subtitle="EV contract repricing details"
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
    </div>
  )
}
