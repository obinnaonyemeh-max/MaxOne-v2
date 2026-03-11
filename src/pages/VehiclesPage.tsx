import React, { useState, useRef, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import type { DateRange } from "react-day-picker"

import {
  TopBar,
  PageHeader,
  StatusTabs,
  FilterBar,
  DataTable,
  StatusBadge,
  Pagination,
  Modal,
  type StatusTab,
  type FilterState,
} from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export interface Vehicle {
  id: string
  assetType: string
  assetId: string
  plateNumber: string | null
  batchNumber: string
  location: string
  championStatus: "Active" | "Inactive" | null
  contractStatus: "Active" | "Inactive" | null
  lifecycleState: "Active" | "Portfolio - Inactive" | "Inactive" | "Refurb" | "Inbound"
  driverSafetyScore: number | null
  contractRisk: "Low" | "Medium" | "High" | null
  collectionPercent: number | null
  daysInState: number
  dateCreated: string
}

const baseMockVehicles: Vehicle[] = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-234-XY",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    lifecycleState: "Active",
    driverSafetyScore: 92,
    contractRisk: "Low",
    collectionPercent: 98,
    daysInState: 45,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "2",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-203",
    plateNumber: "ABJ-891-KL",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "Active",
    driverSafetyScore: 78,
    contractRisk: "Low",
    collectionPercent: 85,
    daysInState: 120,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "KAN-456-MN",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Inactive",
    lifecycleState: "Portfolio - Inactive",
    driverSafetyScore: 55,
    contractRisk: "Medium",
    collectionPercent: 72,
    daysInState: 8,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "OYO-123-AB",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "Inactive",
    driverSafetyScore: 88,
    contractRisk: "Low",
    collectionPercent: 100,
    daysInState: 30,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: null,
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: null,
    contractStatus: null,
    lifecycleState: "Inbound",
    driverSafetyScore: null,
    contractRisk: null,
    collectionPercent: null,
    daysInState: 3,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "EKI-789-CD",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "Refurb",
    driverSafetyScore: 35,
    contractRisk: "High",
    collectionPercent: 45,
    daysInState: 200,
    dateCreated: "3 Dec 2023",
  },
  {
    id: "7",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    plateNumber: "LAG-567-EF",
    batchNumber: "MAX-3774B55",
    location: "Ikeja",
    championStatus: "Active",
    contractStatus: "Active",
    lifecycleState: "Active",
    driverSafetyScore: 65,
    contractRisk: "Medium",
    collectionPercent: 60,
    daysInState: 15,
    dateCreated: "3 Dec 2023",
  },
]

export const mockVehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => ({
  ...baseMockVehicles[i % baseMockVehicles.length],
  id: String(i + 1),
}))


const lifecycleStateToTabId: Record<string, string> = {
  "Active": "active",
  "Portfolio - Inactive": "portfolio-inactive",
  "Inactive": "inactive",
  "Refurb": "refurbished",
  "Inbound": "inbound",
}

