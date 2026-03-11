import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus, Search, SlidersHorizontal } from "lucide-react"

import {
  PageLayout,
  Sidebar,
  TopBar,
  PageHeader,
  DataTable,
  StatusBadge,
  Pagination,
  GenericFilterPopover,
  getActiveFilterCount,
  type SidebarSection,
  type SidebarUser,
  type SidebarItem,
  type FilterSection,
  type GenericFilterState,
} from "@/components/max"
import { StatCard } from "@/components/max/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface CheckInRecord {
  id: string
  assetType: string
  assetId: string
  checkInType: "Yard Check-In" | "3PL Check-In" | "Inbound"
  reason: string
  location: string
  checkInDate: string
  days: number
  sla: number
  breachStatus: "Breached" | "Near SLA" | "Within SLA"
  nextAction: "Deactivate" | "Follow Up" | "Assessment Required" | "Monitor" | "Escalate"
}

export interface CheckoutRecord {
  id: string
  assetType: string
  assetId: string
  plateNumber: string
  checkInDate: string
  checkOutDate: string
  checkInReason: string
  checkOutStatus: "Active Vehicle" | "OEM Outbound" | "Outright Sale" | "Operational Vehicle"
  location: string
  officer: string
}

export interface MovementLogRecord {
  id: string
  assetType: string
  assetId: string
  timestamp: string
  plateNumber: string
  movementType: "Check-In" | "Check-Out"
  movementReason: string
  location: string
  officer: string
  referenceSource: string
}

