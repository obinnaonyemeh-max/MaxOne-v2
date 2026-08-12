import { useState, useRef, useCallback } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"

import {
  TopBar,
  InfoCard,
  InfoGrid,
  VehicleOverviewCard,
  ChampionInformation,
  BackButton,
  ContractInformation,
  WalletInformation,
  DataTable,
  StatusBadge,
  StatusTimeline,
  MaxIDCard,
  AssignmentHistoryCard,
} from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Phone, MessageSquare, MessageCircle, User, Plus, History, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getChampionDetails, type WalletTransaction, type WelfareNote, type ChampionDetails } from "@/data/mockChampionDetails"
import {
  type TicketRecord,
  statusVariantMap as ticketStatusVariantMap,
  priorityVariantMap,
  slaVariantMap,
} from "@/data/mockTicketRecords"
import { movementLogColumns } from "@/pages/asset-movement/columns"

const tabTriggerClass =
  "px-3 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"

const statusVariantMap: Record<WalletTransaction["status"], "success" | "warning" | "danger"> = {
  Successful: "success",
  Pending: "warning",
  Failed: "danger",
}

const walletTransactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text text-sm">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "referenceId",
    header: "Reference ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.referenceId}</span>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => (
      <span
        className={`font-medium text-sm ${row.original.transactionType === "Credit" ? "text-status-success" : "text-status-warning"}`}
      >
        {row.original.transactionType}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary text-sm">{row.original.amount}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={statusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
]

const ticketColumns: ColumnDef<TicketRecord>[] = [
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.ticketId}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "assignedAgent",
    header: "Assigned Agent",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.assignedAgent}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <StatusBadge variant={priorityVariantMap[row.original.priority]} withDot>
        {row.original.priority}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={ticketStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <StatusBadge variant={slaVariantMap[row.original.sla]} withDot>
        {row.original.sla}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.dateCreated}
      </span>
    ),
  },
]

type LeaveRecord = ChampionDetails["timeOff"]["history"][number]

const leaveStatusVariantMap: Record<LeaveRecord["status"], "success" | "warning" | "danger"> = {
  Approved: "success",
  Pending: "warning",
  Declined: "danger",
}

const leaveTypeVariantMap: Record<LeaveRecord["type"], "info" | "danger" | "warning"> = {
  Annual: "info",
  Emergency: "danger",
  Sick: "warning",
}

const leaveHistoryColumns: ColumnDef<LeaveRecord>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge variant={leaveTypeVariantMap[row.original.type]} withDot={false} size="sm">
        {row.original.type}
      </StatusBadge>
    ),
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.startDate} – {row.original.endDate}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant={leaveStatusVariantMap[row.original.status]} withDot>
        {row.original.status}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.approvedBy}
      </span>
    ),
  },
]

const channelIcons: Record<WelfareNote["channel"], React.ReactNode> = {
  "Phone Call": <Phone className="h-3.5 w-3.5" />,
  SMS: <MessageSquare className="h-3.5 w-3.5" />,
  WhatsApp: <MessageCircle className="h-3.5 w-3.5" />,
  "In-Person": <User className="h-3.5 w-3.5" />,
}

const incidentStatusVariantMap: Record<WelfareNote["incidentStatus"], "success" | "warning" | "info"> = {
  Resolved: "success",
  "In-Progress": "warning",
  Open: "info",
}

const interactionTypeVariantMap: Record<WelfareNote["interactionType"], "default" | "info" | "danger"> = {
  "Routine Check-In": "default",
  "Incident Follow-up": "info",
  "Welfare Complaint": "danger",
}

