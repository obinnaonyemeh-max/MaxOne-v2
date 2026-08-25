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
- [Navigation Components](#navigation-components)
  - [StatusTabs](#statustabs)
- [Data Display Components](#data-display-components)
  - [DataTable](#datatable)
  - [StatusBadge](#statusbadge)
  - [Pagination](#pagination)
- [Form/Filter Components](#formfilter-components)
  - [FilterBar](#filterbar)
  - [FilterPopover](#filterpopover)
  - [LocationAutocomplete](#locationautocomplete)
  - [DatePickerField](#datepickerfield)
  - [DocDropZone](#docdropzone)
- [Feedback Components](#feedback-components)
  - [Banner](#banner)
  - [Toast](#toast)
- [Data Card Components](#data-card-components)
  - [InfoCard](#infocard)
  - [InfoGrid](#infogrid)
  - [ChampionInformation](#championinformation)
- [Map Components](#map-components)
  - [BatteryMap](#batterymap)
- [Sheet Components](#sheet-components)
  - [TicketDetailSheet](#ticketdetailsheet)
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
    ├── Sidebar.tsx
    ├── TopBar.tsx
    ├── PageHeader.tsx
    ├── BackButton.tsx
    ├── StatusTabs.tsx
    ├── FilterBar.tsx
    ├── FilterPopover.tsx
    ├── DataTable.tsx
    ├── StatusBadge.tsx
    ├── Pagination.tsx
    ├── InfoCard.tsx
    ├── InfoGrid.tsx
    ├── ChampionInformation.tsx
    ├── BatteryMap.tsx
    ├── LocationAutocomplete.tsx
    ├── DatePickerField.tsx
    ├── DocDropZone.tsx
    ├── ConfirmModal.tsx
    ├── TicketDetailSheet.tsx
    └── index.ts   # Barrel export
```

### Import Convention

Always import components from the MaxOne design system:

```tsx
import {
  PageLayout,
  Sidebar,
  TopBar,
  PageHeader,
  BackButton,
  StatusTabs,
  FilterBar,
  DataTable,
  StatusBadge,
  Pagination,
  InfoCard,
  InfoGrid,
  ChampionInformation,
  BatteryMap,
  LocationAutocomplete,
  DatePickerField,
  DocDropZone,
  ConfirmModal,
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
