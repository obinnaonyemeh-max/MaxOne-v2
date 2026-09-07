import { useMemo, useState } from "react"
import { Check, Search } from "lucide-react"

import { Banner } from "./Banner"
import { Modal } from "./Modal"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  getQAStaffForLocation,
  type QAStaff,
} from "@/data/mockQAStaff"

export interface AssignQAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: string
  location: string
  onConfirm: (qaId: string) => void
}

export function AssignQAModal({
  open,
  onOpenChange,
  assetId,
  location,
  onConfirm,
}: AssignQAModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelectedId(null)
      setSearch("")
    }
    onOpenChange(next)
  }

  const available = useMemo(() => getQAStaffForLocation(location), [location])

  const matches = available.filter((qa) => {
    if (!search) return true
    const q = search.toLowerCase()
    return qa.name.toLowerCase().includes(q)
  })

  const hasQAs = available.length > 0

  const toggleQA = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const renderQA = (qa: QAStaff) => {
    const isSelected = selectedId === qa.id
    return (
      <button
        type="button"
        key={qa.id}
        onClick={() => toggleQA(qa.id)}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
          isSelected
            ? "border-brand-dark bg-gray-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-table-text-primary">
          {qa.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-table-text-primary">{qa.name}</p>
          <p className="text-xs text-muted-foreground">{qa.location}</p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            isSelected ? "border-brand-dark bg-brand-dark text-white" : "border-gray-300"
          )}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </span>
      </button>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Assign QA"
      subtitle={`Assign a Quality Assurance officer to ${assetId} in ${location}`}
      className="max-w-lg"
      maxHeight="88vh"
      primaryAction={{
        label: "Assign",
        onClick: () => {
          if (!selectedId) return
          onConfirm(selectedId)
        },
        disabled: !selectedId || !hasQAs,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => handleOpenChange(false),
      }}
    >
      <div className="flex flex-col gap-3">
        {!hasQAs && (
          <Banner
            variant="warning"
            title={`No QA available in ${location}`}
            description="There is no Quality Assurance officer at this location, so this vehicle cannot be assigned. Assignment happens automatically when a QA becomes available."
          />
        )}

        {hasQAs && (
          <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              QA officers in {location}
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search QA officer..."
                className="h-9 pl-9"
              />
            </div>
            {matches.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No QA officers match.
              </p>
            ) : (
              matches.map(renderQA)
            )}
          </div>
        )}

        {hasQAs && (
          <p className="text-xs text-muted-foreground">
            {selectedId ? "1 QA selected" : "Select one QA"}
          </p>
        )}
      </div>
    </Modal>
  )
}
