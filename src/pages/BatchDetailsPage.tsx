import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Upload, Trash2, SlidersHorizontal, Search, ChevronDown, Calendar as CalendarIcon, PlayCircle, CheckCircle2, UserRoundPlus } from "lucide-react"
import { format } from "date-fns"

import {
  TopBar,
  InfoCard,
  InfoGrid,
  StatusBadge,
  StatusTimeline,
  BackButton,
  DataTable,
  Pagination,
  StatCard,
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type GenericFilterState,
  Modal,
} from "@/components/max"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getBatchDetails } from "@/data/mockBatchDetails"

const stageOrder = [
  "In Production",
  "Identifier Upload",
  "In Transit",
  "At Port",
  "Clearing",
  "Warehouse QA",
  "Ready for Activation",
]

function getNextStage(currentStage: string): string | null {
  const index = stageOrder.indexOf(currentStage)
  if (index === -1 || index === stageOrder.length - 1) return null
  return stageOrder[index + 1]
}

interface VehicleIdentifier {
  id: string
  chassisVin: string
  engineNo: string
  ignitionNo: string
  batterySn: string
  color: string
  receiver: string
}

const mockIdentifiers: VehicleIdentifier[] = [
  { id: "1", chassisVin: "WE3234777TYT", engineNo: "EV387465", ignitionNo: "TH19009", batterySn: "BAT90909", color: "YELLOW", receiver: "FLEETOPS" },
]

interface RegistrationRecord {
  id: string
  chassisNo: string
  engineNo: string
  status: "Not Started" | "Registration In Progress" | "Registration Completed"
  assignedOfficer: string
  dateAssigned: string
}

const mockRegistrationRecords: RegistrationRecord[] = [
  { id: "1", chassisNo: "WE33344YHTUJ33", engineNo: "2657748HG", status: "Registration Completed", assignedOfficer: "Adebayo Ogunlesi", dateAssigned: "2026-03-10" },
  { id: "2", chassisNo: "KL78821MXNR45", engineNo: "EV449821", status: "Registration In Progress", assignedOfficer: "Chioma Nwosu", dateAssigned: "2026-03-15" },
  { id: "3", chassisNo: "TX90112BQWF67", engineNo: "EV552034", status: "Not Started", assignedOfficer: "", dateAssigned: "" },
  { id: "4", chassisNo: "AB44520RTJK89", engineNo: "EV661198", status: "Registration In Progress", assignedOfficer: "Fatima Abdullahi", dateAssigned: "2026-03-18" },
  { id: "5", chassisNo: "NG33019PLMZ12", engineNo: "EV773345", status: "Not Started", assignedOfficer: "", dateAssigned: "" },
]

const registrationStatusVariant: Record<RegistrationRecord["status"], "success" | "info" | "default"> = {
  "Not Started": "default",
  "Registration In Progress": "info",
  "Registration Completed": "success",
}

const officerOptions = [
  "Adebayo Ogunlesi",
  "Chioma Nwosu",
  "Emeka Obiora",
  "Fatima Abdullahi",
  "Ibrahim Musa",
  "Ngozi Okafor",
]

const registrationStatusOptions: RegistrationRecord["status"][] = [
  "Not Started",
  "Registration In Progress",
  "Registration Completed",
]

