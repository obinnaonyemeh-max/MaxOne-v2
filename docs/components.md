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
    ├── StatusTabs.tsx
    ├── FilterBar.tsx
    ├── FilterPopover.tsx
    ├── DataTable.tsx
    ├── StatusBadge.tsx
    ├── Pagination.tsx
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
  StatusTabs,
  FilterBar,
  DataTable,
  StatusBadge,
  Pagination,
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
| 2026-03-07 | All | Initial documentation created |