const sidebarSections: SidebarSection[] = [
  {
    id: "home",
    label: "Home",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_menu.svg",
        href: "/dashboard",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "fleet-register",
        label: "Fleet Register",
        icon: "/images/fleet_menu.svg",
        badge: "24K",
        href: "/fleet-register",
      },
      {
        id: "asset-movement",
        label: "Asset Movement",
        icon: "/images/fleet_menu.svg",
        href: "/asset-movement",
        isActive: true,
      },
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    items: [
      {
        id: "growth-activation",
        label: "Growth & Activation",
        icon: "/images/agent_menu.svg",
        children: [
          {
            id: "activation-dashboard",
            label: "Activation Dashboard",
          },
          {
            id: "mcp-management",
            label: "MCP Management",
          },
          {
            id: "chairman-dashboard",
            label: "Chairman Dashboard",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
        ],
      },
      {
        id: "inbound",
        label: "Inbound",
        icon: "/images/fleet_menu.svg",
      },
    ],
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    items: [
      {
        id: "refurbishment",
        label: "Refurbishment",
        icon: "/images/config_menu.svg",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: "/images/config_menu.svg",
        children: [
          {
            id: "service-schedule",
            label: "Service Schedule",
          },
          {
            id: "predictive-lab",
            label: "Predictive Lab",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
        ],
      },
      {
        id: "disposal-auction",
        label: "Disposal & Auction",
        icon: "/images/config_menu.svg",
        children: [
          {
            id: "disposal-management",
            label: "Disposal Management",
          },
          {
            id: "conversion-request",
            label: "Conversion Request",
          },
          {
            id: "auction",
            label: "Auction",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
          {
            id: "scrap-management",
            label: "Scrap Management",
          },
          {
            id: "closed-assets",
            label: "Closed Assets",
          },
        ],
      },
    ],
  },
  {
    id: "fleet-intelligence",
    label: "Fleet Intelligence",
    items: [
      {
        id: "fleet-performance",
        label: "Fleet Performance",
        icon: "/images/dashboard_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "driver-safety",
        label: "Driver Safety",
        icon: "/images/dashboard_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "asset-health",
        label: "Asset Health",
        icon: "/images/dashboard_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "revenue-analytics",
        label: "Revenue Analytics",
        icon: "/images/dashboard_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
    ],
  },
  {
    id: "control",
    label: "Control",
    items: [
      {
        id: "asset-assessment-engine",
        label: "Asset Assessment Engine",
        icon: "/images/issues_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: "/images/issues_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "vendor-management",
        label: "Vendor Management",
        icon: "/images/issues_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "governance",
        label: "Governance",
        icon: "/images/issues_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
    ],
  },
]

const sidebarUser: SidebarUser = {
  name: "Desmond Nsogbuwa",
  role: "Fleet Manager",
}

const COLOR_BRAND_PRIMARY = "#FCDD00"
const COLOR_BADGE_ACTIVE = "#008356"
const COLOR_STATUS_WARNING = "#E88E15"
const COLOR_STATUS_INFO = "#1855FC"
const COLOR_STATUS_DANGER = "#DC2626"
const COLOR_GRAY_500 = "#737373"

const checkInStats = [
  {
    title: "Total Check-In",
    value: 11,
    indicatorColor: COLOR_BRAND_PRIMARY,
  },
  {
    title: "Yard Check-In",
    value: 9,
    indicatorColor: COLOR_BADGE_ACTIVE,
  },
  {
    title: "3PL Check-In",
    value: 2,
    indicatorColor: COLOR_STATUS_INFO,
  },
  {
    title: "Inbound – Ready",
    value: 6,
    indicatorColor: COLOR_STATUS_WARNING,
  },
  {
    title: "In Breach",
    value: 6,
    indicatorColor: COLOR_STATUS_DANGER,
  },
  {
    title: "Due for Deactivation",
    value: 7,
    indicatorColor: COLOR_GRAY_500,
  },
]

const COLOR_FILTER_YARD = "#008356"
const COLOR_FILTER_3PL = "#1855FC"
const COLOR_FILTER_INBOUND = "#E88E15"
const COLOR_FILTER_SUCCESS = "#16B04F"
const COLOR_FILTER_WARNING = "#E88E15"
const COLOR_FILTER_DANGER = "#DC2626"

const checkInFilterSections: FilterSection[] = [
  {
    id: "checkInType",
    title: "Check-In Type",
    defaultExpanded: true,
    options: [
      { value: "Yard Check-In", label: "Yard Check-In", color: COLOR_FILTER_YARD },
      { value: "3PL Check-In", label: "3PL Check-In", color: COLOR_FILTER_3PL },
      { value: "Inbound", label: "Inbound", color: COLOR_FILTER_INBOUND },
    ],
  },
  {
    id: "reason",
    title: "Reason",
    options: [
      { value: "Accident", label: "Accident" },
      { value: "Driver Churn", label: "Driver Churn" },
      { value: "Financial Default", label: "Financial Default" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Operational Vehicle", label: "Operational Vehicle" },
      { value: "Time-Off", label: "Time-Off" },
      { value: "Impoundment", label: "Impoundment" },
      { value: "3rd Party Maintenance", label: "3rd Party Maintenance" },
      { value: "Inbound- Ready for Activation", label: "Inbound- Ready for Activation" },
    ],
  },
  {
    id: "location",
    title: "Locations",
    options: [
      { value: "Ekiti", label: "Ekiti" },
      { value: "Gbagba", label: "Gbagba" },
      { value: "Eleyele", label: "Eleyele" },
      { value: "Karu", label: "Karu" },
      { value: "Bodija", label: "Bodija" },
      { value: "Lekki", label: "Lekki" },
    ],
  },
  {
    id: "officer",
    title: "Officers",
    options: [
      { value: "John Adebayo", label: "John Adebayo" },
      { value: "Sarah Okonkwo", label: "Sarah Okonkwo" },
      { value: "Michael Eze", label: "Michael Eze" },
      { value: "Grace Afolabi", label: "Grace Afolabi" },
      { value: "David Nnamdi", label: "David Nnamdi" },
    ],
  },
  {
    id: "breachStatus",
    title: "Breach Status",
    options: [
      { value: "Within SLA", label: "Within SLA", color: COLOR_FILTER_SUCCESS },
      { value: "Near SLA", label: "Near SLA", color: COLOR_FILTER_WARNING },
      { value: "Breached", label: "Breached", color: COLOR_FILTER_DANGER },
    ],
  },
]

const checkoutStats = [
  {
    title: "Total Check-Out Today",
    value: 5,
    indicatorColor: COLOR_BRAND_PRIMARY,
  },
  {
    title: "Returned to Active",
    value: 2,
    indicatorColor: COLOR_BADGE_ACTIVE,
  },
  {
    title: "OEM Outbound",
    value: 1,
    indicatorColor: COLOR_STATUS_WARNING,
  },
  {
    title: "Outright Sales",
    value: 1,
    indicatorColor: COLOR_STATUS_DANGER,
  },
  {
    title: "Operational Vehicles",
    value: 1,
    indicatorColor: COLOR_STATUS_INFO,
  },
  {
    title: "Inbound Activated",
    value: 1,
    indicatorColor: COLOR_BADGE_ACTIVE,
  },
]

const checkoutFilterSections: FilterSection[] = [
  {
    id: "checkInReason",
    title: "Check-In Reasons",
    defaultExpanded: true,
    options: [
      { value: "Maintenance", label: "Maintenance" },
      { value: "Financial Default", label: "Financial Default" },
      { value: "Impoundment / Law Enforcement", label: "Impoundment / Law Enforcement" },
      { value: "Operational Vehicle", label: "Operational Vehicle" },
      { value: "Inbound – Ready for Activation", label: "Inbound – Ready for Activation" },
    ],
  },
  {
    id: "checkOutStatus",
    title: "Check-Out Status",
    options: [
      { value: "Active Vehicle", label: "Active Vehicle", color: COLOR_FILTER_SUCCESS },
      { value: "OEM Outbound", label: "OEM Outbound", color: COLOR_FILTER_WARNING },
      { value: "Outright Sale", label: "Outright Sale", color: COLOR_FILTER_DANGER },
      { value: "Operational Vehicle", label: "Operational Vehicle", color: COLOR_FILTER_3PL },
    ],
  },
  {
    id: "location",
    title: "Locations",
    options: [
      { value: "Ikeja Yard", label: "Ikeja Yard" },
      { value: "Surulere Yard", label: "Surulere Yard" },
      { value: "Abuja Yard", label: "Abuja Yard" },
    ],
  },
  {
    id: "officer",
    title: "Officers",
    options: [
      { value: "Adewale O.", label: "Adewale O." },
      { value: "Funmi A.", label: "Funmi A." },
      { value: "Emeka I.", label: "Emeka I." },
      { value: "Chidi N.", label: "Chidi N." },
    ],
  },
]

const defaultCheckoutFilters: GenericFilterState = {
  checkInReason: [],
  checkOutStatus: [],
  location: [],
  officer: [],
}

const mockCheckoutRecords: CheckoutRecord[] = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-101",
    plateNumber: "LAG-101-AA",
    checkInDate: "2026-03-06",
    checkOutDate: "2026-03-11",
    checkInReason: "Maintenance",
    checkOutStatus: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
  },
  {
    id: "2",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-202",
    plateNumber: "LAG-202-BB",
    checkInDate: "2026-03-03",
    checkOutDate: "2026-03-11",
    checkInReason: "Financial Default",
    checkOutStatus: "OEM Outbound",
    location: "Surulere Yard",
    officer: "Funmi A.",
  },
  {
    id: "3",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-303",
    plateNumber: "ABJ-303-CC",
    checkInDate: "2026-02-25",
    checkOutDate: "2026-03-10",
    checkInReason: "Impoundment / Law Enforcement",
    checkOutStatus: "Outright Sale",
    location: "Abuja Yard",
    officer: "Emeka I.",
  },
  {
    id: "4",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-404",
    plateNumber: "LAG-404-DD",
    checkInDate: "2026-03-08",
    checkOutDate: "2026-03-11",
    checkInReason: "Operational Vehicle",
    checkOutStatus: "Operational Vehicle",
    location: "Ikeja Yard",
    officer: "Chidi N.",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-505",
    plateNumber: "LAG-505-EE",
    checkInDate: "2026-03-09",
    checkOutDate: "2026-03-11",
    checkInReason: "Inbound – Ready for Activation",
    checkOutStatus: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
  },
]

const movementLogFilterSections: FilterSection[] = [
  {
    id: "movementType",
    title: "Types",
    defaultExpanded: true,
    options: [
      { value: "Check-In", label: "Check-In", color: COLOR_FILTER_WARNING },
      { value: "Check-Out", label: "Check-Out", color: COLOR_FILTER_SUCCESS },
    ],
  },
  {
    id: "movementReason",
    title: "Reasons",
    options: [
      { value: "OEM Outbound", label: "OEM Outbound" },
      { value: "Active Vehicle", label: "Active Vehicle" },
      { value: "Operational Vehicle", label: "Operational Vehicle" },
      { value: "Outright Sale", label: "Outright Sale" },
      { value: "Inbound – Ready for Activation", label: "Inbound – Ready for Activation" },
    ],
  },
  {
    id: "location",
    title: "Locations",
    options: [
      { value: "Surulere Yard", label: "Surulere Yard" },
      { value: "Ikeja Yard", label: "Ikeja Yard" },
      { value: "Abuja Yard", label: "Abuja Yard" },
      { value: "Accra 3PL", label: "Accra 3PL" },
    ],
  },
  {
    id: "officer",
    title: "Officers",
    options: [
      { value: "Funmi A.", label: "Funmi A." },
      { value: "Adewale O.", label: "Adewale O." },
      { value: "Chidi N.", label: "Chidi N." },
      { value: "Emeka I.", label: "Emeka I." },
      { value: "Kofi M.", label: "Kofi M." },
    ],
  },
]

const defaultMovementLogFilters: GenericFilterState = {
  movementType: [],
  movementReason: [],
  location: [],
  officer: [],
}

const mockMovementLogRecords: MovementLogRecord[] = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-202",
    timestamp: "11 Mar 2026 15:00",
    plateNumber: "LAG-202-BB",
    movementType: "Check-Out",
    movementReason: "OEM Outbound",
    location: "Surulere Yard",
    officer: "Funmi A.",
    referenceSource: "CO-102",
  },
  {
    id: "2",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-101",
    timestamp: "11 Mar 2026 14:45",
    plateNumber: "LAG-101-AA",
    movementType: "Check-Out",
    movementReason: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CO-101",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-404",
    timestamp: "11 Mar 2026 14:30",
    plateNumber: "LAG-404-DD",
    movementType: "Check-Out",
    movementReason: "Operational Vehicle",
    location: "Ikeja Yard",
    officer: "Chidi N.",
    referenceSource: "CO-104",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-505",
    timestamp: "11 Mar 2026 14:15",
    plateNumber: "LAG-505-EE",
    movementType: "Check-Out",
    movementReason: "Active Vehicle",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CO-105",
  },
  {
    id: "5",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-303",
    timestamp: "11 Mar 2026 14:00",
    plateNumber: "ABJ-303-CC",
    movementType: "Check-Out",
    movementReason: "Outright Sale",
    location: "Abuja Yard",
    officer: "Emeka I.",
    referenceSource: "CO-103",
  },
  {
    id: "6",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-201",
    timestamp: "11 Mar 2026 13:45",
    plateNumber: "GH-201-KL",
    movementType: "Check-Out",
    movementReason: "Inbound – Ready for Activation",
    location: "Accra 3PL",
    officer: "Kofi M.",
    referenceSource: "CO-107",
  },
  {
    id: "7",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-501",
    timestamp: "11 Mar 2026 13:30",
    plateNumber: "LAG-501-UV",
    movementType: "Check-In",
    movementReason: "Maintenance",
    location: "Ikeja Yard",
    officer: "Adewale O.",
    referenceSource: "CI-111",
  },
]

const mockCheckInRecords: CheckInRecord[] = [
  {
    id: "1",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-203",
    checkInType: "Yard Check-In",
    reason: "Maintenance",
    location: "Ekiti",
    checkInDate: "12 Mar 2026",
    days: 5,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
  {
    id: "2",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-204",
    checkInType: "3PL Check-In",
    reason: "Accident",
    location: "Gbagba",
    checkInDate: "10 Mar 2026",
    days: 7,
    sla: 7,
    breachStatus: "Near SLA",
    nextAction: "Follow Up",
  },
  {
    id: "3",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-205",
    checkInType: "Yard Check-In",
    reason: "Driver Churn",
    location: "Eleyele",
    checkInDate: "8 Mar 2026",
    days: 10,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Deactivate",
  },
  {
    id: "4",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-206",
    checkInType: "Inbound",
    reason: "Inbound- Ready for Activation",
    location: "Karu",
    checkInDate: "11 Mar 2026",
    days: 2,
    sla: 5,
    breachStatus: "Within SLA",
    nextAction: "Assessment Required",
  },
  {
    id: "5",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-207",
    checkInType: "Yard Check-In",
    reason: "Financial Default",
    location: "Bodija",
    checkInDate: "5 Mar 2026",
    days: 12,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Escalate",
  },
  {
    id: "6",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-208",
    checkInType: "3PL Check-In",
    reason: "3rd Party Maintenance",
    location: "Lekki",
    checkInDate: "9 Mar 2026",
    days: 6,
    sla: 7,
    breachStatus: "Near SLA",
    nextAction: "Follow Up",
  },
  {
    id: "7",
    assetType: "4 Wheeler",
    assetId: "MAX-IB-CH-209",
    checkInType: "Yard Check-In",
    reason: "Operational Vehicle",
    location: "Ekiti",
    checkInDate: "7 Mar 2026",
    days: 8,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Deactivate",
  },
  {
    id: "8",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-210",
    checkInType: "Yard Check-In",
    reason: "Time-Off",
    location: "Gbagba",
    checkInDate: "11 Mar 2026",
    days: 3,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
  {
    id: "9",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-211",
    checkInType: "Yard Check-In",
    reason: "Impoundment",
    location: "Eleyele",
    checkInDate: "6 Mar 2026",
    days: 9,
    sla: 7,
    breachStatus: "Breached",
    nextAction: "Escalate",
  },
  {
    id: "10",
    assetType: "3 Wheeler",
    assetId: "MAX-IN-CH-212",
    checkInType: "Inbound",
    reason: "Inbound- Ready for Activation",
    location: "Karu",
    checkInDate: "10 Mar 2026",
    days: 4,
    sla: 5,
    breachStatus: "Near SLA",
    nextAction: "Assessment Required",
  },
  {
    id: "11",
    assetType: "2 Wheeler",
    assetId: "MAX-IB-CH-213",
    checkInType: "Yard Check-In",
    reason: "Maintenance",
    location: "Bodija",
    checkInDate: "12 Mar 2026",
    days: 1,
    sla: 7,
    breachStatus: "Within SLA",
    nextAction: "Monitor",
  },
]

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

const defaultCheckInFilters: GenericFilterState = {
  checkInType: [],
  reason: [],
  location: [],
  officer: [],
  breachStatus: [],
}

const columns: ColumnDef<CheckInRecord>[] = [
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
    accessorKey: "checkInType",
    header: "Check-In Type",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.checkInType}</span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.reason}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.checkInDate}</span>
    ),
  },
  {
    accessorKey: "days",
    header: "Days",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.days}</span>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.sla}</span>
    ),
  },
  {
    accessorKey: "breachStatus",
    header: "Breach Status",
    cell: ({ row }) => {
      const status = row.original.breachStatus
      const variantMap: Record<string, "success" | "warning" | "danger"> = {
        "Within SLA": "success",
        "Near SLA": "warning",
        "Breached": "danger",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
    },
  },
  {
    accessorKey: "nextAction",
    header: "Next Action",
    cell: ({ row }) => {
      const action = row.original.nextAction
      const variantMap: Record<string, "danger" | "warning" | "info" | "default"> = {
        "Deactivate": "danger",
        "Follow Up": "warning",
        "Escalate": "warning",
        "Assessment Required": "info",
        "Monitor": "default",
      }
      return <StatusBadge variant={variantMap[action]}>{action}</StatusBadge>
    },
  },
]