function getRegistrationColumns(
  onStatusChange: (id: string, status: RegistrationRecord["status"]) => void,
  onOfficerChange: (id: string, officer: string) => void,
  onDateChange: (id: string, date: Date | undefined) => void,
  selectedIds: Set<string>,
  onToggleSelect: (id: string) => void,
  onToggleAll: () => void,
  allSelected: boolean,
): ColumnDef<RegistrationRecord>[] {
  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 rounded border border-gray-200 accent-brand-dark cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.original.id)}
          onChange={() => onToggleSelect(row.original.id)}
          className="h-4 w-4 rounded border border-gray-200 accent-brand-dark cursor-pointer"
        />
      ),
    },
    {
      accessorKey: "chassisNo",
      header: "Chassis No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
          {row.original.chassisNo}
        </span>
      ),
    },
    {
      accessorKey: "engineNo",
      header: "Engine No.",
      cell: ({ row }) => (
        <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
          {row.original.engineNo}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="flex items-center gap-1 cursor-pointer">
              <StatusBadge variant={registrationStatusVariant[row.original.status]} withDot>
                {row.original.status}
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </StatusBadge>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1" align="start">
            <div className="flex flex-col">
              {registrationStatusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                  onClick={() => onStatusChange(row.original.id, option)}
                >
                  <StatusBadge variant={registrationStatusVariant[option]} withDot>
                    {option}
                  </StatusBadge>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      accessorKey: "assignedOfficer",
      header: "Assigned Officer",
      cell: ({ row }) => {
        const [query, setQuery] = useState(row.original.assignedOfficer)
        const filtered = officerOptions.filter((o) =>
          o.toLowerCase().includes(query.toLowerCase())
        )
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-44 justify-start text-left font-normal text-sm"
              >
                {row.original.assignedOfficer || <span className="text-muted-foreground">Officer name</span>}
                <ChevronDown className="ml-auto h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
              <div className="p-2 border-b border-border">
                <Input
                  type="text"
                  placeholder="Search officer..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    onOfficerChange(row.original.id, e.target.value)
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
              </div>
              <div className="max-h-40 overflow-y-auto p-1">
                {filtered.map((officer) => (
                  <button
                    key={officer}
                    type="button"
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors text-left"
                    onClick={() => {
                      setQuery(officer)
                      onOfficerChange(row.original.id, officer)
                    }}
                  >
                    {officer}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No officers found</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      accessorKey: "dateAssigned",
      header: "Date Assigned",
      cell: ({ row }) => {
        const dateValue = row.original.dateAssigned ? new Date(row.original.dateAssigned) : undefined
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-40 justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "dd/MM/yyyy") : <span className="text-muted-foreground">dd/mm/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => onDateChange(row.original.id, date)}
              />
            </PopoverContent>
          </Popover>
        )
      },
    },
  ]
}

function getRegistrationStats(records: RegistrationRecord[]) {
  return [
    { title: "Total Uploaded", value: records.length, indicatorColor: "#F59E0B" },
    { title: "Not Started", value: records.filter((r) => r.status === "Not Started").length, indicatorColor: "#737373" },
    { title: "In Progress", value: records.filter((r) => r.status === "Registration In Progress").length, indicatorColor: "#1855FC" },
    { title: "Completed", value: records.filter((r) => r.status === "Registration Completed").length, indicatorColor: "#16A34A" },
  ]
}

const regFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Registration Status",
    defaultExpanded: true,
    options: [
      { value: "Not Started", label: "Not Started" },
      { value: "Registration In Progress", label: "Registration In Progress" },
      { value: "Registration Completed", label: "Registration Completed" },
    ],
  },
]

const defaultRegFilters: GenericFilterState = {
  status: [],
}

interface BatchDocument {
  id: string
  document: string
  type: string
  uploaded: string
}

const documentTypeOptions = [
  "Supplier Invoice",
  "Bill of Lading",
  "Customs Declaration",
  "Insurance Certificate",
  "Inspection Report",
]

const mockDocuments: BatchDocument[] = [
  { id: "1", document: "INV-2026-0034.pdf", type: "Supplier Invoice", uploaded: "10 Mar 2026" },
  { id: "2", document: "BOL-BATCH003-NG.pdf", type: "Bill of Lading", uploaded: "12 Mar 2026" },
  { id: "3", document: "CUSTOMS-DEC-003.pdf", type: "Customs Declaration", uploaded: "15 Mar 2026" },
  { id: "4", document: "INSURANCE-CERT-003.pdf", type: "Insurance Certificate", uploaded: "16 Mar 2026" },
]

const docFilterSections: FilterSection[] = [
  {
    id: "type",
    title: "Document Type",
    defaultExpanded: true,
    options: documentTypeOptions.map((t) => ({ value: t, label: t })),
  },
]

const defaultDocFilters: GenericFilterState = {
  type: [],
}

const documentColumns: ColumnDef<BatchDocument>[] = [
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => (
      <span className="font-medium text-brand-dark underline decoration-dotted cursor-pointer hover:text-brand-dark/80" style={{ fontSize: "14px" }}>
        {row.original.document}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "uploaded",
    header: "Uploaded",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.uploaded}
      </span>
    ),
  },
]

const identifierColumns: ColumnDef<VehicleIdentifier>[] = [
  {
    accessorKey: "chassisVin",
    header: "Chassis (VIN)",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: "14px" }}>
        {row.original.chassisVin}
      </span>
    ),
  },
  {
    accessorKey: "engineNo",
    header: "Engine No.",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.engineNo}
      </span>
    ),
  },
  {
    accessorKey: "ignitionNo",
    header: "Ignition No.",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.ignitionNo}
      </span>
    ),
  },
  {
    accessorKey: "batterySn",
    header: "Battery S/N",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.batterySn}
      </span>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.color}
      </span>
    ),
  },
  {
    accessorKey: "receiver",
    header: "Receiver",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: "14px" }}>
        {row.original.receiver}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <button
        type="button"
        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    ),
  },
]

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
        <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>{label}</label>
      {children}
    </div>
  )
}

