import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { mockKitClients } from "@/data/mockKitAssignment"

export interface NewAssignmentDetails {
  newPlateNumber: string
  newChassisId: string
  newClientId: string
}

interface StepNewAssignmentProps {
  details: NewAssignmentDetails
  onUpdateField: (field: keyof NewAssignmentDetails, value: string) => void
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function StepNewAssignment({ details, onUpdateField }: StepNewAssignmentProps) {
  const [clientQuery, setClientQuery] = useState("")

  const selectedClient = mockKitClients.find((c) => c.id === details.newClientId)

  const filteredClients = clientQuery.trim()
    ? mockKitClients.filter((c) => {
        const q = clientQuery.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.clientId.toLowerCase().includes(q)
      })
    : []

  return (
    <div className="space-y-5">
      <h3
        className="font-semibold uppercase text-sidebar-item-active"
        style={{ fontSize: "11px", letterSpacing: "0.4px" }}
      >
        New Assignment Details
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New plate number</label>
        <Input
          value={details.newPlateNumber}
          onChange={(e) => onUpdateField("newPlateNumber", e.target.value)}
          placeholder="Enter new plate number"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New chassis/kit ID</label>
        <Input
          value={details.newChassisId}
          onChange={(e) => onUpdateField("newChassisId", e.target.value)}
          placeholder="Enter new chassis/kit ID"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sidebar-item-active">New client</label>

        {selectedClient ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-content-card px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-sidebar-item">
                {initials(selectedClient.name)}
              </div>
              <span className="text-sm font-medium text-sidebar-item-active">
                {selectedClient.name} ({selectedClient.clientId})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onUpdateField("newClientId", "")
                setClientQuery("")
              }}
            >
              Change
            </Button>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                placeholder="Search client by name or ID..."
                className="h-10 pl-9"
              />
              {clientQuery.trim() && filteredClients.length > 0 && (
                <div className="absolute z-20 mt-1 w-full divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200 bg-content-card shadow-md max-h-72">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        onUpdateField("newClientId", client.id)
                        setClientQuery("")
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-sidebar-item">
                        {initials(client.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-sidebar-item-active">{client.name}</p>
                        <p className="truncate text-xs text-breadcrumb-root">
                          {client.clientId} &middot; {client.phoneNumber} &middot; {client.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {clientQuery.trim() && filteredClients.length === 0 && (
              <p className="mt-2 text-sm text-breadcrumb-root">
                No clients found matching "{clientQuery}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