const checkoutColumns: ColumnDef<CheckoutRecord>[] = [
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
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: '14px' }}>{row.original.plateNumber}</span>
    ),
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.checkInDate}</span>
    ),
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-Out Date",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.checkOutDate}</span>
    ),
  },
  {
    accessorKey: "checkInReason",
    header: "Check-In Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.checkInReason}</span>
    ),
  },
  {
    accessorKey: "checkOutStatus",
    header: "Check-Out Status",
    cell: ({ row }) => {
      const status = row.original.checkOutStatus
      const variantMap: Record<string, "success" | "warning" | "danger" | "info"> = {
        "Active Vehicle": "success",
        "OEM Outbound": "warning",
        "Outright Sale": "danger",
        "Operational Vehicle": "info",
      }
      return <StatusBadge variant={variantMap[status]}>{status}</StatusBadge>
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
    accessorKey: "officer",
    header: "Officer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.officer}</span>
    ),
  },
]

const movementLogColumns: ColumnDef<MovementLogRecord>[] = [
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
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.timestamp}</span>
    ),
  },
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
    cell: ({ row }) => (
      <span className="font-medium text-table-text-primary" style={{ fontSize: '14px' }}>{row.original.plateNumber}</span>
    ),
  },
  {
    accessorKey: "movementType",
    header: "Movement Type",
    cell: ({ row }) => {
      const type = row.original.movementType
      const variant = type === "Check-Out" ? "success" : "warning"
      return <StatusBadge variant={variant}>{type}</StatusBadge>
    },
  },
  {
    accessorKey: "movementReason",
    header: "Movement Reason",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.movementReason}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "officer",
    header: "Officer",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.officer}</span>
    ),
  },
  {
    accessorKey: "referenceSource",
    header: "Reference Source",
    cell: ({ row }) => (
      <span className="font-medium text-table-text" style={{ fontSize: '14px' }}>{row.original.referenceSource}</span>
    ),
  },
]