function DocDropZone({
  onFileSelect,
  file,
}: {
  onFileSelect: (file: File) => void
  file: File | null
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      onFileSelect(droppedFile)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors min-h-[200px] ${
        isDragOver
          ? "border-brand-primary bg-brand-primary/5"
          : file
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-gray-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
        onChange={(e) => {
          const selected = e.target.files?.[0]
          if (selected) onFileSelect(selected)
        }}
        className="hidden"
      />

      {file ? (
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-green-500 mb-2" />
          <p className="font-medium text-green-600" style={{ fontSize: '14px' }}>{file.name}</p>
          <p className="mt-1 text-green-500" style={{ fontSize: '12px' }}>File uploaded successfully</p>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="font-medium text-sidebar-item" style={{ fontSize: '14px' }}>
            Drag and drop your document
          </p>
          <p className="mt-1" style={{ fontSize: '14px' }}>
            <span className="text-sidebar-item">or </span>
            <span className="text-status-info underline">click to upload</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const batch = getBatchDetails(id || "1")
  const nextStage = getNextStage(batch.stage)
  const [showAddIdentifier, setShowAddIdentifier] = useState(false)
  const [regRecords, setRegRecords] = useState(mockRegistrationRecords)
  const [regFilters, setRegFilters] = useState<GenericFilterState>(defaultRegFilters)
  const [regSearchOpen, setRegSearchOpen] = useState(false)
  const [regSearchQuery, setRegSearchQuery] = useState("")
  const regActiveFilterCount = getActiveFilterCount(regFilters)
  const [regPage, setRegPage] = useState(1)
  const [regPageSize, setRegPageSize] = useState(25)
  const [docFilters, setDocFilters] = useState<GenericFilterState>(defaultDocFilters)
  const docActiveFilterCount = getActiveFilterCount(docFilters)
  const [showUploadDoc, setShowUploadDoc] = useState(false)
  const [uploadDocType, setUploadDocType] = useState("")
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null)

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

  const [selectedRegIds, setSelectedRegIds] = useState<Set<string>>(new Set())
  const allRegSelected = regRecords.length > 0 && selectedRegIds.size === regRecords.length

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
      <TopBar
        breadcrumbs={[
          { label: "Deployment" },
          { label: "Inbound", href: "/inbound/dashboard" },
          { label: "Batches", href: "/inbound/batches" },
          { label: batch.batchId },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BackButton onClick={() => navigate("/inbound/batches")} />
                <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: '22px' }}>
                  {batch.batchId}
                  <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-breadcrumb-root">
                Showing batch information and stage history
              </p>
            </div>
            {nextStage && (
              <div className="flex items-center gap-3">
                <Button className="h-10 gap-2 bg-sidebar-item-active hover:bg-sidebar-item-active/90">
                  Move to {nextStage}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex-1 min-w-0 self-stretch flex flex-col">
            <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0">
              <TabsList variant="line" className="shrink-0 pb-0 gap-0">
                <TabsTrigger
                  value="overview"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="batch-tracker"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Batch Tracker
                </TabsTrigger>
                <TabsTrigger
                  value="vehicle-ids"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Vehicle IDs
                </TabsTrigger>
                <TabsTrigger
                  value="registration-prep"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Registration Prep
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="px-4 py-3 text-sm font-medium data-[state=active]:text-sidebar-item-active data-[state=inactive]:text-breadcrumb-root"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
                  <InfoCard title="BATCH INFORMATION">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Batch ID", value: batch.batchId },
                        { label: "OEM / Manufacturer", value: batch.batchInfo.oem },
                        { label: "Model", value: batch.batchInfo.model },
                        { label: "Trim", value: batch.batchInfo.trim },
                        { label: "Quantity", value: batch.batchInfo.quantity.toLocaleString() },
                        { label: "Destination Country", value: batch.batchInfo.destinationCountry },
                        { label: "Destination City", value: batch.batchInfo.destinationCity },
                        { label: "Status", value: <StatusBadge variant={batch.stageVariant} withDot>{batch.stage}</StatusBadge> },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="PROGRESS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Identifiers Uploaded", value: "1/400" },
                        { label: "Registration Complete", value: "1/400" },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="SHIPPING DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Container Number", value: batch.shipping.containerNumber },
                        { label: "Shipping Line", value: batch.shipping.shippingLine },
                        { label: "Port of Arrival", value: batch.shipping.portOfArrival },
                        { label: "Expected Delivery Date", value: batch.shipping.expectedDeliveryDate },
                      ]}
                    />
                  </InfoCard>

                  <InfoCard title="FINANCIAL DETAILS">
                    <InfoGrid
                      columns={4}
                      showDividers
                      items={[
                        { label: "Payment Reference", value: batch.financials.paymentReference },
                        { label: "Invoice / PO Reference", value: batch.financials.invoicePoReference },
                      ]}
                    />
                  </InfoCard>

                  {batch.notes && (
                    <InfoCard title="NOTES">
                      <p className="text-sm text-table-text">{batch.notes}</p>
                    </InfoCard>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="batch-tracker" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="bg-content-card p-6 h-fit rounded-lg border border-border">
                  <StatusTimeline entries={batch.stageHistory} />
                </div>
              </TabsContent>

              <TabsContent value="vehicle-ids" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
                    <span className="text-sm font-medium text-muted-foreground">
                      {mockIdentifiers.length} identifier{mockIdentifiers.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="h-9 gap-2">
                        <Upload className="h-4 w-4" />
                        Upload CSV
                      </Button>
                      <Button className="h-9 gap-2" onClick={() => setShowAddIdentifier(true)}>
                        <Plus className="h-4 w-4" />
                        Add Identifier
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <DataTable columns={identifierColumns} data={mockIdentifiers} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="registration-prep" className="mt-0 flex-1 min-h-0 overflow-y-auto">
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

                        {regSearchOpen ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="text"
                              value={regSearchQuery}
                              onChange={(e) => setRegSearchQuery(e.target.value)}
                              placeholder="Search chassis, engine no."
                              className="h-9 w-48"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => {
                                setRegSearchOpen(false)
                                setRegSearchQuery("")
                              }}
                            >
                              <span className="sr-only">Close search</span>
                              ×
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setRegSearchOpen(true)}
                          >
                            <Search className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
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
              </TabsContent>


              <TabsContent value="documents" className="mt-0 flex-1 min-h-0 overflow-y-auto">
                <div className="mt-4 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-9 gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="text-sm">Filter</span>
                            {docActiveFilterCount > 0 && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                                {docActiveFilterCount}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                          <GenericFilterPopover
                            sections={docFilterSections}
                            filters={docFilters}
                            onFiltersChange={setDocFilters}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      className="h-9 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
                      onClick={() => {
                        setUploadDocType("")
                        setUploadDocFile(null)
                        setShowUploadDoc(true)
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <DataTable
                      columns={documentColumns}
                      data={mockDocuments}
                      emptyMessage="No documents yet. Select a type and upload a file."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal
        open={showAddIdentifier}
        onOpenChange={setShowAddIdentifier}
        title="Add Vehicle Identifier"
        subtitle="Enter the vehicle identifier details below."
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Add Identifier",
          onClick: () => {
            setShowAddIdentifier(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowAddIdentifier(false),
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
            <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
              Vehicle Identifiers
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Chassis Number (VIN)</label>
              <Input placeholder="Enter chassis number (VIN)" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Engine Number</label>
              <Input placeholder="Enter engine number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Ignition Number</label>
              <Input placeholder="Enter ignition number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Battery Serial Number</label>
              <Input placeholder="Enter battery serial number" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Color</label>
              <Input placeholder="Enter color" className="h-12 bg-[#F8F8F8]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 font-medium" style={{ fontSize: '13px' }}>Receiver / Destination Unit</label>
              <Input placeholder="Enter receiver / destination unit" className="h-12 bg-[#F8F8F8]" />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={showUploadDoc}
        onOpenChange={setShowUploadDoc}
        title="Upload Document"
        subtitle="Select a document type and upload a file."
        maxHeight="85vh"
        className="max-w-lg"
        primaryAction={{
          label: "Upload",
          onClick: () => {
            setShowUploadDoc(false)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setShowUploadDoc(false),
        }}
      >
        <div className="space-y-6">
          <FormSection title="Upload Document">
            <FormField label="Document Type">
              <Select value={uploadDocType} onValueChange={setUploadDocType}>
                <SelectTrigger className="h-12 w-full bg-gray-50">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="File">
              <DocDropZone
                file={uploadDocFile}
                onFileSelect={setUploadDocFile}
              />
            </FormField>
          </FormSection>
        </div>
      </Modal>
    </>
  )
}
