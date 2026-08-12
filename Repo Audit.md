# MaxOne-v2 Frontend Architecture Audit

## 1. Component Inventory & Catalog

### Directory Structure

```
src/
├── components/
│   ├── ui/                  # 13 base UI primitives (shadcn/Radix)
│   └── max/                 # 36 feature components (MaxOne-specific)
│       └── index.ts         # Barrel export
├── pages/                   # 22 page/route components
│   ├── activation-readiness/    # 8 feature sub-components
│   ├── asset-movement/          # 6 feature sub-components
│   ├── batch-details/           # 8 feature sub-components
│   ├── stock-setup/             # 6 feature sub-components
│   ├── transfer-detail/         # 7 feature sub-components
│   └── vehicles/                # 5 feature sub-components
├── data/                    # Static config (sidebar, mock data)
├── lib/
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
└── assets/                  # Static assets
```

### Base UI Primitives (`src/components/ui/`)

These are **shadcn/ui** components built on **Radix UI** with **Tailwind CSS** styling and **CVA** for variants.

| Component | Technology | Key Variants / Props |
|-----------|-----------|---------------------|
| **Button** | Radix + CVA | `variant`: default, destructive, outline, secondary, ghost, link. `size`: xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg |
| **Badge** | Radix + CVA | `variant`: default, secondary, destructive, outline, ghost, link |
| **Tabs** | Radix + CVA | `variant`: default, line. `orientation`: horizontal, vertical |
| **Dialog** | Radix | Compound: Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription |
| **Select** | Radix + Lucide | `size`: sm, default. `position`: popper, item-aligned. Compound with SelectGroup, SelectItem, etc. |
| **Popover** | Radix | `align`, `side`, `sideOffset`. Compound: PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle |
| **Calendar** | react-day-picker + Lucide | `mode`: single/range. `showOutsideDays`, `captionLayout` |
| **Tooltip** | Radix | `delayDuration`, `sideOffset`. Compound: TooltipTrigger, TooltipContent, TooltipProvider |
| **Switch** | @radix-ui/react-switch | Checked state toggle |
| **Input** | HTML wrapper | Standard text input with focus styling |
| **Textarea** | HTML wrapper | Standard textarea with focus styling |
| **Table** | HTML wrapper | Compound: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption |
| **Separator** | Radix | `orientation`: horizontal, vertical |

### Feature Components (`src/components/max/`)

#### Layout & Navigation

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **AppLayout** | Root app wrapper; handles app switching between Fleet Operations & Driver Growth | react-router-dom, Sidebar, PageLayout |
| **PageLayout** | Content frame with optional collapsible sidebar + main content card | -- |
| **Sidebar** | Multi-level collapsible nav with sections, items, tree-view children, account menu | Lucide, AppSwitcher |
| **AppSwitcher** | Multi-app dropdown (Fleet Ops, Driver Growth, Portfolio, Driver Experience) | Lucide, Popover (ui) |
| **TopBar** | Breadcrumb navigation + search/notification actions | -- |
| **PageHeader** | Page title with dot indicator + optional subtitle | -- |
| **BackButton** | Chevron back navigation | Lucide |
| **StatusTabs** | Horizontal tab bar with count badges per tab | -- |

#### Data Display

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **DataTable** | Reusable table with column defs, loading states, row click | @tanstack/react-table |
| **Pagination** | Page selector with page-size dropdown + items display | Button, Select (ui) |
| **StatCard** | Dashboard metric card with value, trend arrow (up/down), indicator color | -- |
| **StatusBadge** | Status pill with variants: success, danger, warning, info, refurb, neutral; optional dot | -- |
| **InfoCard** | Simple titled content card | -- |
| **InfoGrid** | Grid layout (2/3/4 columns) with optional dividers | -- |
| **VehicleOverviewCard** | Vehicle card with image, status badge, detail fields | StatusBadge |
| **AssignmentHistoryCard** | Assignment history with navigation arrows + avatar + status | StatusBadge, Lucide |

