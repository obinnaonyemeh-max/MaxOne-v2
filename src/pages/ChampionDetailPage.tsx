import { useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
} from "@/components/max"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getChampionDetails, type WalletTransaction } from "@/data/mockChampionDetails"
import {
  type TicketRecord,
  statusVariantMap as ticketStatusVariantMap,
  priorityVariantMap,
  slaVariantMap,
} from "@/data/mockTicketRecords"

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

export default function ChampionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const champion = getChampionDetails(id || "1")

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
    { label: "Last Pinged", value: champion.lastPingedOn },
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
              lastPingedOn={champion.lastPingedOn}
              contractStatus={champion.contractStatus}
            />
            <VehicleOverviewCard
              imageUrl={champion.vehicle.imageUrl}
              details={vehicleOverviewDetails}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="biodata" className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
                  <TabsTrigger value="wallet" className={tabTriggerClass}>Wallet</TabsTrigger>
                  <TabsTrigger value="fieldops" className={tabTriggerClass}>FieldOps History</TabsTrigger>
                  <TabsTrigger value="guarantors" className={tabTriggerClass}>Guarantors</TabsTrigger>
                  <TabsTrigger value="tickets" className={tabTriggerClass}>Tickets</TabsTrigger>
                  <TabsTrigger value="welfare" className={tabTriggerClass}>Welfare Notes</TabsTrigger>
                  <TabsTrigger value="hmo" className={tabTriggerClass}>HMO Details</TabsTrigger>
                  <TabsTrigger value="timeoff" className={tabTriggerClass}>Time-Off</TabsTrigger>
                  <TabsTrigger value="communication" className={tabTriggerClass}>Communication</TabsTrigger>
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
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={champion.fieldOps} />
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
                <div className="mt-0 rounded-[14px] border border-table-border overflow-hidden">
                  <div className="px-4 py-3 bg-content-card border-b border-table-border">
                    <h3 className="font-semibold text-sm text-sidebar-item-active">Ticket Records</h3>
                  </div>
                  <DataTable columns={ticketColumns} data={champion.tickets} />
                </div>
              </TabsContent>

              {/* Welfare Notes Tab */}
              <TabsContent value="welfare" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">
                    Welfare notes will be displayed here.
                  </p>
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
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">
                    Time-off records will be displayed here.
                  </p>
                </div>
              </TabsContent>

              {/* Communication Tab */}
              <TabsContent value="communication" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <p className="text-sm text-breadcrumb-root">
                    Communication history will be displayed here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
