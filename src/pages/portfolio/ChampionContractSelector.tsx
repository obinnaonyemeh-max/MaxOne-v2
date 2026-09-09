import { useMemo, useRef, useState, useEffect } from "react"
import { Search, User } from "lucide-react"

import { StatusBadge, DatePickerField } from "@/components/max"
import { FormField } from "@/pages/vehicles/FormControls"
import { Input } from "@/components/ui/input"
import { mockCountries } from "@/data/mockCountries"
import {
  type EarlyTerminationContract,
  earlyTerminationStatusVariantMap,
} from "@/data/mockEarlyTermination"

interface ChampionOption {
  championId: string
  customerName: string
  countryId: string
  countryName: string
  contract: EarlyTerminationContract
}

interface ChampionContractSelectorProps {
  contracts: EarlyTerminationContract[]
  championId: string
  onChampionChange: (championId: string) => void
  contract: EarlyTerminationContract | null
  settlementDate: Date | undefined
  onSettlementDateChange: (date: Date | undefined) => void
}

function countryFlag(countryId: string): string {
  return mockCountries.find((c) => c.id === countryId)?.flag ?? ""
}

export function ChampionContractSelector({
  contracts,
  championId,
  onChampionChange,
  contract,
  settlementDate,
  onSettlementDateChange,
}: ChampionContractSelectorProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // A champion holds exactly one contract at a time, so selecting a champion resolves
  // their contract directly — no separate contract-selection step is needed.
  const champions = useMemo<ChampionOption[]>(
    () =>
      contracts.map((c) => ({
        championId: c.championId,
        customerName: c.customerName,
        countryId: c.countryId,
        countryName: c.countryName,
        contract: c,
      })),
    [contracts]
  )

  const filteredChampions = query.trim()
    ? champions.filter(
        (c) =>
          c.customerName.toLowerCase().includes(query.toLowerCase()) ||
          c.championId.toLowerCase().includes(query.toLowerCase())
      )
    : champions

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectChampion = (option: ChampionOption) => {
    onChampionChange(option.championId)
    setQuery(`${option.customerName} · ${option.championId}`)
    setIsOpen(false)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setIsOpen(true)
    if (championId) {
      onChampionChange("")
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
      <FormField label="Search Champion">
        <div ref={containerRef} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Champion Name or ID..."
            className="pl-9 h-9 bg-input-soft"
          />
          {isOpen && filteredChampions.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md">
              {filteredChampions.map((option) => (
                <button
                  key={option.championId}
                  type="button"
                  onClick={() => handleSelectChampion(option)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sidebar-item-active">{option.customerName}</span>
                  <span className="text-xs text-breadcrumb-root">{option.championId}</span>
                  <span className="ml-auto text-xs">{countryFlag(option.countryId)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </FormField>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-gray-600">Contract</span>
        <span className="text-sm font-medium text-table-text-primary">{contract ? contract.contractNumber : "—"}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Country</span>
          {contract ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-table-text-primary">
              <span>{countryFlag(contract.countryId)}</span>
              {contract.countryName}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
        {contract ? (
          <StatusBadge variant={earlyTerminationStatusVariantMap[contract.status]}>{contract.status}</StatusBadge>
        ) : null}
      </div>

      <FormField label="Settlement Date">
        <DatePickerField
          value={settlementDate}
          onChange={onSettlementDateChange}
          placeholder="DD/MM/YYYY"
          dateFormat="dd/MM/yyyy"
          triggerClassName="bg-input-soft"
        />
      </FormField>
    </div>
  )
}
