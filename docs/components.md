# MaxOne Design System Components

This document catalogs all reusable components in the MaxOne design system. These components are designed specifically for the MaxOne Fleet Management application and should be used across all pages.

## Table of Contents

- [Introduction](#introduction)
- [Component Architecture](#component-architecture)
- [Layout Components](#layout-components)
  - [PageLayout](#pagelayout)
  - [Sidebar](#sidebar)
  - [TopBar](#topbar)
  - [PageHeader](#pageheader)
  - [AppLayout](#applayout)
  - [BackButton](#backbutton)
- [Navigation Components](#navigation-components)
  - [StatusTabs](#statustabs)
- [Data Display Components](#data-display-components)
  - [DataTable](#datatable)
  - [StatusBadge](#statusbadge)
  - [Pagination](#pagination)
  - [StatCard](#statcard)
  - [TimelineEntry](#timelineentry)
  - [StatusTimeline](#statustimeline)
- [Chart Components](#chart-components)
  - [DistributionChart](#distributionchart)
  - [HorizontalBarChart](#horizontalbarchart)
- [Form/Filter Components](#formfilter-components)
  - [FilterBar](#filterbar)
  - [FilterPopover](#filterpopover)
  - [ExpandableSearch](#expandablesearch)
  - [GenericFilterPopover](#genericfilterpopover)
  - [LocationAutocomplete](#locationautocomplete)
  - [DatePickerField](#datepickerfield)
  - [DocDropZone](#docdropzone)
  - [FormField](#formfield)
  - [CheckboxGrid](#checkboxgrid)
- [Form/Input Components](#forminput-components)
  - [TagInput](#taginput)
  - [DocUpload](#docupload)
- [Dialog Components](#dialog-components)
  - [Modal](#modal)
  - [ConfirmModal](#confirmmodal)
  - [LoaderModal](#loadermodal)
- [Feedback Components](#feedback-components)
  - [Banner](#banner)
  - [Toast](#toast)
  - [Tooltip](#tooltip)
- [Data Card Components](#data-card-components)
  - [InfoCard](#infocard)
  - [InfoGrid](#infogrid)
  - [ChampionInformation](#championinformation)
  - [VehicleOverviewCard](#vehicleoverviewcard)
  - [AssignmentHistoryCard](#assignmenthistorycard)
  - [LifecycleMiniCard](#lifecycleminicard)
  - [LifecycleFlowCard](#lifecycleflowcard)
  - [FleetDistributionCard](#fleetdistributioncard)
  - [ActivationQueueCard](#activationqueuecard)
  - [ContractInformation](#contractinformation)
  - [WalletInformation](#walletinformation)
  - [MaxIDCard](#maxidcard)
- [Map Components](#map-components)
  - [BatteryMap](#batterymap)
  - [BatteryStatusFilterChips](#batterystatusfilterchips)
  - [BatteryListCard](#batterylistcard)
  - [BatteryLevelIcon](#batterylevelicon)
- [Sheet Components](#sheet-components)
  - [TicketDetailSheet](#ticketdetailsheet)
  - [DriverDetailSheet](#driverdetailsheet)
  - [IncidentChampionsSheet](#incidentchampionssheet)
  - [WelfareDetailSheet](#welfaredetailsheet)
  - [TransferRequestSheet](#transferrequestsheet)
  - [ContractDetailSheet](#contractdetailsheet)
  - [PendingRecoveryDetailSheet](#pendingrecoverydetailsheet)
- [Icon Components](#icon-components)
  - [VehicleIcon](#vehicleicon)
- [Page Patterns](#page-patterns)
  - [Create Ticket Wizard](#create-ticket-wizard)
- [Color Tokens](#color-tokens)

---

## Introduction

The MaxOne design system provides a consistent set of UI components for building fleet management interfaces. All components are built with:

- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** as the base component library

## Component Architecture

```
src/components/
├── ui/           # Base shadcn components (do not use directly in pages)
│   ├── button.tsx
│   ├── input.tsx
│   ├── table.tsx
│   └── ...
└── max/          # MaxOne design system components (use these in pages)
    ├── PageLayout.tsx
    ├── AppLayout.tsx
    ├── Sidebar.tsx
    ├── TopBar.tsx
    ├── PageHeader.tsx
    ├── BackButton.tsx
    ├── StatusTabs.tsx
    ├── FilterBar.tsx
    ├── ExpandableSearch.tsx
    ├── FilterPopover.tsx
    ├── GenericFilterPopover.tsx
    ├── DataTable.tsx
    ├── StatusBadge.tsx
    ├── Pagination.tsx
    ├── StatCard.tsx
    ├── TimelineEntry.tsx
    ├── StatusTimeline.tsx
    ├── DistributionChart.tsx
    ├── HorizontalBarChart.tsx
    ├── InfoCard.tsx
    ├── InfoGrid.tsx
    ├── ChampionInformation.tsx
    ├── VehicleOverviewCard.tsx
    ├── AssignmentHistoryCard.tsx
    ├── LifecycleMiniCard.tsx
    ├── LifecycleFlowCard.tsx
    ├── FleetDistributionCard.tsx
    ├── ActivationQueueCard.tsx
    ├── ContractInformation.tsx
    ├── WalletInformation.tsx
    ├── MaxIDCard.tsx
    ├── BatteryMap.tsx
    ├── BatteryStatusFilterChips.tsx
    ├── BatteryListCard.tsx
    ├── BatteryLevelIcon.tsx
    ├── LocationAutocomplete.tsx
    ├── DatePickerField.tsx
    ├── FormField.tsx
    ├── CheckboxGrid.tsx
    ├── TagInput.tsx
    ├── DocDropZone.tsx
    ├── DocUpload.tsx
    ├── Modal.tsx
    ├── ConfirmModal.tsx
    ├── LoaderModal.tsx
    ├── Tooltip.tsx
    ├── VehicleIcon.tsx
    ├── TicketDetailSheet.tsx
    ├── DriverDetailSheet.tsx
    ├── IncidentChampionsSheet.tsx
    ├── WelfareDetailSheet.tsx
    ├── TransferRequestSheet.tsx
    ├── ContractDetailSheet.tsx
    ├── PendingRecoveryDetailSheet.tsx
    └── index.ts   # Barrel export
```

### Import Convention

Always import components from the MaxOne design system:

```tsx
import {
  PageLayout,
  AppLayout,
  Sidebar,
  TopBar,
  PageHeader,
  BackButton,
  StatusTabs,
  FilterBar,
  ExpandableSearch,
  GenericFilterPopover,
  DataTable,
  StatusBadge,
  Pagination,
  StatCard,
  TimelineEntry,
  StatusTimeline,
  DistributionChart,
  HorizontalBarChart,
  InfoCard,
  InfoGrid,
  ChampionInformation,
  VehicleOverviewCard,
  FormField,
  CheckboxGrid,
  Modal,
  ConfirmModal,
  LoaderModal,
  Tooltip,
  BatteryMap,
  BatteryListCard,
  TicketDetailSheet,
} from "@/components/max"
```

---

## Layout Components

### PageLayout

The main application shell that provides the sidebar and content card layout.

#### Import

```tsx
import { PageLayout } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Main content to render inside the content card |
| `sidebar` | `ReactNode \| ((props: SidebarRenderProps) => ReactNode)` | - | Sidebar component or render function |
| `className` | `string` | - | Additional classes for the content card |

#### SidebarRenderProps

```tsx
interface SidebarRenderProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}
```

#### Usage

```tsx
<PageLayout
  sidebar={({ isCollapsed, onToggleCollapse }) => (
    <Sidebar
      items={menuItems}
      user={currentUser}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
    />
  )}
>
  <TopBar breadcrumbs={[{ label: "Fleet" }, { label: "Vehicles" }]} />
  <PageHeader title="Vehicles" subtitle="Manage your fleet" />
  {/* Page content */}
</PageLayout>
```

#### Styling Notes

- Background: `#F0F0F0` (content-bg)
- Content card: White background with `#E7E7E7` border, 8px border radius
- Sidebar width: 240px expanded, 64px collapsed

---

### Sidebar

Collapsible navigation with tree-style nested menu items and account menu.

#### Import

```tsx
import { Sidebar, type SidebarItem, type SidebarUser } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | required | Navigation menu items |
| `user` | `SidebarUser` | - | User info for account menu |
| `logo` | `ReactNode` | MaxOne logo | Custom logo component |
| `collapsedLogo` | `ReactNode` | Collapsed MaxOne logo | Logo for collapsed state |
| `isCollapsed` | `boolean` | `false` | Whether sidebar is collapsed |
| `onToggleCollapse` | `() => void` | - | Callback for collapse toggle |
| `onItemClick` | `(item: SidebarItem) => void` | - | Callback when item is clicked |

#### SidebarItem Interface

```tsx
interface SidebarItem {
  id: string
  label: string
  icon?: LucideIcon | string  // Lucide icon or path to SVG
  href?: string
  badge?: string | number
  badgeVariant?: "default" | "notification"
  children?: SidebarItem[]
  isActive?: boolean
}
```

#### SidebarUser Interface

```tsx
interface SidebarUser {
  name: string
  role: string
  avatar?: string
}
```

#### Usage

```tsx
const menuItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/images/dashboard_menu.svg",
    href: "/dashboard",
  },
  {
    id: "fleet",
    label: "Fleet",
    icon: "/images/fleet_menu.svg",
    children: [
      { id: "vehicles", label: "Vehicles", badge: "24K", isActive: true },
      { id: "maintenance", label: "Maintenance" },
    ],
  },
  {
    id: "issues",
    label: "Issues",
    icon: "/images/issues_menu.svg",
    badge: 13,
    badgeVariant: "notification",
  },
]

<Sidebar
  items={menuItems}
  user={{ name: "John Doe", role: "Fleet Manager" }}
  isCollapsed={isCollapsed}
  onToggleCollapse={onToggleCollapse}
/>
```

#### Features

- Tree-style nested menus with connector lines
- Accordion behavior (opening one parent closes others)
- Smooth expand/collapse transitions
- Collapsible sidebar with hover-to-reveal expand button
- Account menu with avatar and shortened name display

---

### TopBar

Sticky header with breadcrumbs and global action icons.

#### Import

```tsx
import { TopBar, type Breadcrumb } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `breadcrumbs` | `Breadcrumb[]` | - | Breadcrumb navigation items |
| `actions` | `ReactNode` | - | Additional action buttons |
| `showDefaultActions` | `boolean` | `true` | Show search and notification icons |
| `className` | `string` | - | Additional classes |

#### Breadcrumb Interface

```tsx
interface Breadcrumb {
  label: string
  href?: string
}
```

#### Usage

```tsx
<TopBar
  breadcrumbs={[
    { label: "Fleet" },
    { label: "Vehicles" },
  ]}
/>
```

#### Styling Notes

- Sticky at top with z-index 10
- Padding: 14px vertical, 24px horizontal
- Divider line at bottom (#EBEBEB)
- Breadcrumb colors: Root (#888989), Parent (#121314), Current (#1855FC)

---

### PageHeader

Page title and subtitle section.

#### Import

```tsx
import { PageHeader } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Page title |
| `subtitle` | `string` | - | Page description |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<PageHeader
  title="Vehicles"
  subtitle="Keep full visibility and control over your vehicle fleet in one place."
/>
```

#### Styling Notes

- Title: 22px, font-weight 600, color #121314, with yellow dot indicator
- Subtitle: 14px, font-weight 500, color #888989
- Padding: 24px vertical, 24px horizontal

---

### AppLayout

Root application shell used by every routed page. Wraps children in `PageLayout` + `Sidebar`, applies role-simulation path guards, and mounts the global Sonner `<Toaster>` once.

#### Import

```tsx
import { AppLayout } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Page content rendered inside the content card |

#### Usage

```tsx
<AppLayout>
  <DashboardPage />
</AppLayout>
```

#### Styling Notes

- Requires `RoleSimulationContext` and React Router
- Redirects disallowed paths when role simulation is not in full-build mode
- Toaster is mounted at `position="bottom-center"` with `max-toast` class names
- Sidebar app switching is enabled only when `isFullBuild` is true

---

### BackButton

Compact chevron-left control used in modal headers and similar back-navigation contexts. `Modal` renders this automatically when `showBackButton` is true.

#### Import

```tsx
import { BackButton } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<BackButton onClick={() => setStep(step - 1)} />
```

#### Styling Notes

- 18×18 `ChevronLeft` icon on a gray (`bg-gray-50`) padded button
- Asymmetric radii: 8px on the left, 4px on the right
- `aria-label="Back"`

---

## Navigation Components

### StatusTabs

Horizontal tabs with counts for filtering data views.

#### Import

```tsx
import { StatusTabs, type StatusTab } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `StatusTab[]` | required | Tab configuration |
| `activeTab` | `string` | required | Currently active tab ID |
| `onTabChange` | `(tabId: string) => void` | required | Tab change callback |
| `className` | `string` | - | Additional classes |

#### StatusTab Interface

```tsx
interface StatusTab {
  id: string
  label: string
  count: number
}
```

#### Usage

```tsx
const tabs: StatusTab[] = [
  { id: "all", label: "All", count: 24340 },
  { id: "yard-check-in", label: "Yard Check-In", count: 4953 },
  { id: "asset-checkout", label: "Asset Checkout", count: 10450 },
]

<StatusTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### Styling Notes

- Active tab: Color #121314 with rounded underline indicator
- Inactive tabs: Color zinc-500, font-weight 500
- Smooth transition on tab switch (200ms ease-in-out)

---

## Data Display Components

### DataTable

Generic data table component using TanStack Table.

#### Import

```tsx
import { DataTable } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | required | Column definitions |
| `data` | `TData[]` | required | Table data |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `onRowClick` | `(row: TData) => void` | - | Row click callback |
| `emptyMessage` | `string` | `"No results found."` | Empty state message |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
import { type ColumnDef } from "@tanstack/react-table"

interface Vehicle {
  id: string
  assetType: string
  assetId: string
  status: string
}

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "assetType",
    header: "Asset",
    cell: ({ row }) => <span>{row.original.assetType}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge variant="success">{row.original.status}</StatusBadge>
    ),
  },
]

<DataTable
  columns={columns}
  data={vehicles}
  onRowClick={(row) => console.log(row)}
/>
```

#### Styling Notes

- Header: Background #F3F3F3, text color #555556, 13px font size, 8px border radius
- Sticky header with z-index 10
- First column padding: 16px left
- Loading state shows animated skeleton rows

---

### StatusBadge

Status indicator pill with dot and background variants.

#### Import

```tsx
import { StatusBadge } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"success" \| "danger" \| "warning" \| "info" \| "default"` | `"default"` | Badge variant |
| `children` | `ReactNode` | required | Badge text content |
| `withDot` | `boolean` | `true` | Show colored dot |
| `size` | `"sm" \| "md"` | `"sm"` | Badge size |
| `className` | `string` | - | Additional classes |

#### Variant Styles

| Variant | Dot Color | Background | Text Color | Use Case |
|---------|-----------|------------|------------|----------|
| `success` | #008356 | #EEFDF3 | #008356 | Active, Completed |
| `danger` | #DC2626 | #FFF2F1 | #DC2626 | Inactive, Error |
| `warning` | #E88E15 | rgba | #E88E15 | Pending, Check-In |
| `info` | #1855FC | rgba | #1855FC | Inbound |
| `default` | zinc-400 | zinc-100 | zinc-600 | Neutral |

#### Usage

```tsx
<StatusBadge variant="success" withDot>Active</StatusBadge>
<StatusBadge variant="danger" withDot>Inactive</StatusBadge>
<StatusBadge variant="warning">3rd Party Check-In</StatusBadge>
```

#### Styling Notes

- Padding: 8px left, 12px right, 6px top/bottom
- Font size: 13px, font-weight 500
- Rounded full (pill shape)

---

### Pagination

Table pagination with page info, page buttons, and page size selector.

#### Import

```tsx
import { Pagination } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | required | Current page number |
| `totalPages` | `number` | required | Total number of pages |
| `totalItems` | `number` | required | Total number of items |
| `pageSize` | `number` | required | Items per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Page size options |
| `onPageChange` | `(page: number) => void` | required | Page change callback |
| `onPageSizeChange` | `(size: number) => void` | - | Page size change callback |
| `itemLabel` | `string` | `"items"` | Label for items (e.g., "vehicles") |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={49}
  totalItems={20340}
  pageSize={25}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
  itemLabel="vehicles"
/>
```

#### Styling Notes

- Text: 13px font size, font-weight 500
- Active page: #121314 background, white text
- Inactive pages: White background, #121314 text
- Page button gap: 8px

---

### StatCard

Dashboard metric tile with a colored dot indicator, optional subtitle, and optional trend percentage.

#### Import

```tsx
import { StatCard } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Metric label |
| `value` | `string \| number` | required | Primary value (28px) |
| `subtitle` | `string` | - | Secondary caption |
| `trend` | `{ value: number; direction: "up" \| "down" }` | - | Trend percent and arrow |
| `indicatorColor` | `string` | required | CSS color for the 8px header dot |
| `onClick` | `() => void` | - | Makes the card a clickable surface |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<StatCard
  title="Active Vehicles"
  value={1284}
  indicatorColor="var(--color-status-success)"
  trend={{ value: 12, direction: "up" }}
  onClick={() => navigate("/vehicles")}
/>
```

#### Styling Notes

- Surface: `bg-gray-25`, `border-gray-200`, hover darkens to `border-gray-950`
- Up trend uses `text-status-success-text`; down uses `text-status-danger`

---

### TimelineEntry

Single timeline event: status badge, templated description with highlighted `{placeholders}`, and an optional actor + duration row.

#### Import

```tsx
import { TimelineEntry, type TimelineEntryData } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entry` | `TimelineEntryData` | required | Event payload |
| `className` | `string` | - | Additional classes |

#### TimelineEntryData

```tsx
interface TimelineEntryData {
  id: string
  date: string
  status: string
  statusVariant: "success" | "warning" | "info" | "danger" | "default"
  description: {
    template: string
    highlights: Record<string, string>
  }
  actor?: { action: string; name: string; avatar?: string }
  duration?: { range: string; total: string }
}
```

#### Usage

```tsx
<TimelineEntry
  entry={{
    id: "1",
    date: "8 Jun 2026",
    status: "Completed",
    statusVariant: "success",
    description: { template: "Vehicle {id} activated", highlights: { id: "MAX-001" } },
  }}
/>
```

#### Styling Notes

- `{key}` placeholders in `description.template` render in `text-sidebar-item-active`; surrounding text uses `text-breadcrumb-root`
- Actor/duration row only renders when **both** `actor` and `duration` are set

---

### StatusTimeline

Vertical timeline that groups `TimelineEntry` items by date, with a colored dot and connector line.

#### Import

```tsx
import { StatusTimeline } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `TimelineEntryData[]` | required | Events in display order |
| `className` | `string` | - | Additional classes |
| `dateColumnClassName` | `string` | `"w-28"` | Width class for the date column |

#### Usage

```tsx
<StatusTimeline entries={timelineData} dateColumnClassName="w-36" />
```

#### Styling Notes

- Dot color maps from `statusVariant` (success/warning/info/danger/default)
- Connector line min-height is 100px except on the last entry (4px)

---

## Chart Components

### DistributionChart

Donut chart card with a legend for categorical distribution data (Recharts).

#### Import

```tsx
import { DistributionChart, type DistributionDataItem } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Chart heading |
| `data` | `DistributionDataItem[]` | required | Slices (`label`, `value`, `color`) |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<DistributionChart
  title="Lagos"
  data={[
    { label: "Active", value: 420, color: "#22C55E" },
    { label: "Idle", value: 80, color: "#F59E0B" },
  ]}
/>
```

#### Styling Notes

- Chart area 185×185px, innerRadius 45, outerRadius 75
- Hover dims non-active slices to 35% opacity

---

### HorizontalBarChart

Horizontal bar chart card with hover dimming and optional stacked/legend modes.

#### Import

```tsx
import { HorizontalBarChart, type BarChartSeries } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Chart heading |
| `categories` | `string[]` | required | Y-axis labels |
| `series` | `BarChartSeries[]` | required | Named numeric series with colors |
| `showLegend` | `boolean` | `false` | Show Recharts legend |
| `stacked` | `boolean` | `false` | Stack series on a shared `stackId` |
| `className` | `string` | - | Additional classes |

#### BarChartSeries

```tsx
interface BarChartSeries {
  name: string
  data: number[]
  color: string
}
```

#### Usage

```tsx
<HorizontalBarChart
  title="Recoveries by Zone"
  categories={["North", "South"]}
  series={[{ name: "Open", data: [12, 8], color: "#3B82F6" }]}
  stacked
  showLegend
/>
```

#### Styling Notes

- Chart height 250px; Y-axis width 70
- Bar size: 16px stacked, 12px grouped; last stack segment has rounded right corners

---

## Form/Filter Components

### FilterBar

Toolbar with date picker, filters, search, and action buttons.

#### Import

```tsx
import { FilterBar, type FilterBarAction } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dateRange` | `DateRange` | - | Selected date range |
| `onDateRangeChange` | `(range: DateRange \| undefined) => void` | - | Date range change callback |
| `filters` | `FilterState` | `{}` | Active filters |
| `onFiltersChange` | `(filters: FilterState) => void` | - | Filters change callback |
| `onSearch` | `(query: string) => void` | - | Search callback |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `primaryAction` | `FilterBarAction` | - | Primary action button |
| `secondaryAction` | `FilterBarAction` | - | Secondary action button |
| `className` | `string` | - | Additional classes |
| `children` | `ReactNode` | - | Additional filter elements |

#### FilterBarAction Interface

```tsx
interface FilterBarAction {
  label: string
  onClick: () => void
  icon?: LucideIcon | string  // Lucide icon or path to SVG
  variant?: "default" | "outline"
}
```

#### Usage

```tsx
<FilterBar
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
  filters={filters}
  onFiltersChange={setFilters}
  onSearch={(query) => console.log(query)}
  secondaryAction={{
    label: "Bulk Update",
    onClick: () => {},
    icon: "/images/bulk_update.svg",
  }}
  primaryAction={{
    label: "Add Vehicles",
    onClick: () => {},
    icon: Plus,
  }}
/>
```

#### Styling Notes

- Primary button: #121314 background, white text, px-3 with icon / px-4 without
- Secondary button: White background, #3F3F46 text, outline style
- Filter count badge: #121314 background, white text, rounded-full
- Input field focus: #FCDD00 border, 2px ring at 10% opacity
- Search uses `ExpandableSearch` internally (icon button expands into a 192px input)

---

### FilterPopover

Multi-select filter dropdown with collapsible sections.

#### Import

```tsx
import { FilterPopover, type FilterState } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `FilterState` | required | Current filter state |
| `onFiltersChange` | `(filters: FilterState) => void` | required | Filter change callback |
| `className` | `string` | - | Additional classes |

#### FilterState Interface

```tsx
interface FilterState {
  championStatus: string[]   // ["Active", "Inactive"]
  contractStatus: string[]   // ["Active", "Inactive"]
  locations: string[]        // ["Ekiti", "Gbagba", ...]
}
```

#### Usage

```tsx
const [filters, setFilters] = useState<FilterState>({
  championStatus: [],
  contractStatus: [],
  locations: [],
})

<FilterPopover
  filters={filters}
  onFiltersChange={setFilters}
/>
```

#### Features

- Collapsible sections with Plus/Minus icons
- Toggle switches for multi-select
- Status options with colored dots (Active: green, Inactive: red)
- Location options without colored dots
- First section expanded by default, others collapsed

#### Styling Notes

- Section header: Font-weight 500, color #555556
- Hover background: #F6F6F6
- Smooth expand/collapse animation (200ms)

---

### ExpandableSearch

Icon button that expands into a controlled search input. Escape clears the value and closes; Enter calls `onSubmit`.

#### Import

```tsx
import { ExpandableSearch } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Whether the search input is expanded |
| `onOpenChange` | `(open: boolean) => void` | required | Called when the control opens or closes |
| `value` | `string` | required | Current query string |
| `onValueChange` | `(value: string) => void` | required | Called as the user types |
| `placeholder` | `string` | `"Search..."` | Input placeholder and `aria-label` |
| `onSubmit` | `(query: string) => void` | - | Called on Enter |
| `className` | `string` | - | Extra classes on the expanded wrapper |
| `inputClassName` | `string` | - | Extra classes on the input |

#### Usage

```tsx
const [open, setOpen] = useState(false)
const [query, setQuery] = useState("")

<ExpandableSearch
  open={open}
  onOpenChange={setOpen}
  value={query}
  onValueChange={setQuery}
  placeholder="Search vehicles..."
  onSubmit={(q) => filterRows(q)}
/>
```

#### Styling Notes

- Closed: 36×36 outline icon button (`h-9 w-9`, `bg-gray-100`)
- Open: `w-48 h-9` input plus a ghost close button

---

### GenericFilterPopover

Accordion-style multi-section filter panel with a switch per option. Use this when filter sections are data-driven; prefer `FilterPopover` for the fixed champion/contract/location set.

#### Import

```tsx
import {
  GenericFilterPopover,
  getActiveFilterCount,
  type FilterSection,
  type FilterOption,
  type GenericFilterState,
} from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `FilterSection[]` | required | Filter groups and their options |
| `filters` | `GenericFilterState` | required | Selected values keyed by section id |
| `onFiltersChange` | `(filters: GenericFilterState) => void` | required | Called when a switch toggles or Clear is clicked |
| `className` | `string` | - | Additional classes |

#### FilterSection / FilterOption

```tsx
interface FilterOption {
  value: string
  label: string
  color?: string
}

interface FilterSection {
  id: string
  title: string
  options: FilterOption[]
  defaultExpanded?: boolean
}

interface GenericFilterState {
  [key: string]: string[]
}
```

`getActiveFilterCount(filters)` returns the total number of selected values across all sections.

#### Usage

```tsx
<GenericFilterPopover
  sections={[
    {
      id: "status",
      title: "Status",
      options: [
        { value: "active", label: "Active", color: "#22C55E" },
        { value: "idle", label: "Idle", color: "#F59E0B" },
      ],
    },
  ]}
  filters={filters}
  onFiltersChange={setFilters}
/>
```

#### Styling Notes

- Fixed width `w-64`, scrollable to the popover’s available height
- Only one section is expanded at a time; first section (or `defaultExpanded`) opens by default
- Header shows “N selected” and a Clear filter action when any option is on

---

### LocationAutocomplete

Text input with a MapPin icon and a filtered dropdown of location suggestions. As the user types, matching locations appear in a popover below the input. Clicking a suggestion fills the input.

#### Import

```tsx
import { LocationAutocomplete } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Current input value |
| `onChange` | `(value: string) => void` | required | Called on input change or suggestion selection |
| `suggestions` | `string[]` | 23 Nigerian city addresses | Pool of strings to filter against |
| `placeholder` | `string` | `"Search for a location..."` | Input placeholder |
| `className` | `string` | - | Additional classes on the wrapper |

#### Usage

```tsx
<LocationAutocomplete
  value={locationDescription}
  onChange={(v) => setLocationDescription(v)}
  placeholder="Search for a location..."
/>
```

#### Features

- MapPin icon inside the input and beside each suggestion row
- Click-outside-to-close via `useRef` + `useEffect`
- Dropdown appears only when the input has a non-empty query with matches
- Default suggestions cover Lagos, Sagamu, Ibadan, Abeokuta, Sango Ota, Osogbo, and Akure

#### Styling Notes

- Input: `pl-9 h-9` to accommodate the left MapPin icon
- Dropdown: `z-20`, `max-h-48 overflow-y-auto`, white background with `shadow-md`
- Suggestion rows: `text-sm font-medium text-sidebar-item-active`, `hover:bg-gray-50`

---

### DatePickerField

Single-date picker built on the shadcn Calendar + Popover. Renders as a button showing the selected date or placeholder, opens a calendar popover on click.

#### Import

```tsx
import { DatePickerField } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | required | Currently selected date |
| `onChange` | `(date: Date \| undefined) => void` | required | Called when a date is selected |
| `placeholder` | `string` | `"Pick a date"` | Text shown when no date is selected |
| `dateFormat` | `string` | `"dd MMM yyyy"` | date-fns format string for display |
| `className` | `string` | - | Classes for the popover content |
| `triggerClassName` | `string` | - | Classes for the trigger button |

#### Usage

```tsx
<DatePickerField
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Select date"
/>
```

#### Styling Notes

- Trigger button: `h-9 w-full`, `bg-white`, CalendarIcon on the left
- Placeholder text: `text-muted-foreground`; selected date: `text-foreground`

---

### DocDropZone

Drag-and-drop file upload zone with click-to-upload fallback. Shows a different visual state when a file is selected.

#### Import

```tsx
import { DocDropZone } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File \| null` | required | Currently selected file (for single-file display) |
| `onFileSelect` | `(file: File) => void` | required | Called when a file is dropped or selected |
| `accept` | `string` | `".pdf,.doc,.docx"` | Accepted file types string |
| `maxSizeLabel` | `string` | `"PDF, DOC up to 10MB"` | Hint text shown below the upload prompt |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<DocDropZone
  file={null}
  onFileSelect={handleFileUpload}
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  maxSizeLabel="PDF, DOC, JPG, PNG up to 10MB"
/>
```

#### Styling Notes

- Default: `border-gray-300 bg-gray-50`, dashed border
- Drag over: `border-brand-primary bg-brand-primary/5`
- File selected: `border-status-success/40 bg-status-success/5`, green Upload icon and file name
- Upload icon and "click to upload" link styled with `text-status-info underline`

---

### FormField

Accessible label wrapper that injects `id`, `aria-invalid`, and `aria-describedby` into a single child control. Shows an error message (replacing the hint) when `error` is set.

#### Import

```tsx
import { FormField } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Visible field label |
| `htmlFor` | `string` | auto `useId()` | Optional explicit control id |
| `error` | `string` | - | Validation message; sets `role="alert"` |
| `hint` | `string` | - | Helper text, hidden while `error` is present |
| `children` | `ReactNode` | required | Single form control |

#### Usage

```tsx
<FormField label="Plate Number" error={errors.plate} hint="Include state prefix">
  <Input value={plate} onChange={(e) => setPlate(e.target.value)} />
</FormField>
```

#### Styling Notes

- Label: 13px, `font-medium`, `text-gray-600`
- Error: 12px, `text-status-danger`
- Hint: 12px, `text-gray-600`

---

### CheckboxGrid

Grid of bordered checkbox tiles for multi-select option sets.

#### Import

```tsx
import { CheckboxGrid, type CheckboxGridItem } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CheckboxGridItem[]` | required | Options (`id` + `label`) |
| `checked` | `Set<string>` | required | Selected item ids |
| `onToggle` | `(id: string) => void` | required | Called when a tile is clicked |
| `columns` | `1 \| 2 \| 3` | `2` | Grid column count |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<CheckboxGrid
  items={[{ id: "a", label: "Option A" }, { id: "b", label: "Option B" }]}
  checked={selected}
  onToggle={(id) => toggle(id)}
  columns={3}
/>
```

#### Styling Notes

- Unchecked: white tile, `border-gray-200`
- Checked: `border-brand-primary`, `bg-brand-primary/10`

---

## Form/Input Components

### TagInput

Multi-value text input where each entry renders as a removable pill. Users add tags by typing and pressing Enter or comma; backspace on an empty input removes the last tag.

**Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string[]` | yes | Current list of tags |
| `onChange` | `(next: string[]) => void` | yes | Called whenever the tag list changes |
| `placeholder` | `string` | no | Shown only when there are no tags |
| `className` | `string` | no | Extra classes on the outer container |
| `disabled` | `boolean` | no | Disables typing and tag removal |
| `separators` | `string[]` | no | Keys that commit the current draft. Defaults to `[",", "Enter"]`. |

Pasting or typing a comma also commits the draft, so users can paste comma-separated lists in one go.

**Usage**

```tsx
import { TagInput } from "@/components/max"

const [containers, setContainers] = useState<string[]>([])

<TagInput
  value={containers}
  onChange={setContainers}
  placeholder="Enter container number — separate with comma or Enter"
/>
```

**Notes**

- Container, input, and pill styles match the standard `Input` component (same `bg-[#F8F8F8]`, `border-input`, focus ring), so a `TagInput` drops into existing forms without tweaks.
- Use for any free-form list: container numbers, VINs, emails, tags, etc.

---

### DocUpload

The unified file-upload widget used everywhere a document/file is uploaded (Vehicle Documents, batch details, transfer detail). Renders three states: an idle drag-and-drop zone, an animated upload progress bar, and an uploaded state showing a PDF/image preview thumbnail with a hover "Replace" action. `DocDropZone` is the low-level idle dropzone primitive that `DocUpload` composes — prefer `DocUpload` in pages and modals.

**Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `uploadedFile` | `File \| null` | yes | Current file; pass `null` to start in the idle state |
| `onFileSelect` | `(file: File) => void` | yes | Called once the (simulated) upload completes |
| `accept` | `string` | no | Accepted file extensions/MIME types. Defaults to `".pdf,.doc,.docx"`. Applied to both the dropzone and the Replace input. |
| `maxSizeLabel` | `string` | no | Helper text under the idle prompt. Defaults to `"PDF, DOC up to 10MB"`. Pass `""` to hide it. |
| `label` | `string` | no | Idle prompt heading. Defaults to `"Drag and drop your document"`. |
| `icon` | `React.ReactNode` | no | Custom idle icon (e.g. an XLS template glyph). Defaults to a generic upload icon. |
| `minHeightClass` | `string` | no | Tailwind min-height class applied to every state so the box keeps a stable size (e.g. `"min-h-[280px]"`). Defaults to `"min-h-[100px]"`. |

**Usage**

```tsx
import { DocUpload } from "@/components/max"

const [file, setFile] = useState<File | null>(null)

<DocUpload
  uploadedFile={file}
  onFileSelect={setFile}
  accept=".csv"
  maxSizeLabel="CSV up to 10MB"
/>
```

**Notes**

- PDF previews are rendered via `pdfjs-dist`; image files preview directly. Other types fall back to a generic document thumbnail.
- `onFileSelect` fires after the progress animation reaches 100%, not on initial selection.

---

## Dialog Components

### Modal

Standard dialog for forms and multi-step flows. Optional back button, header/subtitle, scrollable body, and primary/secondary/left footer actions.

#### Import

```tsx
import { Modal, type ModalAction } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Whether the dialog is visible |
| `onOpenChange` | `(open: boolean) => void` | required | Called when the dialog requests open/close |
| `title` | `string` | - | Header title (16px semibold) |
| `subtitle` | `string` | - | Header subtitle (13px medium) |
| `showBackButton` | `boolean` | `false` | Renders `BackButton` in the header |
| `onBack` | `() => void` | - | Back-button click handler |
| `children` | `ReactNode` | required | Scrollable body content |
| `primaryAction` | `ModalAction` | - | Right-most brand-dark button |
| `secondaryAction` | `ModalAction` | - | Outline button to its left |
| `leftAction` | `ReactNode` | - | Slot on the left side of the footer |
| `className` | `string` | - | Classes on `DialogContent` |
| `contentClassName` | `string` | - | Classes on the body wrapper |
| `maxHeight` | `string` | - | Inline max-height on the dialog |
| `hideHeader` | `boolean` | `false` | Hide title, back, and close (used by `LoaderModal`) |

#### ModalAction

```tsx
interface ModalAction {
  label: string
  onClick: () => void
  disabled?: boolean
  icon?: boolean  // adds a Plus icon to the primary button
  className?: string
}
```

#### Usage

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Add Vehicle"
  primaryAction={{ label: "Save", onClick: handleSave }}
  secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
>
  <FormContent />
</Modal>
```

#### Styling Notes

- Built on shadcn `Dialog`
- Primary button: `h-10`, `bg-brand-dark`
- Footer only renders when any action or `leftAction` is provided
- Use `ConfirmModal` for binary confirm/cancel decisions with no form fields

---

### ConfirmModal

Centered confirmation dialog for destructive or affirmative actions (delete, archive, publish, etc.). Renders an icon, title, and subtitle stacked centrally, with primary + optional secondary action buttons in the footer.

**Props**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | yes | Whether the dialog is visible |
| `onOpenChange` | `(open: boolean) => void` | yes | Called when the dialog requests to open/close |
| `title` | `string` | yes | Heading shown below the icon (16px semibold, `text-sidebar-item-active`) |
| `subtitle` | `string` | no | Body copy below the title (13px medium, `text-breadcrumb-root`) |
| `icon` | `ComponentType<SVGProps<SVGSVGElement>>` | no | Lucide icon component, defaults to `AlertTriangle` |
| `variant` | `"destructive" \| "default" \| "warning" \| "success"` | no | Controls icon/button colors (see Variant Styles below) |
| `primaryAction` | `{ label, onClick, disabled? }` | yes | Right-most footer button (Delete / Confirm) |
| `secondaryAction` | `{ label, onClick, disabled? }` | no | Outline button to its left (typically Cancel) |
| `className` | `string` | no | Extra classes applied to the `DialogContent`. Defaults to `max-w-sm`. |

**Variant Styles**

| Variant | Icon | Icon BG | Primary Button | Use Case |
|---------|------|---------|----------------|----------|
| `destructive` | `rejected.png` image | — | `bg-status-danger` red | Delete, remove actions |
| `warning` | AlertTriangle (Lucide) | `status-warning/10` | `bg-status-warning` orange | Cancel flows, caution |
| `success` | `success_Checkmark.svg` image | — | `bg-brand-dark` dark | Completion confirmations |
| `default` | AlertTriangle (Lucide) | `status-info/10` | `bg-brand-dark` dark | Generic confirmations |

**Usage**

```tsx
import { ConfirmModal } from "@/components/max"

// Destructive variant (delete)
<ConfirmModal
  open={deleteTarget !== null}
  onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}
  variant="destructive"
  title="Delete Manufacturer"
  subtitle={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
  primaryAction={{ label: "Delete", onClick: handleDelete }}
  secondaryAction={{ label: "Cancel", onClick: () => setDeleteTarget(null) }}
/>

// Warning variant (cancel flow)
<ConfirmModal
  open={showCancelDialog}
  onOpenChange={setShowCancelDialog}
  variant="warning"
  title="Cancel ticket creation?"
  subtitle="All progress will be lost and you'll be returned to the Ticket Management page."
  primaryAction={{ label: "Yes, cancel", onClick: handleConfirmCancel }}
  secondaryAction={{ label: "Continue editing", onClick: () => setShowCancelDialog(false) }}
/>
```

**Notes**

- Use for binary confirm/cancel decisions only — for forms with inputs, use `Modal` instead
- Typography matches `Modal` (same title/subtitle styles) so the two read as part of the same family
- `destructive` and `success` variants render static images instead of the Lucide icon circle
- `warning` and `default` variants render a Lucide icon inside a tinted circle (10% opacity background)

---

### LoaderModal

Non-dismissible loading overlay with an animated spinner and message. Overlay clicks do not close it.

#### Import

```tsx
import { LoaderModal } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Whether the overlay is visible |
| `message` | `string` | `"Processing..."` | Status text under the spinner |

#### Usage

```tsx
<LoaderModal open={isSubmitting} message="Saving changes..." />
```

#### Styling Notes

- Composes `Modal` with `hideHeader` and `max-w-[280px]`
- `role="status"`, `aria-live="polite"`, `aria-busy={open}`
- Amber radial spinner (80×80)

---

## Feedback Components

### Banner

Contextual notification strip with an icon, bold title, and optional description. Used to surface status messages, approvals, or alerts inline within page content.

#### Import

```tsx
import { Banner, type BannerProps } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | required | Icon element rendered to the left of the text block (use `<img>` for SVG assets or any inline element) |
| `title` | `string` | required | Bold title text, colored by variant |
| `description` | `string` | — | Optional body text below the title, rendered in muted color |
| `variant` | `"info" \| "warning" \| "danger" \| "success"` | `"info"` | Controls background and text color |
| `className` | `string` | — | Additional classes for the wrapper |

#### Variant Styles

| Variant | Background | Border | Title color | Use case |
|---------|------------|--------|-------------|----------|
| `info` | `status-info/8%` | `status-info/20%` | `text-status-info` | Approval requests, informational notices |
| `warning` | `status-warning/8%` | `status-warning/20%` | `text-status-warning` | Near-SLA warnings, caution states |
| `danger` | `status-danger/8%` | `status-danger/20%` | `text-status-danger` | SLA breaches, blocking errors |
| `success` | `status-success/8%` | `status-success/20%` | `text-status-success` | Completion confirmations |

#### Usage

```tsx
import { Banner } from "@/components/max"

// With an SVG asset icon (tinted to match variant)
<Banner
  variant="info"
  icon={
    <img
      src="/images/duration-alt.svg"
      alt=""
      className="h-5 w-5 opacity-80"
      style={{ filter: "invert(21%) sepia(98%) saturate(2000%) hue-rotate(219deg) brightness(90%) contrast(110%)" }}
    />
  }
  title="Awaiting your approval"
  description="The Documentation Officer has completed all required steps and submitted this record. Review the checklist and document before approving or rejecting."
/>

// With a Lucide icon
import { AlertTriangle } from "lucide-react"

<Banner
  variant="danger"
  icon={<AlertTriangle className="h-5 w-5 text-status-danger" />}
  title="3 Vehicles in SLA Breach"
  description="These vehicles have exceeded their SLA threshold and require immediate action."
/>
```

#### Styling Notes

- Layout: `flex items-start gap-4` — icon is top-aligned with the text block
- Corner radius: `rounded-lg` (8px)
- Padding: `px-5 py-4`
- Title: 14px, `font-bold`, variant color
- Description: 14px, `text-muted-foreground`, `leading-relaxed`
- The icon slot accepts any `ReactNode` — use `<img>` for SVG assets in `public/images/`, or Lucide icon components

---

### Toast

Lightweight, non-modal confirmation message pinned to the top-center of the viewport. Used to acknowledge a completed action (stage advance, save, upload) without interrupting flow. Auto-dismisses after a short timeout.

#### Import

```tsx
import { Toast, useToast, type ToastProps, type ToastVariant } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string \| null` | required | Text to display. When `null`, the toast renders nothing. |
| `variant` | `"success" \| "error"` | `"success"` | Controls icon and text color |
| `className` | `string` | — | Additional classes for the wrapper |

#### Variant Styles

| Variant | Icon | Border | Text color | Use case |
|---------|------|--------|------------|----------|
| `success` | `/images/success_Checkmark.svg` | `border-border` | `text-table-text` | Action confirmations (saved, moved, uploaded) |
| `error` | `/images/rejected.png` (same illustration used by `ConfirmModal` destructive variant) | `border-status-danger/30` | `text-status-danger` | Failed actions, validation errors |

#### `useToast(durationMs?)` hook

Convenience hook that pairs with `<Toast />` and handles auto-dismiss.

| Return | Type | Description |
|--------|------|-------------|
| `message` | `string \| null` | Current toast message — pass straight into `<Toast message={...} />` |
| `variant` | `ToastVariant` | Current variant — pass straight into `<Toast variant={...} />` |
| `showToast` | `(msg: string \| null, variant?: ToastVariant) => void` | Display a message; auto-clears after `durationMs` (default `2500`). Defaults to `"success"`. |
| `showError` | `(msg: string) => void` | Shortcut for `showToast(msg, "error")` |

#### Usage

```tsx
import { Toast, useToast } from "@/components/max"

function MyPage() {
  const { message, variant, showToast, showError } = useToast()

  return (
    <>
      <Button onClick={() => showToast("Batch moved to In Transit")}>Move stage</Button>
      <Button onClick={() => showError("Failed to move batch")}>Force failure</Button>
      <Toast message={message} variant={variant} />
    </>
  )
}
```

#### Styling Notes

- Position: `fixed top-6 left-1/2 -translate-x-1/2 z-50` — anchored top-center, sits above page chrome
- Surface: `bg-content-card`, `rounded-lg`, `shadow-lg`; border color follows variant
- Padding: `px-4 py-3`
- Icon: 24×24, leading
- Message text: 14px, `font-medium`; color follows variant
- Default auto-dismiss is 2.5s — override with `useToast(durationMs)`

---

### Tooltip

Re-export of the styled Radix tooltip (`Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`) from `@/components/ui/tooltip`. Each `Tooltip` instance wraps its own provider.

#### Import

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/max"
```

#### Usage

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <button type="button" aria-label="Info">?</button>
  </TooltipTrigger>
  <TooltipContent>Primary account</TooltipContent>
</Tooltip>
```

#### Styling Notes

- Default provider `delayDuration` is 300ms
- Content: `bg-gray-950`, `max-w-xs`, 12px medium white text, includes an arrow
- Default `sideOffset` is 4

---

## Data Card Components

### InfoCard

Lightweight container card for grouped information sections. Renders a section title (uppercase, with a small blue dot) above arbitrary children.

#### Import

```tsx
import { InfoCard } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Section heading (rendered uppercase, 11px) |
| `children` | `ReactNode` | required | Card body content |
| `action` | `ReactNode` | - | Optional element rendered right-aligned on the header row, inline with the title (e.g. a "Download template sheet" link) |
| `className` | `string` | - | Additional classes on the wrapper |

#### Usage

```tsx
<InfoCard title="Selection Summary">
  <InfoGrid columns={2} items={[
    { label: "Champion", value: "Akin Bello" },
    { label: "Category", value: "Incident Safety" },
  ]} />
</InfoCard>
```

#### Styling Notes

- Background: `bg-gray-50`, border `border-gray-100`, rounded `rounded-md`, padding `p-5`
- Title: 11px uppercase, `font-semibold`, `text-sidebar-item-active`, `letter-spacing: 0.4px`
- Blue dot indicator (1.5×1.5, `bg-status-info`) to the left of the title

---

### InfoGrid

Renders a grid of label/value pairs. Supports 2, 3, or 4 columns, with an optional divider mode that adds border separators between cells.

#### Import

```tsx
import { InfoGrid } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ label: string; value: ReactNode }[]` | required | Data items to display |
| `columns` | `2 \| 3 \| 4` | `4` | Number of grid columns |
| `showDividers` | `boolean` | `false` | Show border dividers between cells |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<InfoGrid
  columns={2}
  items={[
    { label: "Champion", value: "Akin Bello" },
    { label: "Category", value: "Incident Safety" },
    { label: "Priority", value: <StatusBadge variant="danger" withDot size="sm">High</StatusBadge> },
  ]}
/>
```

#### Styling Notes

- Labels: `text-xs text-breadcrumb-root font-medium`
- Values: `font-medium text-sidebar-item-active`, 14px
- Dividers (when `showDividers`): `border-r` and `border-b` with `border-gray-100`
- Gap: `gap-4` in non-divider mode

---

### ChampionInformation

Full champion profile card showing avatar, name, risk level badge, and key details (phone, location, onboarded date, last pinged, contract status).

#### Import

```tsx
import { ChampionInformation } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Champion full name |
| `avatarUrl` | `string` | `"/images/champvatar.png"` | Avatar image URL |
| `riskLevel` | `"High Risk" \| "Medium Risk" \| "Low Risk"` | - | Risk level badge |
| `phoneNumber` | `string` | required | Phone number |
| `location` | `string` | required | Location text |
| `onboardedDate` | `string` | required | Onboarded date string |
| `lastPingedOn` | `string` | required | Last pinged date string |
| `contractStatus` | `"Early Arrears" \| "Active" \| "Inactive" \| "Defaulting"` | required | Contract status (renders as StatusBadge) |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<ChampionInformation
  name="Akin Bello"
  riskLevel="High Risk"
  phoneNumber="+234 801 234 5678"
  location="Ikeja, Lagos"
  onboardedDate="15 Jan 2024"
  lastPingedOn="28 May 2025"
  contractStatus="Active"
/>
```

#### Styling Notes

- Outer card: `bg-content-card`, `border border-border`, `rounded-lg`, padding `pt-6 pb-5 px-5`
- Inner name section: `bg-[#fcfcfc]`, `border border-[#f3f3f3]`, avatar 54×54px
- Risk level badge: High = red (`#ffecec`/`#dc2626`), Medium/Low = amber (`#fff3e0`/`#f59e0b`)
- Detail rows: 13px, `font-medium`, labels in `text-breadcrumb-root`, values in `text-sidebar-item-active`

---

### VehicleOverviewCard

Vehicle summary card with optional image, centered status badge, and label/value detail rows.

#### Import

```tsx
import { VehicleOverviewCard } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Vehicle Overview"` | Card heading |
| `subtitle` | `string` | - | Optional subheading |
| `headerRight` | `ReactNode` | - | Slot on the right of the header |
| `footer` | `ReactNode` | - | Optional footer below a divider |
| `status` | `string` | - | Centered `StatusBadge` label |
| `statusVariant` | `OverviewStatusVariant` | `"info"` | Badge variant for the header status |
| `imageUrl` | `string` | - | Vehicle image source |
| `showImage` | `boolean` | `true` | Hide the image even if `imageUrl` is set |
| `details` | `{ label, value, hint?, indicator?, isStatus?, statusVariant? }[]` | required | Detail rows |
| `className` | `string` | - | Additional classes |

`OverviewStatusVariant` is `"success" | "warning" | "info" | "danger" | "default" | "refurb"`.

#### Usage

```tsx
<VehicleOverviewCard
  title="MAX-1024"
  status="Active"
  statusVariant="success"
  imageUrl="/images/vehicle.png"
  details={[{ label: "Plate", value: "ABC-123" }]}
/>
```

#### Styling Notes

- Image height 141px
- Per-row `isStatus` uses `StatusBadge` size `sm`

---

### AssignmentHistoryCard

Paginated assignment-history viewer with prev/next navigation.

#### Import

```tsx
import { AssignmentHistoryCard, type AssignmentRecord } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assignments` | `AssignmentRecord[]` | required | History records |
| `currentIndex` | `number` | required | Visible record index |
| `onPrevious` | `() => void` | required | Previous-record handler |
| `onNext` | `() => void` | required | Next-record handler |
| `title` | `string` | `"Assignment History"` | Card heading |
| `showNavigation` | `boolean` | `true` | Hide the chevron controls |
| `className` | `string` | - | Additional classes |

#### AssignmentRecord

```tsx
interface AssignmentRecord {
  id: string
  duration: string
  assigneeName: string
  assigneeAvatar?: string
  status: "Active" | "Inactive" | "HP Complete"
  isCurrent: boolean
}
```

#### Usage

```tsx
<AssignmentHistoryCard
  assignments={records}
  currentIndex={index}
  onPrevious={() => setIndex((i) => i - 1)}
  onNext={() => setIndex((i) => i + 1)}
/>
```

#### Styling Notes

- Empty state when no record exists at `currentIndex`
- Avatar fallback: first letter, 44×44

---

### LifecycleMiniCard

Compact lifecycle-stage metric with an optional SLA indicator.

#### Import

```tsx
import { LifecycleMiniCard } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Stage name |
| `value` | `string \| number` | required | Primary count (24px) |
| `subtitle` | `string` | required | Caption under the value |
| `showSla` | `boolean` | `false` | Warning border + SLA badge |
| `titleVariant` | `"default" \| "warning"` | `"default"` | Title color |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<LifecycleMiniCard title="QC" value={42} subtitle="In queue" showSla titleVariant="warning" />
```

#### Styling Notes

- Min-width 160px
- SLA mode uses `border-status-warning` and the `/images/sla.svg` badge

---

### LifecycleFlowCard

Horizontal, scrollable row of `LifecycleMiniCard` stages connected by arrow icons.

#### Import

```tsx
import { LifecycleFlowCard, type LifecycleStage } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Lifecycle Flow"` | Card heading |
| `stages` | `LifecycleStage[]` | required | Stage metrics |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<LifecycleFlowCard
  stages={[
    { title: "Inbound", value: 12, subtitle: "Today" },
    { title: "QC", value: 5, subtitle: "Pending", showSla: true },
  ]}
/>
```

---

### FleetDistributionCard

Dashboard card that renders a 2-column grid of regional `DistributionChart`s.

#### Import

```tsx
import { FleetDistributionCard, type RegionDistribution } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Fleet Distribution"` | Card heading |
| `regions` | `RegionDistribution[]` | required | Region name + slice data |
| `className` | `string` | - | Additional classes |

#### RegionDistribution

```tsx
interface RegionDistribution {
  region: string
  data: DistributionDataItem[]
}
```

#### Usage

```tsx
<FleetDistributionCard regions={[{ region: "Lagos", data: distributionData }]} />
```

---

### ActivationQueueCard

Table card showing activation-queue counts and >48hr overdue totals.

#### Import

```tsx
import { ActivationQueueCard, type ActivationQueueItem } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Activation Queue"` | Card heading |
| `data` | `ActivationQueueItem[]` | required | Rows (`activationType`, `count`, `overdue`) |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<ActivationQueueCard
  data={[{ activationType: "New HP", count: 24, overdue: 3 }]}
/>
```

#### Styling Notes

- Overdue column uses `text-status-danger`
- Nested white table with `bg-gray-100` header

---

### ContractInformation

Animated contract-progress widget with a segmented bar (136 bars) and elapsed-day counter.

#### Import

```tsx
import { ContractInformation } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percentage` | `number` | required | Percent elapsed (0–100) |
| `totalDays` | `number` | required | Contract length in days |
| `daysElapsed` | `number` | required | Days elapsed so far |
| `startDate` | `string` | required | Start date label |
| `endDate` | `string` | required | End date label |
| `animate` | `boolean` | `true` | Count up on scroll into view |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<ContractInformation
  percentage={65}
  totalDays={365}
  daysElapsed={237}
  startDate="12 Mar 2024"
  endDate="12 Mar 2025"
/>
```

#### Styling Notes

- GSAP animation via IntersectionObserver (threshold 0.1)
- Pass `animate={false}` in sheets (e.g. `ContractDetailSheet`) to skip the count-up

---

### WalletInformation

Champion wallet card with an animated balance counter and linked bank-account tiles.

#### Import

```tsx
import { WalletInformation } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `balance` | `string` | required | Numeric balance string (commas allowed) |
| `bvn` | `string` | - | Declared on the type; not rendered |
| `bankAccounts` | `{ bankName, accountNumber, iconUrl?, isPrimary? }[]` | required | Linked accounts |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<WalletInformation
  balance="125,000"
  bankAccounts={[{ bankName: "GTBank", accountNumber: "0123456789", isPrimary: true }]}
/>
```

#### Styling Notes

- Balance animates from 0 when the card scrolls into view
- Primary account shows a star tooltip

---

### MaxIDCard

Champion MAX ID card panel with active and inactive states.

#### Import

```tsx
import { MaxIDCard, type MaxIDCardVariant } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"active" \| "inactive"` | `"active"` | Card state |
| `dateGenerated` | `string` | - | Shown when active |
| `generatedBy` | `string` | - | Shown when active |
| `onViewCard` | `() => void` | - | View action (active) |
| `onExportCard` | `() => void` | - | Export action (active) |
| `onGenerateCard` | `() => void` | - | Generate CTA (inactive) |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<MaxIDCard
  variant="active"
  dateGenerated="12 Jan 2025"
  generatedBy="Admin User"
  onViewCard={openPreview}
  onExportCard={downloadPdf}
/>
```

#### Styling Notes

- Inactive shows a “Generate ID Card” CTA; active shows View/Export
- Pattern header strip is 70px tall

---

## Map Components

### BatteryMap

Interactive map component for displaying battery locations with markers, stats overlay, and alerts panel. Built with React-Leaflet and OpenStreetMap tiles. Features a frosted glass effect on overlay panels.

#### Import

```tsx
import { BatteryMap } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locations` | `BatteryLocation[]` | required | Array of battery location data with coordinates |
| `alerts` | `BatteryAlert[]` | required | Array of alert objects to display in the alerts panel |
| `avgSOH` | `number` | required | Average State of Health percentage to display |
| `activeBatteries` | `number` | required | Count of active batteries to display |
| `className` | `string` | - | Additional classes for the wrapper |

#### BatteryLocation Interface

```tsx
interface BatteryLocation {
  id: string
  lat: number
  lng: number
  soh: number
  state: "riding" | "idle" | "checked-in" | "in-transit" | "retired" | "unknown"
}
```

#### BatteryAlert Interface

```tsx
interface BatteryAlert {
  id: string
  type: "over-temperature" | "low-soh" | "offline" | "critical"
  title: string
  description: string
  count: number
  severity: "L1" | "L2" | "L3"
}
```

#### Usage

```tsx
import { BatteryMap } from "@/components/max"
import { batteryLocations, batteryAlerts, batteryStats } from "@/data/mockBatteryData"

<BatteryMap
  locations={batteryLocations}
  alerts={batteryAlerts}
  avgSOH={batteryStats.avgSOH}
  activeBatteries={batteryStats.activeBatteries}
  className="mt-6"
/>
```

#### Features

- **Left Stats Panel** — Frosted glass card showing "Battery Map" title, AVG SOH, and Active Batteries count
- **Right Alerts Panel** — Frosted glass card at bottom-right showing alert count with navigation arrows to cycle through alerts
- **Map Markers** — Custom battery icon markers (`/images/falcon_battery.svg`) with popup showing battery ID, SOH, and state
- **Map Padding** — 8px internal padding with rounded corners

#### Styling Notes

- Outer container: `bg-gray-25`, `border border-gray-200`, `rounded-lg`, `p-2`
- Map height: 400px
- Left panel frosted glass: `background: rgba(255, 255, 255, 0.55)`, `backdrop-filter: blur(8px)`, min-width 240px
- Right panel frosted glass: Same effect, width 356px, positioned bottom-right
- Panel text sizes: Title 16px, eyebrow labels 10px uppercase, numbers 15px
- Alert divider: `#d8d8d8`
- Map tiles: OpenStreetMap
- Markers: Uses Leaflet with custom icon from `/images/falcon_battery.svg`

#### Dependencies

Requires React-Leaflet packages:

```bash
npm install leaflet react-leaflet @types/leaflet
```

Also requires importing Leaflet CSS in the component:

```tsx
import "leaflet/dist/leaflet.css"
```

---

### BatteryStatusFilterChips

Legend plus a proportional segmented bar for filtering batteries by status. Clicking the active chip clears the filter (`null`).

#### Import

```tsx
import { BatteryStatusFilterChips, type BatteryStatusChip } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chips` | `BatteryStatusChip[]` | required | Status segments (`id`, `label`, `count`, `color`) |
| `activeChipId` | `string \| null` | required | Currently selected chip, or `null` for all |
| `onChipClick` | `(chipId: string \| null) => void` | required | Toggle handler |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<BatteryStatusFilterChips
  chips={statusCounts}
  activeChipId={filter}
  onChipClick={setFilter}
/>
```

#### Styling Notes

- Segmented bar height 40px
- Count labels render only when a segment is at least 8% of the total width
- Active segment gets an inset `ring-gray-950`

---

### BatteryListCard

Expandable battery list item with status badges, an actions menu, and a detail grid.

#### Import

```tsx
import { BatteryListCard } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | required | Battery identifier |
| `status` | `BatteryStatus` | required | From `@/data/mockBatteryRegisterData` |
| `lastUpdate` | `string` | required | Last-update caption |
| `chargeLevel` | `number` | required | 0–100 charge percent |
| `isCharging` | `boolean` | `false` | Charging overlay on the battery icon |
| `isPluggedIn` | `boolean` | `false` | Plugged-in overlay on the battery icon |
| `isSelected` | `boolean` | `false` | Selected border (`border-gray-950`) |
| `isExpanded` | `boolean` | `false` | Show the detail grid |
| `simNumber` | `string` | required | SIM number |
| `assignmentStatus` | `AssignmentStatus` | required | assigned / unassigned / maintenance |
| `assignedTo` | `string \| null` | required | Assignee name |
| `currentLocation` | `string` | required | Location label |
| `batteryModel` | `string` | required | Model label |
| `lastReportedTime` | `string` | required | Last reported time |
| `lastSwapTime` | `string` | required | Last swap time |
| `onClick` | `() => void` | - | Card click |
| `onExpandClick` | `() => void` | - | Expand chevron click |
| `onMenuItemClick` | `(action: string) => void` | - | Overflow-menu action id |
| `onViewFullInfo` | `() => void` | - | “View full info” in the expanded grid |
| `className` | `string` | - | Additional classes |

Menu action ids: `"telemetry" | "alert-history" | "movement-history" | "command-center"`.

#### Usage

```tsx
<BatteryListCard
  id="BAT-001"
  status="riding"
  chargeLevel={78}
  lastUpdate="2 min ago"
  simNumber="08012345678"
  assignmentStatus="assigned"
  assignedTo="Champ A"
  currentLocation="Lagos"
  batteryModel="LG-48V"
  lastReportedTime="10:30"
  lastSwapTime="Yesterday"
  isExpanded={expanded}
  onExpandClick={() => setExpanded(!expanded)}
/>
```

#### Styling Notes

- Expand animation via `motion/react`
- Uses `BatteryLevelIcon` for the charge glyph

---

### BatteryLevelIcon

SVG battery glyph with charge fill, charging bolt, or plugged-not-charging X overlay.

#### Import

```tsx
import { BatteryLevelIcon } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chargeLevel` | `number` | required | 0–100 fill percent |
| `isCharging` | `boolean` | `false` | Show lightning bolt |
| `isPluggedIn` | `boolean` | `false` | Show red X when not charging |
| `tooltip` | `string` | `` `Battery: ${chargeLevel}%` `` | Tooltip content |
| `className` | `string` | - | Additional classes |

#### Usage

```tsx
<BatteryLevelIcon chargeLevel={35} isCharging={false} isPluggedIn />
```

#### Styling Notes

- Fill colors: ≥50 success, ≥20 warning, else danger
- Size `h-4 w-6`

---

## Sheet Components

### TicketDetailSheet

Full-height side sheet for viewing ticket details. Structured as a sticky header, scrollable body with multiple InfoCard sections, and a sticky footer with action buttons.

#### Import

```tsx
import { TicketDetailSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ticket` | `TicketDetail \| null` | required | Ticket data (renders nothing if null) |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Called when the sheet requests closing |

#### Sections

1. **Header** — Ticket ID, status/priority/SLA badges, category and creation date
2. **Incident Details** — InfoGrid with location, reporter, dates, vehicle plate, creator comment, file attachments with type-specific icons
3. **Call Recordings** — Placeholder section
4. **Champion Details** — Name and ID with "View Champion" link button
5. **Assigned Agent** — Agent name and department with "View Agent" link button
6. **Vehicle Details** — Full vehicle info grid (ID, plate, type, model, brand, status, location, utilization)
7. **Contract Details** — Contract ID, type, dates, status
8. **SLA Tracking** — StatusTimeline component
9. **Footer** — Assign/Reassign, Escalate, Close Ticket buttons

#### Attachment Icons

File-type icons are mapped by extension:

| Extension | Icon | Color |
|-----------|------|-------|
| jpg, jpeg, png | `Image` | `text-status-warning` (yellow) |
| pdf | `FileText` | `text-status-danger` (red) |
| doc, docx | `FileText` | `text-status-info` (blue) |
| xls, xlsx, csv | `FileSpreadsheet` | `text-badge-active-text` (green) |
| Other | `File` | `text-breadcrumb-root` (gray) |

#### Styling Notes

- Maximum width: `max-w-[40vw]` (40% of viewport)
- Body: `overflow-y-auto`, `space-y-5` between sections
- Footer: Sticky, three action buttons (outline, warning-outline, destructive)

---

### DriverDetailSheet

Side sheet showing a driver safety profile, score breakdown, and activity summary.

#### Import

```tsx
import { DriverDetailSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `driver` | `DriverRiskRecord \| null` | required | From `@/data/mockDriverSafety`; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |

#### Usage

```tsx
<DriverDetailSheet driver={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
```

#### Styling Notes

- Sheet size `lg`, `max-w-[40vw]`
- Score color thresholds: 80+ / 60+

---

### IncidentChampionsSheet

Sheet listing champions that share a specific critical-incident type.

#### Import

```tsx
import { IncidentChampionsSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `incident` | `CriticalEventCategory \| null` | required | From `@/data/mockDriverSafety`; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |

#### Usage

```tsx
<IncidentChampionsSheet incident={incident} isOpen={open} onClose={() => setOpen(false)} />
```

#### Styling Notes

- Filters `mockDriverRiskRecords` by `recentIncident === incident.name`
- Empty state when no matches

---

### WelfareDetailSheet

Welfare champion detail sheet with profile, risk flags, interaction timeline, and footer CTAs.

#### Import

```tsx
import { WelfareDetailSheet, type WelfareChampion } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `champion` | `WelfareChampion \| null` | required | Champion payload; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |
| `onLogNote` | `(champion: WelfareChampion) => void` | - | Footer “Log Note” callback |

#### WelfareChampion

```tsx
interface WelfareChampion {
  id: string
  name: string
  championId: string
  avatarUrl: string
  location: string
  vehicle: string
  welfareStatus: "Healthy" | "Needs Attention" | "At Risk" | "Critical"
  championState: "Active" | "Inactive" | "On Leave" | "Suspended"
  lastContact: string
  nextFollowUp: string
  issuesLogged: number
  phoneNumber: string
  transferRejection?: {
    date: string
    ownershipType: string
    rejectionReason: string
  }
}
```

#### Usage

```tsx
<WelfareDetailSheet
  champion={champ}
  isOpen={open}
  onClose={() => setOpen(false)}
  onLogNote={(c) => openLogModal(c)}
/>
```

#### Styling Notes

- Timeline data comes from an internal mock map keyed by champion id
- Footer: Call / Schedule / Log Note

---

### TransferRequestSheet

Ownership-transfer review sheet with approve/reject flows, contract preview, and confirmation dialogs.

#### Import

```tsx
import { TransferRequestSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `transfer` | `MarkedTransferRecord \| null` | required | From `@/data/mockMarkedTransfers`; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |
| `onStatusChange` | `(id: string, status: MarkedTransferRecord["status"], rejectionReason?: string) => void` | - | Called after approve or reject |

#### Usage

```tsx
<TransferRequestSheet
  transfer={record}
  isOpen={open}
  onClose={() => setOpen(false)}
  onStatusChange={(id, status, reason) => updateTransfer(id, status, reason)}
/>
```

#### Styling Notes

- Pending transfers require a confirmation checkbox before Approve
- Reject requires a reason textarea
- Uses Sonner toasts for success/error

---

### ContractDetailSheet

Portfolio contract detail sheet with progress, accordion sections, amortisation schedule, and workflow actions.

#### Import

```tsx
import { ContractDetailSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contract` | `Contract \| null` | required | From `@/data/mockContracts`; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |
| `onUpdate` | `(id: string, updates: Partial<Contract>) => void` | - | Called after workflow actions |

#### Usage

```tsx
<ContractDetailSheet
  contract={contract}
  isOpen={open}
  onClose={() => setOpen(false)}
  onUpdate={(id, updates) => patchContract(id, updates)}
/>
```

#### Styling Notes

- Accordion sections: details / payment / asset / schedule (one open at a time)
- Footer actions depend on status: Approve, Dispute, Resolve, Mark to Market
- “See Champion Profile” navigates to the champion page
- Uses `ContractInformation` with `animate={false}`

---

### PendingRecoveryDetailSheet

Recovery-case detail sheet with an assign/reassign recovery-pair dialog.

#### Import

```tsx
import { PendingRecoveryDetailSheet } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `recovery` | `PendingRecovery \| null` | required | From `@/data/mockRecoveries`; renders nothing if null |
| `isOpen` | `boolean` | required | Whether the sheet is visible |
| `onClose` | `() => void` | required | Close handler |
| `onAssignPair` | `(recoveryId: string, pairId: string) => void` | required | Called when a recovery pair is assigned |

#### Usage

```tsx
<PendingRecoveryDetailSheet
  recovery={recoveryCase}
  isOpen={open}
  onClose={() => setOpen(false)}
  onAssignPair={(recoveryId, pairId) => assign(recoveryId, pairId)}
/>
```

#### Styling Notes

- Sheet `max-w-[36vw]`
- Assign dialog lists active pairs from `mockRecoveryPairs`

---

## Icon Components

### VehicleIcon

Renders a 2/3/4-wheeler icon from an asset-type string. Also exports `getVehicleIcon(assetType)` which returns the SVG path.

#### Import

```tsx
import { VehicleIcon, getVehicleIcon } from "@/components/max"
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assetType` | `string` | required | Matched on `"2"`, `"3"`, or `"4"`; otherwise 2-wheeler |

#### Usage

```tsx
<VehicleIcon assetType="3 Wheeler" />
<img src={getVehicleIcon("4 Wheeler")} alt="" />
```

#### Styling Notes

- Container 32×32 rounded `bg-muted`; icon 20×20
- Paths: `/images/2_wheeler.svg`, `/images/3_wheeler.svg`, `/images/4_wheeler.svg`

---

## Page Patterns

### Create Ticket Wizard

A full-page, 4-step wizard at `/ticket-management/create` for creating support tickets. Uses `useReducer` for state management with a discriminated union action type.

#### Route

```
/ticket-management/create → CreateTicketPage
```

#### File Structure

```
src/pages/
├── CreateTicketPage.tsx           # Barrel re-export
└── create-ticket/
    ├── types.ts                   # WizardState, WizardAction, TicketCategory, etc.
    ├── CreateTicketPage.tsx        # Orchestrator with useReducer
    ├── StepIndicator.tsx           # Horizontal 4-step progress bar
    ├── WizardFooter.tsx            # Cancel / Back / Next / Submit buttons
    ├── StepSelectChampion.tsx      # Step 1: Search and select a champion
    ├── StepSelectCategory.tsx      # Step 2: Grid of 12 category cards
    ├── StepSelectSubcategory.tsx   # Step 3: List of subcategories
    └── StepTicketDetails.tsx       # Step 4: Form + summary sidebar

src/data/
└── mockTicketCategories.ts        # 12 categories, ~30 subcategories
```

#### Wizard Steps

| Step | Component | Validation Rule |
|------|-----------|-----------------|
| 1 | `StepSelectChampion` | Champion must be selected |
| 2 | `StepSelectCategory` | Category must be selected |
| 3 | `StepSelectSubcategory` | Subcategory must be selected |
| 4 | `StepTicketDetails` | Platform, reporter, priority, city, date, and incident description all non-empty |

#### State Management

The wizard uses a `useReducer` with `WizardState` and `WizardAction` (discriminated union):

```tsx
type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_CHAMPION_SEARCH"; query: string }
  | { type: "SELECT_CHAMPION"; champion: ChampionDetails }
  | { type: "CLEAR_CHAMPION" }
  | { type: "SET_CATEGORY_SEARCH"; query: string }
  | { type: "SELECT_CATEGORY"; category: TicketCategory }
  | { type: "SELECT_SUBCATEGORY"; subcategory: TicketSubcategory }
  | { type: "UPDATE_DETAILS"; field: keyof TicketDetailsForm; value: ... }
  | { type: "ADD_ATTACHMENT"; file: File }
  | { type: "REMOVE_ATTACHMENT"; index: number }
  | { type: "RESET" }
```

Key transitions:
- `SELECT_CATEGORY` resets `selectedSubcategory` to null
- `SELECT_SUBCATEGORY` pre-fills `details.priority` from the subcategory's `priorityLevel`

#### StepIndicator

Horizontal progress bar with 4 numbered circles connected by lines.

| State | Circle | Line |
|-------|--------|------|
| Completed | `bg-brand-primary/10`, dark check icon (`h-3 w-3`) | `bg-gray-300` |
| Active | `bg-brand-dark text-white` | `bg-gray-200` |
| Pending | `bg-gray-100 text-breadcrumb-root` | `bg-gray-200` |

Circle size: `h-6 w-6`, font `text-xs`.

#### WizardFooter

| Position | Button | Condition |
|----------|--------|-----------|
| Left | Cancel (outline) | Always visible |
| Right | Back (outline) | Visible when step > 1 |
| Right | Next (brand-dark) | Steps 1–3, disabled when validation fails |
| Right | Submit Ticket (brand-dark) | Step 4 only, shows `Loader2` spinner when submitting |

#### Step 4: Ticket Details Layout

Two-column layout (`grid grid-cols-5 gap-6`):

**Left column (col-span-3):**
- Ticket Information — Platform (Select), Reporter (Input), Priority (Select, pre-filled), City (Select)
- Incident Details — LocationAutocomplete, Date (DatePickerField), Time (Input), Incident Description (Textarea rows=8)
- Attachments — DocDropZone + file list with type-specific icons and remove buttons

**Right column (col-span-2):**
- Champion card — Avatar, name, risk level badge, phone number, contract status
- Selection Summary — InfoCard with InfoGrid showing Champion, Category, Subcategory, Concerned Team, SLA, Priority
- Ticket Script Preview — InfoCard with dynamic sentence: "Champion {name} reported a {subcategory} issue via {platform} at {location} on {date}. {description}"

#### Behaviors

- **Cancel** shows a `ConfirmModal` (variant `"warning"`) before navigating back
- **Submit** sets `isSubmitting` state, shows loading spinner, then fires a `sonner` toast and navigates to `/ticket-management`
- **Back** preserves all selections from previous steps
- Content container: `max-w-3xl mx-auto`

#### Mock Data

`src/data/mockTicketCategories.ts` exports:

- `ticketCategories: TicketCategory[]` — 12 categories (Incident Safety, Phone Number Update, Documentation, Portfolio, Telematics, Prospect, Fleet, Reverification, Leave Request, Others, Reactivation, HMO/Insurance) each with a Lucide icon name string and subcategory count
- `ticketSubcategories: TicketSubcategory[]` — ~30 subcategories with `categoryId`, `concernedTeam`, `slaTime`, `priorityLevel`
- `getSubcategoriesByCategoryId(categoryId: string): TicketSubcategory[]`

---

## Toast Notifications

The application uses **sonner** for toast notifications. The `<Toaster>` component is mounted once in `AppLayout`.

#### Setup

```tsx
// In src/components/max/AppLayout.tsx
import { Toaster } from "sonner"

<Toaster position="top-right" richColors />
```

#### Usage

```tsx
import { toast } from "sonner"

toast.success("Ticket created successfully", {
  description: `Ticket for ${championName} has been submitted.`,
})
```

---

## Color Tokens

The design system uses custom Tailwind color tokens defined in `src/index.css`:

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | #FCDD00 | Yellow accents, active indicators |
| `brand-dark` | #121314 | Primary buttons, active text |

### Sidebar Colors

| Token | Value | Usage |
|-------|-------|-------|
| `sidebar-hover` | #EAEAEA | Hover background |
| `sidebar-active` | #E8E8E8 | Active item background |
| `sidebar-label` | #ABABAD | Menu section label |
| `sidebar-item` | #555556 | Menu item text |
| `sidebar-item-active` | #121314 | Active item text |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `badge-active-text` | #008356 | Success/Active text |
| `badge-active-bg` | #EEFDF3 | Success/Active background |
| `badge-inactive-text` | #DC2626 | Danger/Inactive text |
| `badge-inactive-bg` | #FFF2F1 | Danger/Inactive background |
| `status-warning` | #E88E15 | Warning status |
| `status-info` | #1855FC | Info status |

### Content Colors

| Token | Value | Usage |
|-------|-------|-------|
| `content-bg` | #F0F0F0 | App background |
| `content-card` | #FFFFFF | Content card background |
| `content-card-border` | #E7E7E7 | Content card border |
| `divider` | #EBEBEB | Divider lines |

### Table Colors

| Token | Value | Usage |
|-------|-------|-------|
| `table-border` | #F3F3F3 | Table container border |
| `table-header-bg` | #F3F3F3 | Table header background |
| `table-header-text` | #555556 | Table header text |
| `table-text` | #595A5B | Table cell text |
| `table-text-primary` | #121314 | Primary cell text |
| `table-text-warning` | #F59E0B | Warning cell text |

---

## Changelog

| Date | Component | Change |
|------|-----------|--------|
| 2026-08-26 | All undocumented max/ components | Documented AppLayout, BackButton, ExpandableSearch, GenericFilterPopover, FormField, CheckboxGrid, Modal, LoaderModal, Tooltip, StatCard, TimelineEntry, StatusTimeline, DistributionChart, HorizontalBarChart, VehicleOverviewCard, AssignmentHistoryCard, LifecycleMiniCard, LifecycleFlowCard, FleetDistributionCard, ActivationQueueCard, ContractInformation, WalletInformation, MaxIDCard, BatteryStatusFilterChips, BatteryListCard, BatteryLevelIcon, DriverDetailSheet, IncidentChampionsSheet, WelfareDetailSheet, TransferRequestSheet, ContractDetailSheet, PendingRecoveryDetailSheet, VehicleIcon |
| 2026-07-30 | BatteryMap | New reusable map component with React-Leaflet, frosted glass overlay panels, battery markers, and alerts carousel |
| 2026-06-01 | Create Ticket Wizard | Added 4-step wizard page at `/ticket-management/create` with champion search, category grid, subcategory list, and ticket details form |
| 2026-06-01 | LocationAutocomplete | New reusable component — map-style text field with dropdown location suggestions |
| 2026-06-01 | ConfirmModal | Added `warning` and `success` variants with distinct icon/button styles |
| 2026-06-01 | TicketDetailSheet | Reduced max width to 40vw; added file-type icons (Image, FileText, FileSpreadsheet) to attachment tags |
| 2026-06-01 | AppLayout | Integrated `sonner` Toaster for app-wide toast notifications |
| 2026-06-01 | InfoCard, InfoGrid, ChampionInformation | Documented existing components |
| 2026-06-01 | DatePickerField, DocDropZone | Documented existing components |
| 2026-06-01 | mockTicketCategories | New mock data file — 12 categories, ~30 subcategories with team/SLA/priority metadata |
| 2026-06-01 | mockTicketDetail | Widened attachment type to `string`; added docx and xlsx file samples |
| 2026-03-07 | All | Initial documentation created |
| 2026-05-28 | Toast | Promoted inline batch-details toast into a reusable `Toast` component + `useToast` hook |
| 2026-05-28 | Toast | Added `error` variant + `showError` hook shortcut |
| 2026-07-27 | InfoCard | Added optional right-aligned `action` header slot; used for the transfer "Download template sheet" link |