const getStatusTabs = (vehicles: Vehicle[]): StatusTab[] => {
  const counts = vehicles.reduce((acc, vehicle) => {
    const tabId = lifecycleStateToTabId[vehicle.lifecycleState] || "other"
    acc[tabId] = (acc[tabId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return [
    { id: "all", label: "All", count: vehicles.length },
    { id: "active", label: "Active", count: counts["active"] || 0 },
    { id: "portfolio-inactive", label: "Portfolio-Inactive", count: counts["portfolio-inactive"] || 0 },
    { id: "inactive", label: "Inactive", count: counts["inactive"] || 0 },
    { id: "refurbished", label: "Refurbished", count: counts["refurbished"] || 0 },
    { id: "inbound", label: "Inbound", count: counts["inbound"] || 0 },
  ]
}

function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

function VehicleIcon({ assetType }: { assetType: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
      <img src={getVehicleIcon(assetType)} alt={assetType} className="h-5 w-5" />
    </div>
  )
}

function getSafetyScoreColor(score: number): string {
  if (score >= 70) return "#16B04F"
  if (score >= 50) return "#E88E15"
  return "#DC2626"
}

function SafetyScoreRing({ score }: { score: number }) {
  const color = getSafetyScoreColor(score)
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="font-medium text-table-text" style={{ fontSize: '12px' }}>{score}</span>
    </div>
  )
}

function CollectionBar({ percent }: { percent: number }) {
  const color = percent >= 70 ? "#16B04F" : percent >= 50 ? "#E88E15" : "#DC2626"

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-medium text-table-text" style={{ fontSize: '12px' }}>{percent}%</span>
    </div>
  )
}

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <VehicleIcon assetType={row.original.assetType} />
        <div>
          <p className="font-medium text-table-text-primary" style={{ fontSize: '14px' }}>{row.original.assetType}</p>
          <p className="font-medium text-table-text-warning" style={{ fontSize: '11px' }}>{row.original.assetId}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => {
      const plateNumber = row.original.plateNumber
      if (!plateNumber || row.original.lifecycleState === "Inbound") {
        return <span className="text-muted-foreground">-</span>
      }
      return (
        <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{plateNumber}</span>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "driverSafetyScore",
    header: "Driver Safety Score",
    cell: ({ row }) => {
      const score = row.original.driverSafetyScore
      if (score === null) return <span className="text-muted-foreground">-</span>
      return <SafetyScoreRing score={score} />
    },
  },
  {
    accessorKey: "contractRisk",
    header: "Contract Risk",
    cell: ({ row }) => {
      const risk = row.original.contractRisk
      if (!risk) return <span className="text-muted-foreground">-</span>
      const variant = risk === "Low" ? "success" : risk === "Medium" ? "warning" : "danger"
      return <StatusBadge variant={variant}>{risk}</StatusBadge>
    },
  },
  {
    accessorKey: "collectionPercent",
    header: "Collection %",
    cell: ({ row }) => {
      const percent = row.original.collectionPercent
      if (percent === null) return <span className="text-muted-foreground">-</span>
      return <CollectionBar percent={percent} />
    },
  },
  {
    accessorKey: "daysInState",
    header: "Days in State",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.daysInState}d</span>
    ),
  },
  {
    accessorKey: "lifecycleState",
    header: "Lifecycle State",
    cell: ({ row }) => {
      const status = row.original.lifecycleState
      const variantMap: Record<string, "success" | "warning" | "neutral" | "refurb" | "info"> = {
        "Active": "success",
        "Portfolio - Inactive": "warning",
        "Inactive": "neutral",
        "Refurb": "refurb",
        "Inbound": "info",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "dateCreated",
    header: "Date Created",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.dateCreated}</span>
    ),
  },
]

function AddVehicleOptionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-gray-50 p-6 text-center transition-all hover:border-gray-300"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        <img src={icon} alt="" className="h-12 w-auto" />
      </div>
      <div>
        <p className="font-semibold text-sidebar-item-active" style={{ fontSize: '14px' }}>{title}</p>
        <p className="mt-1 font-medium text-breadcrumb-root" style={{ fontSize: '12px' }}>{description}</p>
      </div>
    </button>
  )
}

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