#### Charts & Visualization

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **DistributionChart** | Pie chart with legend | Recharts |
| **HorizontalBarChart** | Stacked/grouped horizontal bar chart | Recharts |
| **FleetDistributionCard** | Regional fleet distribution with multiple pie charts | DistributionChart |
| **LifecycleFlowCard** | Flow visualization with stages connected by arrows | LifecycleMiniCard |
| **LifecycleMiniCard** | Mini stage card with SLA indicator | -- |
| **ActivationQueueCard** | Queue display with count & overdue tracking | -- |

#### Timeline

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **StatusTimeline** | Vertical timeline grouped by date | TimelineEntry |
| **TimelineEntry** | Single timeline entry with status, description, actor, duration | StatusBadge, Lucide |

#### Forms & Filters

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **FilterBar** | Search + date range + filter button + action buttons toolbar | Calendar, Input (ui), FilterPopover, Lucide |
| **FilterPopover** | Expandable filter sections with Switch toggles | Switch (ui), Lucide |
| **GenericFilterPopover** | Reusable dynamic filter popover with configurable sections | Switch (ui), Lucide |
| **DatePickerField** | Date input with popover calendar | Popover, Calendar (ui), date-fns, Lucide |
| **TagInput** | Comma-separated tag entry with removable chips | Lucide |
| **CheckboxGrid** | Multi-column checkbox grid (1/2/3 cols) | -- |
| **DocDropZone** | Drag-and-drop file upload zone | Lucide |

#### Modals & Feedback

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| **Modal** | Flexible modal with header, body, multi-action footer (primary/secondary/left) | Dialog, Button (ui), BackButton |
| **ConfirmModal** | Confirmation dialog with variants + icon support | Dialog, Button (ui), Lucide |
| **LoaderModal** | Spinner modal with message | Modal |
| **Banner** | Alert banner with variants: info, warning, danger, success | Lucide |
| **Tooltip** *(re-export)* | Re-exports `ui/tooltip` for convenience | ui/tooltip |

### Unused / Dead Components

All 36 max components and 13 UI components are currently imported and used. However, one **dependency is unused**:

| Item | Type | Notes |
|------|------|-------|
| **`motion`** (v12.35.2) | npm dependency | Listed in `package.json` but **zero imports** found anywhere in `src/`. This animation library is installed but not used by any component. |

---

## 2. Design System Architecture & Component Flow

### Design Tokens & Variables

All design tokens are centralized in a single file: **`src/index.css`** using **Tailwind CSS v4**'s native `@theme` block (no separate `tailwind.config.js`).

#### Token Hierarchy (3 Layers)

**Layer 1 -- Primitive Palette**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gray-25` | `#FDFDFD` | Lightest background |
| `--color-gray-50` | `#FAFAFA` | Subtle backgrounds |
| `--color-gray-100` | `#F3F3F3` | Muted/secondary fills |
| `--color-gray-200` | `#EAEAEA` | Borders, dividers |
| `--color-gray-300` | `#D4D4D4` | Disabled states |
| `--color-gray-400` | `#A3A3A3` | Placeholder text |
| `--color-gray-500` | `#737373` | Muted foreground |
| `--color-gray-600` | `#555556` | Secondary text |
| `--color-gray-700` | `#404040` | -- |
| `--color-gray-800` | `#262626` | -- |
| `--color-gray-900` | `#171717` | -- |
| `--color-gray-950` | `#121314` | Primary foreground |
| `--color-brand-primary` | `#FCDD00` | Brand yellow |
| `--color-brand-primary-soft` | `#FAF3C7` | Soft yellow |
| `--color-brand-dark` | `#121314` | Brand dark |
| `--color-success` | `#16B04F` | Green |
| `--color-warning` | `#E88E15` | Orange |
| `--color-danger` | `#DC2626` | Red |
| `--color-info` | `#1855FC` | Blue |

**Layer 2 -- Semantic Tokens** (shadcn-compatible)

| Token | Resolves To |
|-------|------------|
| `--color-background` | `#FFFFFF` |
| `--color-foreground` | `gray-950` |
| `--color-primary` / `-foreground` | `gray-950` / `gray-50` |
| `--color-secondary` / `-foreground` | `gray-100` / `gray-950` |
| `--color-muted` / `-foreground` | `gray-100` / `gray-500` |
| `--color-accent` / `-foreground` | `gray-100` / `gray-950` |
| `--color-destructive` / `-foreground` | `danger` / `gray-50` |
| `--color-border` | `gray-200` |
| `--color-input` | `gray-50` |
| `--color-ring` | `gray-950` |