export default function ChampionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const champion = getChampionDetails(id || "1")

  const activeTab = searchParams.get("tab") || "biodata"
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

  const [showCreateTimeOff, setShowCreateTimeOff] = useState(false)
  const [showLeaveHistory, setShowLeaveHistory] = useState(false)
  const [timeOffForm, setTimeOffForm] = useState({ type: "", startDate: "", endDate: "", reason: "" })
  const [assignmentIndex, setAssignmentIndex] = useState(0)
  const [showAssignmentHistory, setShowAssignmentHistory] = useState(false)
  const [showMovementLog, setShowMovementLog] = useState(false)

  const tabsScrollRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = tabsScrollRef.current
    if (!el) return
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = "grabbing"
  }, [])

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false
    if (tabsScrollRef.current) tabsScrollRef.current.style.cursor = "grab"
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDown) return
    e.preventDefault()
    const el = tabsScrollRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX)
  }, [])

  const vehicleOverviewDetails = [
    { label: "Asset type", value: champion.vehicle.assetType },
    { label: "Vehicle Manufacturer", value: champion.vehicle.manufacturer },
    {
      label: "Contract status",
      value: champion.vehicle.contractStatus,
      isStatus: true,
      statusVariant: champion.vehicle.contractStatus === "Active" ? "success" as const : "warning" as const,
    },
    { label: "Last Vehicle Activity", value: champion.vehicle.lastPingedOn },
  ]

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Champion 360", href: "/champion-360" },
          { label: champion.name },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/champion-360")} />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
                  {champion.name}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 ml-10 text-sm font-medium text-breadcrumb-root">
                {champion.championId} &middot; Showing champion profile and activity details
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-6 items-start">
          {/* Left Column */}
          <div className="w-[340px] shrink-0 flex flex-col gap-4">
            <ChampionInformation
              name={champion.name}
              riskLevel={champion.riskLevel}
              phoneNumber={champion.phoneNumber}
              location={champion.location}
              onboardedDate={champion.onboardedDate}
              contractStatus={champion.contractStatus}
            />
            <VehicleOverviewCard
              imageUrl={champion.vehicle.imageUrl}
              details={vehicleOverviewDetails}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div
                ref={tabsScrollRef}
                className="shrink-0 overflow-x-auto scrollbar-hide pb-1.5 cursor-grab select-none"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
              >
                <TabsList variant="line" className="pb-0 gap-0 w-max">
                  <TabsTrigger value="biodata" className={tabTriggerClass}>Biodata</TabsTrigger>
                  <TabsTrigger value="contracts" className={tabTriggerClass}>Contracts</TabsTrigger>
                  <TabsTrigger value="asset" className={tabTriggerClass}>Asset</TabsTrigger>
                  <TabsTrigger value="wallet" className={tabTriggerClass}>Wallet</TabsTrigger>
                  <TabsTrigger value="fieldops" className={tabTriggerClass}>FieldOps History</TabsTrigger>
                  <TabsTrigger value="guarantors" className={tabTriggerClass}>Guarantors</TabsTrigger>
                  <TabsTrigger value="tickets" className={tabTriggerClass}>Tickets</TabsTrigger>
                  <TabsTrigger value="welfare" className={tabTriggerClass}>Welfare Notes</TabsTrigger>
                  <TabsTrigger value="hmo" className={tabTriggerClass}>HMO Details</TabsTrigger>
                  <TabsTrigger value="timeoff" className={tabTriggerClass}>Time-Off</TabsTrigger>

                </TabsList>
              </div>

              {/* Biodata Tab */}
              <TabsContent value="biodata" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  <MaxIDCard
                    variant={champion.maxIdCard.variant}
                    dateGenerated={champion.maxIdCard.dateGenerated}
                    generatedBy={champion.maxIdCard.generatedBy}
                  />
                  <InfoCard title="PERSONAL INFORMATION">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Full Name", value: champion.biodata.fullName },
                        { label: "Date of Birth", value: champion.biodata.dateOfBirth },
                        { label: "Gender", value: champion.biodata.gender },
                        { label: "Marital Status", value: champion.biodata.maritalStatus },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="ORIGIN & ADDRESS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "State of Origin", value: champion.biodata.stateOfOrigin },
                        { label: "LGA", value: champion.biodata.lga },
                        { label: "Address", value: champion.biodata.address },
                        { label: "Email", value: champion.biodata.email },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="NEXT OF KIN & MEDICAL">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Next of Kin", value: champion.biodata.nextOfKin },
                        { label: "Next of Kin Phone", value: champion.biodata.nextOfKinPhone },
                        { label: "Blood Group", value: champion.biodata.bloodGroup },
                        { label: "Genotype", value: champion.biodata.genotype },
                      ]}
                    />
                  </InfoCard>
                </div>
              </TabsContent>

              {/* Contracts Tab */}
              <TabsContent value="contracts" forceMount className="mt-0 flex-1 min-h-0 overflow-y-auto data-[state=inactive]:hidden">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  <ContractInformation
                    percentage={champion.contracts.percentageElapsed}
                    totalDays={champion.contracts.totalDays}
                    daysElapsed={champion.contracts.daysElapsed}
                    startDate={champion.contracts.startDate}
                    endDate={champion.contracts.endDate}
                  />
                  <InfoCard title="CONTRACT DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Contract ID", value: champion.contracts.contractId },
                        { label: "Start Date", value: champion.contracts.startDate },
                        { label: "End Date", value: champion.contracts.endDate },
                        { label: "Vehicle Assigned", value: champion.contracts.vehicleAssigned },
                        { label: "Daily Remittance", value: champion.contracts.dailyRemittance },
                        { label: "Total Remitted", value: champion.contracts.totalRemitted },
                        { label: "Outstanding Balance", value: champion.contracts.outstandingBalance },
                        { label: "Status", value: champion.contracts.status },
                      ]}
                    />
                  </InfoCard>
                </div>
              </TabsContent>

              {/* Asset Tab */}
              <TabsContent value="asset" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  <InfoCard title="BASIC VEHICLE INFORMATION">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Vehicle type", value: champion.vehicleDetails.basicInfo.vehicleType },
                        { label: "Model", value: champion.vehicleDetails.basicInfo.model },
                        { label: "Trim", value: champion.vehicleDetails.basicInfo.trim },
                        { label: "Platform Type", value: champion.vehicleDetails.basicInfo.platformType },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="VEHICLE IDENTIFICATION">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Chassis Number (VIN)", value: champion.vehicleDetails.identification.chassisNumber },
                        { label: "Engine Number", value: champion.vehicleDetails.identification.engineNumber },
                        { label: "Ignition Number", value: champion.vehicleDetails.identification.ignitionNumber },
                        { label: "Plate Number", value: champion.vehicleDetails.identification.plateNumber },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="VENDOR & FINANCIAL DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "OEM/Vendor Name", value: champion.vehicleDetails.vendor.oemVendorName },
                        { label: "Financial Partner", value: champion.vehicleDetails.vendor.financialPartner },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="ASSIGNMENT, LOCATION & DATES">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Location", value: champion.vehicleDetails.assignment.location },
                        { label: "Receiver", value: champion.vehicleDetails.assignment.receiver },
                        { label: "Delivery Date", value: champion.vehicleDetails.assignment.deliveryDate },
                        { label: "License Expiration Date", value: champion.vehicleDetails.assignment.licenseExpiration },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="TELEMATICS DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Sim Serial Number", value: champion.vehicleDetails.telematics.simSerialNumber },
                        { label: "Device IMEI", value: champion.vehicleDetails.telematics.deviceImei },
                        { label: "Phone Number", value: champion.vehicleDetails.telematics.phoneNumber },
                        { label: "Helmet Number", value: champion.vehicleDetails.telematics.helmetNumber },
                      ]}
                    />
                  </InfoCard>
                </div>

                <div className="mt-3 rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 bg-content-card hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setShowAssignmentHistory((prev) => !prev)}
                  >
                    <h3 className="font-semibold text-sm text-sidebar-item-active">Assignment History & Status</h3>
                    <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform ${showAssignmentHistory ? "rotate-180" : ""}`} />
                  </button>
                  {showAssignmentHistory && (
                    <div className="border-t border-border p-3 flex flex-col gap-3">
                      <AssignmentHistoryCard
                        assignments={champion.vehicleDetails.assignmentHistory}
                        currentIndex={assignmentIndex}
                        onPrevious={() => setAssignmentIndex((prev) => Math.max(0, prev - 1))}
                        onNext={() =>
                          setAssignmentIndex((prev) =>
                            Math.min(champion.vehicleDetails.assignmentHistory.length - 1, prev + 1)
                          )
                        }
                      />
                      <div className="bg-content-card p-6 rounded-lg border border-border">
                        <StatusTimeline entries={champion.vehicleDetails.statusHistory} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 rounded-[14px] border border-table-border overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 bg-content-card hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setShowMovementLog((prev) => !prev)}
                  >
                    <h3 className="font-semibold text-sm text-sidebar-item-active">Movement Log</h3>
                    <ChevronDown className={`h-4 w-4 text-breadcrumb-root transition-transform ${showMovementLog ? "rotate-180" : ""}`} />
                  </button>
                  {showMovementLog && (
                    <div className="border-t border-table-border">
                      <DataTable
                        columns={movementLogColumns}
                        data={champion.assetMovement.movementLog}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet" forceMount className="mt-0 flex-1 min-h-0 overflow-y-auto data-[state=inactive]:hidden">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  <WalletInformation
                    balance={champion.wallet.balance.replace("₦", "")}
                    bvn={champion.wallet.bvn}
                    bankAccounts={champion.wallet.bankAccounts}
                  />
                  <InfoCard title="WALLET DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Wallet ID", value: champion.wallet.walletId },
                        { label: "Balance", value: champion.wallet.balance },
                        { label: "Last Transaction", value: champion.wallet.lastTransaction },
                        { label: "Last Transaction Date", value: champion.wallet.lastTransactionDate },
                        { label: "Total Credits", value: champion.wallet.totalCredits },
                        { label: "Total Debits", value: champion.wallet.totalDebits },
                      ]}
                    />
                  </InfoCard>
                </div>
                <div className="mt-3 rounded-[14px] border border-table-border overflow-hidden">
                  <div className="px-4 py-3 bg-content-card border-b border-table-border">
                    <h3 className="font-semibold text-sm text-sidebar-item-active">Wallet Transactions</h3>
                  </div>
                  <DataTable
                    columns={walletTransactionColumns}
                    data={champion.wallet.transactions}
                  />
                </div>
              </TabsContent>

              {/* FieldOps History Tab */}
              <TabsContent value="fieldops" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <div className="bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg p-4 flex items-center gap-2">
                    <span className="text-2xl font-semibold text-sidebar-item-active">{champion.fieldOps.length}</span>
                    <span className="text-sm text-breadcrumb-root">Total Field Operations</span>
                  </div>
                  <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                    <StatusTimeline entries={champion.fieldOps} />
                  </div>
                </div>
              </TabsContent>

              {/* Guarantors Tab */}
              <TabsContent value="guarantors" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  {champion.guarantors.map((guarantor, index) => (
                    <InfoCard key={index} title={`GUARANTOR ${index + 1}`}>
                      <InfoGrid
                        columns={4}
                        showDividers
                        items={[
                          { label: "Name", value: guarantor.name },
                          { label: "Relationship", value: guarantor.relationship },
                          { label: "Phone", value: guarantor.phone },
                          { label: "Address", value: guarantor.address },
                        ]}
                      />
                    </InfoCard>
                  ))}
                </div>
              </TabsContent>

              {/* Tickets Tab */}
              <TabsContent value="tickets" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <div className="bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg p-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-sidebar-item-active">{champion.tickets.length}</span>
                      <span className="text-sm text-breadcrumb-root">Total Tickets</span>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-status-warning">{champion.tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}</span>
                      <span className="text-sm text-breadcrumb-root">Open</span>
                    </div>
                  </div>
                  <div className="rounded-[14px] border border-table-border overflow-hidden">
                    <div className="px-4 py-3 bg-content-card border-b border-table-border">
                      <h3 className="font-semibold text-sm text-sidebar-item-active">Ticket Records</h3>
                    </div>
                    <DataTable columns={ticketColumns} data={champion.tickets} />
                  </div>
                </div>
              </TabsContent>

              {/* Welfare Notes Tab */}
              <TabsContent value="welfare" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-5">
                  {/* Summary widget */}
                  <div className="bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg p-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-sidebar-item-active">{champion.welfareNotes.length}</span>
                      <span className="text-sm text-breadcrumb-root">Total Notes</span>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-status-warning">{champion.welfareNotes.filter((n) => n.followUpRequired).length}</span>
                      <span className="text-sm text-breadcrumb-root">Needs Follow-up</span>
                    </div>
                  </div>

                  {champion.welfareNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-content-card rounded-lg border border-border p-4 transition-colors hover:border-gray-950"
                    >
                      {/* Header: date, logged by, badges */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-sidebar-item-active">{note.date}</span>
                          <span className="text-xs text-breadcrumb-root">by {note.loggedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge variant={interactionTypeVariantMap[note.interactionType]} withDot={false} size="sm">
                            {note.interactionType}
                          </StatusBadge>
                          <StatusBadge variant={incidentStatusVariantMap[note.incidentStatus]} withDot size="sm">
                            {note.incidentStatus}
                          </StatusBadge>
                        </div>
                      </div>

                      {/* Channel pill */}
                      <div className="flex items-center gap-1.5 text-xs text-breadcrumb-root mb-2">
                        {channelIcons[note.channel]}
                        <span>{note.channel}</span>
                        {note.followUpRequired && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-status-warning/10 px-2 py-0.5 text-[11px] font-medium text-status-warning">
                            Follow-up Required
                          </span>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-table-text leading-relaxed">{note.summary}</p>

                      {/* Issues & Action */}
                      {(note.issuesRaised || note.actionTaken) && (
                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-4">
                          {note.issuesRaised && (
                            <div>
                              <span className="text-[11px] font-medium text-breadcrumb-root uppercase tracking-wide">Issues Raised</span>
                              <p className="text-sm text-table-text mt-0.5">{note.issuesRaised}</p>
                            </div>
                          )}
                          {note.actionTaken && (
                            <div>
                              <span className="text-[11px] font-medium text-breadcrumb-root uppercase tracking-wide">Action Taken</span>
                              <p className="text-sm text-table-text mt-0.5">{note.actionTaken}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* HMO Details Tab */}
              <TabsContent value="hmo" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3 overflow-hidden">
                  <InfoCard title="HMO DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Provider", value: champion.hmo.provider },
                        { label: "Plan Type", value: champion.hmo.planType },
                        { label: "Enrollment Date", value: champion.hmo.enrollmentDate },
                        { label: "Expiry Date", value: champion.hmo.expiryDate },
                        { label: "HMO ID", value: champion.hmo.hmoId },
                        { label: "Status", value: champion.hmo.status },
                      ]}
                    />
                  </InfoCard>
                </div>
              </TabsContent>

              {/* Time-Off Tab */}
              <TabsContent value="timeoff" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {/* Header bar */}
                  <div className="bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg px-5 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-sidebar-item-active">
                      Time Off Schedule
                    </h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLeaveHistory(true)}
                      >
                        <History className="h-3.5 w-3.5" />
                        See Leave History
                      </Button>
                      <Button
                        size="sm"
                        disabled={champion.timeOff.currentStatus === "on-leave"}
                        onClick={() => {
                          const emergencyOnly = champion.timeOff.leavesAvailable === 0
                          setTimeOffForm({ type: emergencyOnly ? "Emergency" : "", startDate: "", endDate: "", reason: "" })
                          setShowCreateTimeOff(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create Time Off
                      </Button>
                    </div>
                  </div>

                  {/* Status + Metrics card */}
                  <div className="bg-content-card rounded-lg border border-border overflow-hidden">
                    {/* Status row */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                      <span className="text-sm font-medium text-sidebar-item-active">Time-off Status</span>
                      {champion.timeOff.currentStatus === "none" && (
                        <span className="inline-flex items-center rounded-md border border-border bg-gray-50 px-3 py-1.5 text-xs font-semibold text-table-text uppercase tracking-wide">
                          No Open Time-Off Request Exists
                        </span>
                      )}
                      {champion.timeOff.currentStatus === "on-leave" && champion.timeOff.currentLeave && (
                        <StatusBadge variant="success" withDot size="sm">
                          Currently on Leave &middot; {champion.timeOff.currentLeave.startDate} – {champion.timeOff.currentLeave.endDate}
                        </StatusBadge>
                      )}
                      {champion.timeOff.currentStatus === "no-available" && (
                        <StatusBadge variant="warning" withDot size="sm">
                          No Available Time-Offs to Give
                        </StatusBadge>
                      )}
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3">
                      {/* Row 1 */}
                      <div className="flex items-center justify-between px-5 py-7 border-b border-r border-border">
                        <span className="text-sm font-medium text-table-text leading-tight">Number of Eligible<br />leaves available</span>
                        <span className="text-3xl font-bold text-sidebar-item-active tabular-nums">
                          {String(champion.timeOff.leavesAvailable).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-7 border-b border-r border-border">
                        <span className="text-sm font-medium text-table-text leading-tight">Number of Eligible<br />Leaves earned</span>
                        <span className="text-3xl font-bold text-sidebar-item-active tabular-nums">
                          {String(champion.timeOff.leavesEarned).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-7 border-b border-border">
                        <span className="text-sm font-medium text-table-text leading-tight">Number of Eligible<br />leaves taken</span>
                        <span className="text-3xl font-bold text-sidebar-item-active tabular-nums">
                          {String(champion.timeOff.eligibleLeavesTaken).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Row 2 */}
                      <div className="flex items-center justify-between px-5 py-7">
                        <span className="text-sm font-medium text-table-text leading-tight">Number of Emergency<br />leaves taken</span>
                        <span className="text-3xl font-bold text-sidebar-item-active tabular-nums">
                          {String(champion.timeOff.emergencyLeavesTaken).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Create Time Off Modal */}
      <Dialog open={showCreateTimeOff} onOpenChange={setShowCreateTimeOff}>
        <DialogContent className="max-w-sm p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Create Time Off</DialogTitle>
            <DialogDescription>
              {champion.name} &middot; {champion.championId}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">Leave Type</label>
              <Select
                value={timeOffForm.type}
                onValueChange={(v) => setTimeOffForm((f) => ({ ...f, type: v }))}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {champion.timeOff.leavesAvailable > 0 && (
                    <>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="Sick">Sick</SelectItem>
                    </>
                  )}
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">Start Date</label>
                <Input
                  type="date"
                  className="h-9 text-sm"
                  value={timeOffForm.startDate}
                  onChange={(e) => setTimeOffForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-breadcrumb-root">End Date</label>
                <Input
                  type="date"
                  className="h-9 text-sm"
                  value={timeOffForm.endDate}
                  onChange={(e) => setTimeOffForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-breadcrumb-root">Reason</label>
              <Textarea
                value={timeOffForm.reason}
                onChange={(e) => setTimeOffForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Provide a reason for the time off..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100">
            <Button variant="outline" className="h-9" onClick={() => setShowCreateTimeOff(false)}>
              Cancel
            </Button>
            <Button
              className="h-9 bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!timeOffForm.type || !timeOffForm.startDate || !timeOffForm.endDate}
              onClick={() => setShowCreateTimeOff(false)}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave History Modal */}
      <Dialog open={showLeaveHistory} onOpenChange={setShowLeaveHistory}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle>Leave History</DialogTitle>
            <DialogDescription>
              {champion.name} &middot; {champion.championId}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <DataTable columns={leaveHistoryColumns} data={champion.timeOff.history} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