function FileDropZone({
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

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors h-full min-h-[280px] ${
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
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* XLS Icon */}
      <div className="flex flex-col items-center">
        <img src="/images/xls.svg" alt="XLS" className="h-12 w-auto" />
      </div>

      {file ? (
        <div className="text-center">
          <p className="font-medium text-green-600" style={{ fontSize: '14px' }}>{file.name}</p>
          <p className="mt-1 text-green-500" style={{ fontSize: '12px' }}>File uploaded successfully</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-medium text-sidebar-item" style={{ fontSize: '14px' }}>
            Drag and drop filled template sheet
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

const vehicleTypes = ["2 Wheeler", "3 Wheeler", "4 Wheeler"]
const manufacturers = ["Honda", "Toyota", "Yamaha", "Bajaj", "TVS", "Suzuki"]
const models = ["Model A", "Model B", "Model C", "Model D"]
const trims = ["Standard", "Premium", "Sport", "Luxury"]
const platformTypes = ["Electric", "Petrol", "Diesel", "Hybrid"]
const financialPartners = ["Access Bank", "GTBank", "First Bank", "Zenith Bank", "UBA"]
const locations = ["Ikeja", "Lekki", "Victoria Island", "Yaba", "Surulere", "Gbagada"]

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabFromUrl || "all")

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 10),
    to: new Date(2026, 9, 11),
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<FilterState>({
    championStatus: [],
    contractStatus: [],
    locations: [],
  })
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [addVehicleStep, setAddVehicleStep] = useState<"options" | "single" | "bulk" | "validating" | "validated" | "importing" | "imported">("options")
  const [addAnother, setAddAnother] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [validationStats] = useState({
    totalRows: 25,
    validEntries: 25,
    rowsWithErrors: 0,
  })

  // Bulk Update Vehicles state
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false)
  const [bulkUpdateStep, setBulkUpdateStep] = useState<"upload" | "validating" | "validated" | "importing" | "imported">("upload")
  const [bulkUpdateFile, setBulkUpdateFile] = useState<File | null>(null)
  const [bulkUpdateStats] = useState({
    totalRows: 18,
    validEntries: 18,
    rowsWithErrors: 0,
  })

  // Filter vehicles based on active tab
  const filteredVehicles = useMemo(() => {
    if (activeTab === "all") {
      return mockVehicles
    }
    return mockVehicles.filter((vehicle) => {
      const vehicleTabId = lifecycleStateToTabId[vehicle.lifecycleState]
      return vehicleTabId === activeTab
    })
  }, [activeTab])

  // Generate status tabs with dynamic counts
  const statusTabs = useMemo(() => getStatusTabs(mockVehicles), [])

  const handleOpenAddVehicle = () => {
    setAddVehicleStep("options")
    setShowAddVehicleModal(true)
  }

  const handleCloseAddVehicle = () => {
    setShowAddVehicleModal(false)
    setAddVehicleStep("options")
    setAddAnother(false)
    setDeliveryDate(undefined)
    setUploadedFile(null)
  }

  const handleOpenBulkUpdate = () => {
    setBulkUpdateStep("upload")
    setShowBulkUpdateModal(true)
  }

  const handleCloseBulkUpdate = () => {
    setShowBulkUpdateModal(false)
    setBulkUpdateStep("upload")
    setBulkUpdateFile(null)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Operations" }, { label: "Fleet Register" }]}
      />
      <PageHeader
        title="Fleet Register"
        subtitle="Keep full visibility and control over your vehicle fleet in one place."
        className="shrink-0"
      />

      <StatusTabs
        tabs={statusTabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setCurrentPage(1)
        }}
        className="shrink-0"
      />

      <div className="mx-6 mt-2 flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
        <FilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={(query) => console.log("Search:", query)}
          secondaryAction={{
            label: "Bulk Update Vehicles",
            onClick: handleOpenBulkUpdate,
            icon: "/images/bulk_update.svg",
          }}
          primaryAction={{
            label: "Add Vehicles",
            onClick: handleOpenAddVehicle,
            icon: Plus,
          }}
          className="shrink-0"
        />

        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={filteredVehicles}
            onRowClick={(row) => navigate(`/fleet-register/${row.id}`)}
          />
        </div>
      </div>

      <div className="shrink-0 mx-6 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVehicles.length / pageSize)}
          totalItems={filteredVehicles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="vehicles"
        />
      </div>

      {/* Add Vehicles Modal - Options */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "options"}
        onOpenChange={handleCloseAddVehicle}
        title="Add vehicles"
        subtitle="Choose how you want to add vehicles to the system."
      >
        <div className="grid grid-cols-2 gap-4">
          <AddVehicleOptionCard
            icon="/images/single_vehicle.svg"
            title="Add a single vehicle"
            description="Enter vehicle details manually"
            onClick={() => setAddVehicleStep("single")}
          />
          <AddVehicleOptionCard
            icon="/images/bulk_vehicles.svg"
            title="Bulk upload vehicles"
            description="Enter multiple vehicles at once"
            onClick={() => setAddVehicleStep("bulk")}
          />
        </div>
      </Modal>

      {/* Add Single Vehicle Modal */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "single"}
        onOpenChange={handleCloseAddVehicle}
        title="Add vehicles"
        subtitle="Choose how you want to add vehicles to the system."
        showBackButton
        onBack={() => setAddVehicleStep("options")}
        maxHeight="85vh"
        className="max-w-2xl"
        primaryAction={{
          label: "Add Vehicle",
          onClick: () => {
            console.log("Add vehicle submitted")
            if (!addAnother) {
              handleCloseAddVehicle()
            }
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleCloseAddVehicle,
        }}
        leftAction={
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addAnother}
              onChange={(e) => setAddAnother(e.target.checked)}
              className="h-4 w-4 rounded appearance-none border border-gray-200 bg-gray-100 checked:bg-brand-dark checked:border-brand-dark cursor-pointer checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
            />
            <span className="text-sm font-medium text-sidebar-item-active">Add another</span>
          </label>
        }
      >
        <div className="space-y-8">
          {/* Basic Vehicle Information */}
          <FormSection title="Basic Vehicle Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Vehicle Type">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Vehicle Manufacturer">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Model">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Trim">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a vehicle trim" />
                  </SelectTrigger>
                  <SelectContent>
                    {trims.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Platform Type">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a platform type" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformTypes.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Vehicle Identification */}
          <FormSection title="Vehicle Identification">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Chassis Number (VIN)">
                <Input placeholder="Enter the chassis number" className="h-12 bg-[#F8F8F8]" />
              </FormField>
              <FormField label="Engine Number">
                <Input placeholder="Enter the engine number" className="h-12 bg-[#F8F8F8]" />
              </FormField>
              <FormField label="Ignition Number">
                <Input placeholder="Enter the ignition number" className="h-12 bg-[#F8F8F8]" />
              </FormField>
            </div>
          </FormSection>

          {/* Vendor & Financial Details */}
          <FormSection title="Vendor & Financial Details">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="OEM/Vendor Name">
                <Input placeholder="Enter vendor name" className="h-12 bg-[#F8F8F8]" />
              </FormField>
              <FormField label="Financial Partner">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a financial partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialPartners.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>

          {/* Assignment, Location & Delivery Date */}
          <FormSection title="Assignment, Location & Delivery Date">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Receiver">
                <Input placeholder="Enter receiver name" className="h-12 bg-[#F8F8F8]" />
              </FormField>
              <FormField label="Location">
                <Select>
                  <SelectTrigger className="h-12 w-full bg-[#F8F8F8]">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Delivery Date">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-normal bg-[#F8F8F8]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? format(deliveryDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                    />
                  </PopoverContent>
                </Popover>
              </FormField>
            </div>
          </FormSection>
        </div>
      </Modal>

      {/* Bulk Upload Vehicles Modal */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "bulk"}
        onOpenChange={handleCloseAddVehicle}
        title="Bulk upload vehicles"
        subtitle="Upload multiple vehicles using a template sheet"
        showBackButton
        onBack={() => setAddVehicleStep("options")}
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setAddVehicleStep("validating")
            setTimeout(() => {
              setAddVehicleStep("validated")
            }, 2000)
          },
          disabled: !uploadedFile,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleCloseAddVehicle,
        }}
      >
        <div className="flex gap-6">
          {/* Left column - File Drop Zone */}
          <div className="w-[280px] shrink-0">
            <FileDropZone
              onFileSelect={setUploadedFile}
              file={uploadedFile}
            />
          </div>

          {/* Right column - Instructions */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: '16px' }}>
                Bulk add vehicles you wish to import into the system
              </h3>
              <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>
                Download the template, fill in the required vehicle details under the designated headers, and upload the completed file to import them into the system.
              </p>
            </div>
            <a
              href="#"
              className="inline-block font-medium underline"
              style={{ fontSize: '14px', color: '#F59E0B' }}
              onClick={(e) => {
                e.preventDefault()
                console.log("Download template")
              }}
            >
              Download template sheet
            </a>
            <div className="pt-2">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Loader Modal - Validating File */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "validating"}
        onOpenChange={() => setAddVehicleStep("bulk")}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 10V20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 60V70" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M70 40H60" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M20 40H10" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 18.79L54.14 25.86" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 54.14L18.79 61.21" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 61.21L54.14 54.14" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 25.86L18.79 18.79" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Validating file...
          </p>
        </div>
      </Modal>

      {/* Validation Report Modal */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "validated"}
        onOpenChange={handleCloseAddVehicle}
        title="Bulk upload vehicles"
        subtitle="Upload multiple vehicles using a template sheet"
        showBackButton
        onBack={() => setAddVehicleStep("bulk")}
        className="max-w-xl"
        primaryAction={{
          label: "Import Data",
          onClick: () => {
            setAddVehicleStep("importing")
            setTimeout(() => {
              setAddVehicleStep("imported")
            }, 2000)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleCloseAddVehicle,
        }}
      >
        <div className="flex flex-col items-center py-6">
          {/* Success Badge */}
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          
          {/* Title */}
          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Vehicles ready to import
          </h3>
          
          {/* Description */}
          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>
            All entries have been successfully validated. You can proceed with importing them into the system.
          </p>
          
          {/* Stats */}
          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: '28px' }}>
                  {validationStats.totalRows}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: '28px', color: '#22C55E' }}>
                  {validationStats.validEntries}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: '28px' }}>
                  {validationStats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Loader Modal - Importing Data */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "importing"}
        onOpenChange={() => setAddVehicleStep("validated")}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 10V20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 60V70" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M70 40H60" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M20 40H10" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 18.79L54.14 25.86" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 54.14L18.79 61.21" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 61.21L54.14 54.14" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 25.86L18.79 18.79" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Importing data...
          </p>
        </div>
      </Modal>

      {/* Import Success Modal */}
      <Modal
        open={showAddVehicleModal && addVehicleStep === "imported"}
        onOpenChange={handleCloseAddVehicle}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Import successful!
          </p>
          <button
            onClick={handleCloseAddVehicle}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>

      {/* ==================== BULK UPDATE VEHICLES FLOW ==================== */}

      {/* Bulk Update Vehicles - Upload Modal */}
      <Modal
        open={showBulkUpdateModal && bulkUpdateStep === "upload"}
        onOpenChange={handleCloseBulkUpdate}
        title="Bulk Update Vehicles"
        subtitle="Update multiple vehicles in the system all at once"
        className="max-w-3xl"
        primaryAction={{
          label: "Validate data",
          onClick: () => {
            setBulkUpdateStep("validating")
            setTimeout(() => {
              setBulkUpdateStep("validated")
            }, 2000)
          },
          disabled: !bulkUpdateFile,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleCloseBulkUpdate,
        }}
      >
        <div className="flex gap-8">
          {/* File Drop Zone */}
          <div className="w-[280px] shrink-0">
            <FileDropZone
              file={bulkUpdateFile}
              onFileSelect={setBulkUpdateFile}
            />
          </div>

          {/* Instructions */}
          <div className="flex-1">
            <h4 className="font-semibold text-sidebar-item-active" style={{ fontSize: '16px' }}>
              Update multiple vehicles at once
            </h4>
            <p className="mt-2 text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>
              Use the provided template to modify vehicle details and upload it to apply updates across selected records.
            </p>
            <a 
              href="#" 
              className="mt-4 inline-block underline font-medium"
              style={{ color: '#F59E0B', fontSize: '14px' }}
            >
              Download template sheet
            </a>
            <div className="pt-2">
              <img src="/images/upload_sheet.svg" alt="Spreadsheet preview" className="w-full" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Update - Validating Loader Modal */}
      <Modal
        open={showBulkUpdateModal && bulkUpdateStep === "validating"}
        onOpenChange={() => setBulkUpdateStep("upload")}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 10V20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 60V70" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M70 40H60" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M20 40H10" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 18.79L54.14 25.86" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 54.14L18.79 61.21" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 61.21L54.14 54.14" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 25.86L18.79 18.79" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Validating file...
          </p>
        </div>
      </Modal>

      {/* Bulk Update - Validation Report Modal */}
      <Modal
        open={showBulkUpdateModal && bulkUpdateStep === "validated"}
        onOpenChange={handleCloseBulkUpdate}
        title="Bulk Update Vehicles"
        subtitle="Update multiple vehicles in the system all at once"
        showBackButton
        onBack={() => setBulkUpdateStep("upload")}
        className="max-w-xl"
        primaryAction={{
          label: "Update Data",
          onClick: () => {
            setBulkUpdateStep("importing")
            setTimeout(() => {
              setBulkUpdateStep("imported")
            }, 2000)
          },
          icon: true,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleCloseBulkUpdate,
        }}
      >
        <div className="flex flex-col items-center py-6">
          {/* Success Badge */}
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-16 w-16" />
          
          {/* Title */}
          <h3 className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Vehicles ready to update
          </h3>
          
          {/* Description */}
          <p className="mt-2 text-center text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>
            All entries have been successfully validated. You can proceed with updating them in the system.
          </p>
          
          {/* Stats */}
          <div className="mt-8 w-full rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Total Rows</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: '28px' }}>
                  {bulkUpdateStats.totalRows}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Valid Entries</p>
                <p className="mt-2 font-semibold" style={{ fontSize: '28px', color: '#22C55E' }}>
                  {bulkUpdateStats.validEntries}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-breadcrumb-root font-medium" style={{ fontSize: '13px' }}>Rows with Errors</p>
                <p className="mt-2 font-semibold text-sidebar-item-active" style={{ fontSize: '28px' }}>
                  {bulkUpdateStats.rowsWithErrors}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Update - Importing Loader Modal */}
      <Modal
        open={showBulkUpdateModal && bulkUpdateStep === "importing"}
        onOpenChange={() => setBulkUpdateStep("validated")}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 10V20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 60V70" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M70 40H60" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M20 40H10" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 18.79L54.14 25.86" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 54.14L18.79 61.21" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M61.21 61.21L54.14 54.14" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
              <path d="M25.86 25.86L18.79 18.79" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Updating data...
          </p>
        </div>
      </Modal>

      {/* Bulk Update - Success Modal */}
      <Modal
        open={showBulkUpdateModal && bulkUpdateStep === "imported"}
        onOpenChange={handleCloseBulkUpdate}
        hideHeader
        className="max-w-[280px]"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <img src="/images/success_Checkmark.svg" alt="Success" className="h-20 w-20" />
          <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: '18px' }}>
            Update successful!
          </p>
          <button
            onClick={handleCloseBulkUpdate}
            className="mt-8 px-12 py-3 rounded-lg bg-brand-dark text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  )
}