**Layer 3 -- Component Tokens**

| Group | Tokens |
|-------|--------|
| **Sidebar** | `sidebar`, `sidebar-hover`, `sidebar-active`, `sidebar-border`, `sidebar-label`, `sidebar-item`, `sidebar-item-active`, `sidebar-user-role` |
| **Status** | `status-success`, `status-danger`, `status-warning`, `status-info`, `status-closed` (`#6F2191`), `status-outright-sales` (`#7BB924`), `status-purple`, `status-cyan`, `status-amber`, `success-bright`, `status-pink-text`/`-bg` |
| **Badge** | `badge-active-text` (`#008356`), `badge-active-bg` (`#EEFDF3`), `badge-inactive-text`, `badge-inactive-bg` (`#FFF2F1`) |
| **Content** | `content-bg`, `content-card`, `content-card-border` |
| **Breadcrumb** | `breadcrumb-root`, `breadcrumb-separator`, `breadcrumb-parent`, `breadcrumb-current` |
| **Table** | `table-border`, `table-header-bg`, `table-header-text`, `table-text`, `table-text-primary`, `table-text-warning`, `pagination-text` |
| **Input** | `input-soft` (`#F8F8F8`) |
| **Divider** | `divider` |

**Radius Tokens:** `sm` (4px), `md` (6px), `lg` (8px), `xl` (12px)

**Typography:** Font family is `Satoshi` with system-ui fallback. No custom font-size scale is defined (uses Tailwind defaults).

**Base Styles** (`@layer base`): Global border color set to `--color-border`, body gets `background`, `foreground`, font-family, and anti-aliasing.

#### Supporting Configuration

| File | Role |
|------|------|
| `components.json` | shadcn/ui config: `new-york` style, `neutral` base color, CSS variables enabled, Lucide icons, aliases for `@/components`, `@/lib`, `@/hooks` |
| `vite.config.ts` | `@vitejs/plugin-react` + `@tailwindcss/vite` plugin, `@` path alias to `./src` |
| `src/lib/utils.ts` | `cn()` utility combining `clsx` + `twMerge` for class merging |

No PostCSS config file, no CSS-in-JS, no separate `tailwind.config` file. No dark mode implementation (the token layer supports it but no variable overrides exist).

### Design Flow & Layouts

#### Application Shell

```
main.tsx
└── <BrowserRouter>
    └── App.tsx
        └── <Routes>
            └── <AppLayout>           # Sidebar + PageLayout wrapper
                ├── Sidebar            # Left nav (collapsible: 64px <-> 240px)
                │   ├── Logo
                │   ├── AppSwitcher    # Fleet Ops / Driver Growth / Portfolio / Driver Experience
                │   ├── SidebarSections (collapsible groups)
                │   │   └── SidebarNavItems (with optional tree children)
                │   └── AccountMenu
                └── PageLayout         # Right content area
                    └── <main>
                        └── Content Card (rounded-lg, border, bg-content-card)
                            └── [Page Component]
```

#### Typical Page Structure

```
[Page Component]
├── TopBar              # Breadcrumbs + search + notifications
├── PageHeader          # Title with brand dot + subtitle
├── StatusTabs          # Tab filtering (optional)
├── FilterBar           # Search + date range + filters + actions (optional)
│   └── GenericFilterPopover / FilterPopover
├── DataTable           # Main content table
│   └── StatusBadge     # Inline status indicators
└── Pagination          # Page controls
```

#### Context Providers

There are **no custom React context providers** (no Auth, Theme, or global state providers). State management is entirely local via `useState`/`useCallback` hooks. Routing context is provided by React Router's `BrowserRouter`.

The sidebar configuration lives in `src/data/sidebarConfig.ts` as static data, not context.

### Component Relationships

#### Composition Pattern

The codebase follows a clear **Atomic -> Molecular -> Organism -> Page** hierarchy:

```
UI Primitives (atomic)     ->  Button, Input, Dialog, Select, Switch, etc.
    | compose into
Max Components (molecular) ->  Modal (uses Dialog + Button), FilterBar (uses Input + Calendar),
                               DataTable (uses @tanstack/react-table), DatePickerField (uses Popover + Calendar)
    | compose into
Page Components (organism) ->  DashboardPage, VehiclesPage, etc.
    | wrapped by
AppLayout (template)       ->  Sidebar + PageLayout shell
```

Feature components **strictly use UI primitives from `src/components/ui/`** rather than reimplementing them. For example:
- `Modal` composes `Dialog` + `Button` + `BackButton`
- `FilterBar` composes `Input` + `Calendar` + `FilterPopover`
- `DatePickerField` composes `Popover` + `Calendar` from `ui/`
- `DataTable` uses `@tanstack/react-table` with `Table` primitives from `ui/`

All max components are exported through a **barrel file** (`src/components/max/index.ts`) and pages import exclusively from `@/components/max`.

#### Design Token Enforcement

Design tokens are **well-enforced across the codebase** with a few minor violations:

| File | Violation |
|------|-----------|
| `src/components/max/DistributionChart.tsx:102` | `color: "#fff"` -- should use a token |
| `src/components/max/DistributionChart.tsx:90` | `boxShadow: "0 4px 12px rgba(0,0,0,0.15)"` -- hardcoded shadow |
| `src/components/max/HorizontalBarChart.tsx:130` | `color: "#fff"` -- should use a token |
| `src/components/max/HorizontalBarChart.tsx:110` | `boxShadow: "0 4px 12px rgba(0,0,0,0.15)"` -- hardcoded shadow |
| `src/pages/GrowthActivationPage.tsx:237,257` | Same `rgba` shadow and `#fff` pattern (chart tooltip) |

All three instances are chart tooltip styling. The rest of the codebase consistently uses Tailwind utility classes referencing CSS variable tokens (e.g., `bg-content-bg`, `text-sidebar-item-active`, `border-status-info/20`).

### Third-Party UI Dependencies

| Library | Version | Role |
|---------|---------|------|
| `tailwindcss` | 4.2.1 | Styling framework |
| `radix-ui` | 1.4.3 | Headless UI primitives |
| `@radix-ui/react-switch` | 1.2.6 | Switch component |
| `lucide-react` | 0.577.0 | Icons |
| `class-variance-authority` | 0.7.1 | Component variants |
| `tailwind-merge` | 3.5.0 | Class conflict resolution |
| `clsx` | 2.1.1 | Class construction |
| `@tanstack/react-table` | 8.21.3 | Table logic |
| `recharts` | 3.8.0 | Charts |
| `react-day-picker` | 9.14.0 | Date picker |
| `date-fns` | 4.1.0 | Date utilities |
| `react-router-dom` | 7.13.1 | Routing |
| `pdfjs-dist` | 5.7.284 | PDF rendering |
| **`motion`** | **12.35.2** | **Unused -- no imports found** |

### Routes (24 total)

```
/                            -> Navigate to /dashboard
/dashboard                   -> DashboardPage
/fleet-register              -> VehiclesPage
/fleet-register/:id          -> VehicleDetailsPage
/asset-movement              -> AssetMovementPage
/asset-movement/:id          -> VehicleDetailsPage
/growth-activation           -> GrowthActivationPage
/mcp-management              -> MCPManagementPage
/inbound                     -> Navigate to /inbound/dashboard
/inbound/dashboard           -> InboundPage
/inbound/stock-setup         -> InboundPage
/inbound/batches             -> InboundPage
/inbound/batches/:id         -> BatchDetailsPage
/refurbishment               -> RefurbishmentPage
/service-schedule            -> ServiceSchedulePage
/disposal-management         -> DisposalManagementPage
/conversion-request          -> ConversionRequestPage
/scrap-management            -> ScrapManagementPage
/scrap-management/:id        -> ScrapDetailPage
/closed-assets               -> ClosedAssetsPage
/closed-assets/:id           -> ClosedAssetDetailPage
/transfer/all                -> AllTransferPage
/transfer/all/:id            -> TransferDetailPage
/activation/readiness        -> ActivationReadinessPage
```
