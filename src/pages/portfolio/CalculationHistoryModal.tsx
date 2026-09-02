import { format } from "date-fns"

import { InfoGrid, Modal } from "@/components/max"
import { type AuditTrailEntry } from "@/data/mockRepricingAuditTrail"

interface CalculationHistoryModalProps {
  entry: AuditTrailEntry | null
  onClose: () => void
}

export function CalculationHistoryModal({ entry, onClose }: CalculationHistoryModalProps) {
  return (
    <Modal
      open={entry !== null}
      onOpenChange={(open) => !open && onClose()}
      title={entry ? `Calculation History — ${entry.contractId ?? entry.id}` : undefined}
      subtitle="Raw calculation snapshot and delta log for this event"
      className="max-w-2xl"
      secondaryAction={{ label: "Close", onClick: onClose }}
    >
      {entry && (
        <div className="flex flex-col gap-5">
          <InfoGrid
            columns={2}
            items={[
              { label: "Date", value: format(new Date(entry.timestamp), "dd MMM yyyy, HH:mm") },
              { label: "User", value: entry.user },
              { label: "Session", value: entry.sessionId ?? "—" },
              {
                label: "Rule Version",
                value: entry.ruleCode ? `${entry.ruleCode} · ${entry.ruleVersion}` : "—",
              },
            ]}
          />

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-breadcrumb-root">
              Delta Log
            </h4>
            {entry.deltas.length > 0 ? (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
                  <span>Field</span>
                  <span>Before</span>
                  <span>After</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {entry.deltas.map((delta, index) => (
                    <div key={index} className="grid grid-cols-3 px-3 py-2 text-sm">
                      <span className="font-medium text-table-text-primary">{delta.field}</span>
                      <span className="text-muted-foreground">{delta.before}</span>
                      <span className="font-medium text-sidebar-item-active">{delta.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No calculation deltas recorded for this event.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