export default function AssetMovementPage() {
  const navigate = useNavigate()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<GenericFilterState>(defaultCheckInFilters)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const activeFilterCount = getActiveFilterCount(filters)

  const [checkoutCurrentPage, setCheckoutCurrentPage] = useState(1)
  const [checkoutPageSize, setCheckoutPageSize] = useState(25)
  const [checkoutFilters, setCheckoutFilters] = useState<GenericFilterState>(defaultCheckoutFilters)
  const [checkoutSearchQuery, setCheckoutSearchQuery] = useState("")
  const [checkoutSearchOpen, setCheckoutSearchOpen] = useState(false)
  const checkoutActiveFilterCount = getActiveFilterCount(checkoutFilters)

  const [movementLogCurrentPage, setMovementLogCurrentPage] = useState(1)
  const [movementLogPageSize, setMovementLogPageSize] = useState(25)
  const [movementLogFilters, setMovementLogFilters] = useState<GenericFilterState>(defaultMovementLogFilters)
  const [movementLogSearchQuery, setMovementLogSearchQuery] = useState("")
  const [movementLogSearchOpen, setMovementLogSearchOpen] = useState(false)
  const movementLogActiveFilterCount = getActiveFilterCount(movementLogFilters)

  const handleNewCheckIn = () => {
    console.log("New Check-In clicked")
  }

  const handleNewCheckout = () => {
    console.log("New Check-Out clicked")
  }

  return (
    <PageLayout
      sidebar={({ isCollapsed, onToggleCollapse }) => (
        <Sidebar
          sections={sidebarSections}
          user={sidebarUser}
          onItemClick={(item: SidebarItem) => {
            if (item.href) {
              navigate(item.href)
            }
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}
    >
      <TopBar
        breadcrumbs={[{ label: "Operations" }, { label: "Asset Movement" }]}
      />
      <PageHeader
        title="Asset Movement"
        subtitle="Monitor vehicle check-ins, check-outs, and movement history"
        className="shrink-0"
      />

      <Tabs defaultValue="check-in" className="flex-1 flex flex-col min-h-0 px-6">
        <TabsList variant="line" className="shrink-0 pb-0 gap-0 w-fit">
          <TabsTrigger 
            value="check-in"
            className="px-4 py-2"
            style={{ fontSize: '14px' }}
          >
            Check-In
          </TabsTrigger>
          <TabsTrigger 
            value="checkout"
            className="px-4 py-2"
            style={{ fontSize: '14px' }}
          >
            Checkout
          </TabsTrigger>
          <TabsTrigger 
            value="movement-log"
            className="px-4 py-2"
            style={{ fontSize: '14px' }}
          >
            Movement Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check-in" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="grid grid-cols-6 gap-2 shrink-0">
            {checkInStats.map((stat) => (
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
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {activeFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={checkInFilterSections}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </PopoverContent>
                </Popover>
                
                {searchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="h-9 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Search:", searchQuery)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
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
                    className="h-9 w-9 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleNewCheckIn}
                className="h-9 bg-brand-dark hover:bg-brand-dark/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Check-In
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DataTable
                columns={columns}
                data={mockCheckInRecords}
                onRowClick={(row) => navigate(`/asset-movement/${row.id}`)}
              />
            </div>
          </div>

          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(mockCheckInRecords.length / pageSize)}
              totalItems={mockCheckInRecords.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemLabel="records"
            />
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="grid grid-cols-6 gap-2 shrink-0">
            {checkoutStats.map((stat) => (
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
              <div className="flex items-center gap-2">
                {checkoutSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={checkoutSearchQuery}
                      onChange={(e) => setCheckoutSearchQuery(e.target.value)}
                      placeholder="Search plate..."
                      className="h-9 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Search:", checkoutSearchQuery)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setCheckoutSearchOpen(false)
                        setCheckoutSearchQuery("")
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
                    className="h-9 w-9 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setCheckoutSearchOpen(true)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {checkoutActiveFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {checkoutActiveFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={checkoutFilterSections}
                      filters={checkoutFilters}
                      onFiltersChange={setCheckoutFilters}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button
                onClick={handleNewCheckout}
                className="h-9 bg-brand-dark hover:bg-brand-dark/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Check-Out
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DataTable
                columns={checkoutColumns}
                data={mockCheckoutRecords}
                onRowClick={(row) => navigate(`/asset-movement/${row.id}`)}
              />
            </div>
          </div>

          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={checkoutCurrentPage}
              totalPages={Math.ceil(mockCheckoutRecords.length / checkoutPageSize)}
              totalItems={mockCheckoutRecords.length}
              pageSize={checkoutPageSize}
              onPageChange={setCheckoutCurrentPage}
              onPageSizeChange={setCheckoutPageSize}
              itemLabel="records"
            />
          </div>
        </TabsContent>

        <TabsContent value="movement-log" className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-2 shrink-0">
              <div className="flex items-center gap-2">
                {movementLogSearchOpen ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={movementLogSearchQuery}
                      onChange={(e) => setMovementLogSearchQuery(e.target.value)}
                      placeholder="Search plate..."
                      className="h-9 w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Search:", movementLogSearchQuery)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        setMovementLogSearchOpen(false)
                        setMovementLogSearchQuery("")
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
                    className="h-9 w-9 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setMovementLogSearchOpen(true)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 bg-gray-100 text-foreground hover:bg-gray-200"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-sm">Filter</span>
                      {movementLogActiveFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-xs text-white">
                          {movementLogActiveFilterCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <GenericFilterPopover
                      sections={movementLogFilterSections}
                      filters={movementLogFilters}
                      onFiltersChange={setMovementLogFilters}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DataTable
                columns={movementLogColumns}
                data={mockMovementLogRecords}
                onRowClick={(row) => navigate(`/asset-movement/${row.id}`)}
              />
            </div>
          </div>

          <div className="shrink-0 mt-1 mb-6 rounded-t-[4px] rounded-b-[14px] border border-table-border bg-content-card">
            <Pagination
              currentPage={movementLogCurrentPage}
              totalPages={Math.ceil(mockMovementLogRecords.length / movementLogPageSize)}
              totalItems={mockMovementLogRecords.length}
              pageSize={movementLogPageSize}
              onPageChange={setMovementLogCurrentPage}
              onPageSizeChange={setMovementLogPageSize}
              itemLabel="records"
            />
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
