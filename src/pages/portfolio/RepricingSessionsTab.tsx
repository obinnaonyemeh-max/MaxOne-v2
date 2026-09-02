import { useMemo, useState } from "react"

import { DataTable, InfoGrid, Modal, Pagination } from "@/components/max"
import { type RepricingSession } from "@/data/mockRepricingEngine"
import { getRepricingSessionsColumns } from "./repricingSessionsTabColumns"

interface RepricingSessionsTabProps {
  sessions: RepricingSession[]
}

export function RepricingSessionsTab({ sessions }: RepricingSessionsTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [viewSession, setViewSession] = useState<RepricingSession | null>(null)

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sessions.slice(start, start + pageSize)
  }, [sessions, currentPage, pageSize])

  const columns = getRepricingSessionsColumns({ onView: setViewSession })

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6">
        <h2 className="font-semibold text-sidebar-item-active" style={{ fontSize: "16px" }}>
          Repricing Sessions
        </h2>
        <p className="mt-0.5 text-xs font-medium text-breadcrumb-root">
          Every automated and manual run of the engine
        </p>
      </div>

      <div className="px-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <DataTable columns={columns} data={paginatedSessions} emptyMessage="No repricing sessions yet." />
        </div>
      </div>

      <div className="px-6">
        <div className="rounded-lg border border-table-border bg-content-card">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(sessions.length / pageSize))}
            totalItems={sessions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            itemLabel="sessions"
          />
        </div>
      </div>

      <Modal
        open={viewSession !== null}
        onOpenChange={(open) => !open && setViewSession(null)}
        title={viewSession?.id}
        subtitle="Repricing session details"
        secondaryAction={{ label: "Close", onClick: () => setViewSession(null) }}
      >
        {viewSession && (
          <InfoGrid
            columns={2}
            items={[
              { label: "Run Time", value: viewSession.startTime },
              { label: "Trigger", value: viewSession.trigger },
              { label: "Duration", value: viewSession.duration },
              { label: "Status", value: viewSession.status },
              { label: "Contracts Found", value: viewSession.found },
              { label: "Successful", value: viewSession.repriced },
              { label: "Failed", value: viewSession.failed },
              { label: "Exceptions", value: viewSession.exceptions },
            ]}
          />
        )}
      </Modal>
    </div>
  )
}
