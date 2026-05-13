import { useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import {
  TopBar,
  VehicleOverviewCard,
  AssignmentHistoryCard,
  BackButton,
  StatusTimeline,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
  mockTransferRecords,
  flagVariantMap,
  isOwnershipTransferred,
  isReturnedForCorrection,
  isYetToCommence,
  type TransferRecord,
} from "@/data/mockTransferRecords"

type OverviewBadgeVariant = "success" | "warning" | "info" | "danger" | "default" | "refurb"

const overviewBadgeVariantMap: Record<TransferRecord["status"], OverviewBadgeVariant> = {
  "Transfer In Progress":       "warning",
  "Transfer — Yet to Commence": "refurb",
  "Ownership Transferred":      "success",
}

import { activityLog, checklistItems } from "./transfer-detail/data"
import { useTransferFlow } from "./transfer-detail/useTransferFlow"
import { TransferBanners } from "./transfer-detail/TransferBanners"
import { TransferChecklist } from "./transfer-detail/TransferChecklist"
import { TransferDocumentSection } from "./transfer-detail/TransferDocumentSection"
import { TransferUploadSection } from "./transfer-detail/TransferUploadSection"
import { TransferEmptyState } from "./transfer-detail/TransferEmptyState"
import { TransferFlowModals } from "./transfer-detail/TransferFlowModals"

const VEHICLE_OVERVIEW_IMAGE = "/images/2wheeler_overview.svg"

export default function TransferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = useMemo(
    () => mockTransferRecords.find((r) => r.id === id) ?? mockTransferRecords[0],
    [id]
  )

  const flow = useTransferFlow()
  const [assignmentIndex, setAssignmentIndex] = useState(0)
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [commenced, setCommenced] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() =>
    record.breached ? new Set([checklistItems[0].id]) : new Set()
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [reuploadMode, setReuploadMode] = useState(false)

  const toggleCheck = (id: string) =>
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const isInProgressMode = commenced || record.breached
  const transferred = isOwnershipTransferred(record)
  const showEmptyState = isYetToCommence(record) && !commenced

  const displayStatus = commenced ? "Transfer In Progress" : record.status
  const displayStatusVariant: OverviewBadgeVariant = commenced ? "warning" : overviewBadgeVariantMap[record.status]

  const overviewDetails = transferred
    ? [
        { label: "Asset type",         value: record.assetType },
        { label: "Manufacturer",       value: "MaxE" },
        { label: "Champion",           value: record.champion },
        { label: "Transfer Completed", value: record.hpCompletedDate },
        { label: "Transfer Status",    value: "Approved", isStatus: true, statusVariant: "success" as const },
      ]
    : [
        { label: "Asset type",           value: record.assetType },
        { label: "Vehicle Manufacturer", value: "MaxE" },
        ...(record.flag
          ? [{
              label: "Flag",
              value: record.flag,
              isStatus: true,
              statusVariant: flagVariantMap[record.flag],
            }]
          : []),
        { label: "HP Completed", value: record.hpCompletedDate },
        { label: "SLA Day",      value: `${record.days} of ${record.sla} days` },
      ]

  const assignmentHistory = [
    {
      id: "1",
      duration: `3 Dec 2023 - ${record.hpCompletedDate}`,
      assigneeName: record.champion,
      status: "HP Complete" as const,
      isCurrent: true,
    },
  ]

  const canSubmit = checkedIds.size >= checklistItems.length && !!uploadedFile

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Transfer" },
          { label: "All Transfer", href: "/transfer/all" },
          { label: record.vehicleId },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/transfer/all")} />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active text-[22px]">
                  {record.vehicleId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing vehicle information and possible champion assignment history
              </p>
            </div>
            <TransferHeaderActions
              record={record}
              isInProgressMode={isInProgressMode}
              transferred={transferred}
              canSubmit={canSubmit}
              uploadedFile={uploadedFile}
              onSubmit={() => flow.start("submit")}
              onApprove={() => setShowApproveConfirm(true)}
              onReject={() => setShowRejectConfirm(true)}
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-6 items-start">
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <VehicleOverviewCard
              status={displayStatus}
              statusVariant={displayStatusVariant}
              imageUrl={VEHICLE_OVERVIEW_IMAGE}
              details={overviewDetails}
            />
            <AssignmentHistoryCard
              assignments={assignmentHistory}
              currentIndex={assignmentIndex}
              onPrevious={() => setAssignmentIndex((p) => Math.max(0, p - 1))}
              onNext={() => setAssignmentIndex((p) => Math.min(assignmentHistory.length - 1, p + 1))}
              title="Assigned To"
              showNavigation={false}
            />
          </div>

          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="transfer-details" className="flex flex-col flex-1 min-h-0">
              <TabsList variant="line" className="shrink-0 pb-0 gap-0">
                <TabsTrigger
                  value="transfer-details"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Transfer Details
                </TabsTrigger>
                <TabsTrigger
                  value="activity-log"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Activity Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transfer-details" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                  {showEmptyState ? (
                    <TransferEmptyState onCommence={() => setCommenced(true)} />
                  ) : (
                    <>
                      <TransferBanners record={record} commenced={commenced} />
                      {!transferred && (
                        <>
                          <TransferChecklist
                            isInProgressMode={isInProgressMode}
                            checkedIds={checkedIds}
                            onToggle={toggleCheck}
                          />
                          {reuploadMode || (isInProgressMode && !isReturnedForCorrection(record)) ? (
                            <TransferUploadSection
                              uploadedFile={uploadedFile}
                              onFileSelect={setUploadedFile}
                            />
                          ) : (
                            <TransferDocumentSection
                              record={record}
                              onReupload={() => setReuploadMode(true)}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="activity-log" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={activityLog} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <TransferFlowModals
        flow={flow}
        onBackToList={() => navigate("/transfer/all")}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        showRejectConfirm={showRejectConfirm}
        setShowRejectConfirm={setShowRejectConfirm}
        showApproveConfirm={showApproveConfirm}
        setShowApproveConfirm={setShowApproveConfirm}
      />
    </>
  )
}

interface HeaderActionsProps {
  record: TransferRecord
  isInProgressMode: boolean
  transferred: boolean
  canSubmit: boolean
  uploadedFile: File | null
  onSubmit: () => void
  onApprove: () => void
  onReject: () => void
}

function TransferHeaderActions({
  record,
  isInProgressMode,
  transferred,
  canSubmit,
  uploadedFile,
  onSubmit,
  onApprove,
  onReject,
}: HeaderActionsProps) {
  if (isInProgressMode) {
    return (
      <Button className="h-10" disabled={!canSubmit} onClick={onSubmit}>
        Submit for Approval
      </Button>
    )
  }

  if (isReturnedForCorrection(record)) {
    return (
      <Button className="h-10" disabled={!uploadedFile} onClick={onSubmit}>
        Resubmit for Approval
      </Button>
    )
  }

  if (transferred || isYetToCommence(record)) return null

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="h-10 gap-2" onClick={onReject}>
        ✗ Reject — Return to Officer
      </Button>
      <Button className="h-10 gap-2" onClick={onApprove}>
        ✓ Approve Transfer
      </Button>
    </div>
  )
}
