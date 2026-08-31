import { useState } from "react"
import { SlidersHorizontal, Calendar as CalendarIcon, PlayCircle, CheckCircle2, UserRoundPlus } from "lucide-react"
import {
  DataTable,
  Pagination,
  StatCard,
  ExpandableSearch,
  GenericFilterPopover,
  getActiveFilterCount,
  type GenericFilterState,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { mockRegistrationRecords, type RegistrationRecord } from "@/data/mockBatchDetailRows"
import { getRegistrationColumns } from "./columns"
import { defaultRegFilters, getRegistrationStats, officerOptions, regFilterSections } from "./options"

export function RegistrationPrepTab() {
  const [regRecords, setRegRecords] = useState(mockRegistrationRecords)
  const [regFilters, setRegFilters] = useState<GenericFilterState>(defaultRegFilters)
  const [regSearchOpen, setRegSearchOpen] = useState(false)
  const [regSearchQuery, setRegSearchQuery] = useState("")
  const regActiveFilterCount = getActiveFilterCount(regFilters)
  const [regPage, setRegPage] = useState(1)
  const [regPageSize, setRegPageSize] = useState(25)
  const [selectedRegIds, setSelectedRegIds] = useState<Set<string>>(new Set())
  const allRegSelected = regRecords.length > 0 && selectedRegIds.size === regRecords.length

  const handleRegStatusChange = (recordId: string, newStatus: RegistrationRecord["status"]) => {
    setRegRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: newStatus } : r))
    )
  }

  const handleOfficerChange = (recordId: string, officer: string) => {
    setRegRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, assignedOfficer: officer } : r))
    )
  }

  const handleDateChange = (recordId: string, date: Date | undefined) => {
    setRegRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, dateAssigned: date ? date.toISOString() : "" } : r))
    )
  }

  const handleToggleSelect = (id: string) => {
    setSelectedRegIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleAll = () => {
    if (allRegSelected) {
      setSelectedRegIds(new Set())
    } else {
      setSelectedRegIds(new Set(regRecords.map((r) => r.id)))
    }
  }

  const registrationColumns = getRegistrationColumns(
    handleRegStatusChange, handleOfficerChange, handleDateChange,
    selectedRegIds, handleToggleSelect, handleToggleAll, allRegSelected
  )

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {getRegistrationStats(regRecords).map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            indicatorColor={stat.indicatorColor}
          />
        ))}
      </div>

      <div className="mt-4 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
          {selectedRegIds.size > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {selectedRegIds.size} selected
              </span>
              <Button
                variant="outline"
                className="h-9 gap-2"
                onClick={() => {
                  setRegRecords((prev) =>
                    prev.map((r) =>
                      selectedRegIds.has(r.id) ? { ...r, status: "Registration In Progress" } : r
                    )
                  )
                  setSelectedRegIds(new Set())
                }}
              >
                <PlayCircle className="h-4 w-4" />
                <span className="text-sm">Start Registration</span>
              </Button>
              <Button
                variant="outline"
                className="h-9 gap-2"
                onClick={() => {
                  setRegRecords((prev) =>
                    prev.map((r) =>
                      selectedRegIds.has(r.id) ? { ...r, status: "Registration Completed" } : r
                    )
                  )
                  setSelectedRegIds(new Set())
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Mark Completed</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <UserRoundPlus className="h-4 w-4" />
                    <span className="text-sm">Assign Officer</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0" align="start">
                  <div className="max-h-48 overflow-y-auto p-1">
                    {officerOptions.map((officer) => (
                      <button
                        key={officer}
                        type="button"
                        className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors text-left"
                        onClick={() => {
                          setRegRecords((prev) =>
                            prev.map((r) =>
                              selectedRegIds.has(r.id) ? { ...r, assignedOfficer: officer } : r
                            )
                          )
                          setSelectedRegIds(new Set())
                        }}
                      >
                        {officer}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">Date Assigned</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        setRegRecords((prev) =>
                          prev.map((r) =>
                            selectedRegIds.has(r.id) ? { ...r, dateAssigned: date.toISOString() } : r
                          )
                        )
                        setSelectedRegIds(new Set())
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm">Filter</span>
                    {regActiveFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                        {regActiveFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <GenericFilterPopover
                    sections={regFilterSections}
                    filters={regFilters}
                    onFiltersChange={setRegFilters}
                  />
                </PopoverContent>
              </Popover>

              <ExpandableSearch
                open={regSearchOpen}
                onOpenChange={setRegSearchOpen}
                value={regSearchQuery}
                onValueChange={setRegSearchQuery}
                placeholder="Search chassis, engine no."
              />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <DataTable columns={registrationColumns} data={regRecords} />
        </div>
      </div>

      <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={regPage}
          totalPages={Math.ceil(regRecords.length / regPageSize)}
          totalItems={regRecords.length}
          pageSize={regPageSize}
          onPageChange={setRegPage}
          onPageSizeChange={setRegPageSize}
          itemLabel="records"
        />
      </div>
    </>
  )
}
