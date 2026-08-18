import type { FilterSection, GenericFilterState } from "@/components/max"

const COLOR_BRAND_PRIMARY = "var(--color-brand-primary)"
const COLOR_BADGE_ACTIVE = "var(--color-badge-active-text)"
const COLOR_STATUS_WARNING = "var(--color-warning)"
const COLOR_STATUS_INFO = "var(--color-status-info)"
const COLOR_STATUS_DANGER = "var(--color-danger)"
const COLOR_GRAY_500 = "var(--color-gray-500)"

const COLOR_FILTER_YARD = "var(--color-badge-active-text)"
const COLOR_FILTER_3PL = "var(--color-status-info)"
const COLOR_FILTER_INBOUND = "var(--color-warning)"
const COLOR_FILTER_SUCCESS = "var(--color-success)"
const COLOR_FILTER_WARNING = "var(--color-warning)"
const COLOR_FILTER_DANGER = "var(--color-danger)"

export const checkInStats = [
  { title: "Total Check-In", value: 11, indicatorColor: COLOR_BRAND_PRIMARY },
  { title: "Yard Check-In", value: 9, indicatorColor: COLOR_BADGE_ACTIVE },
  { title: "3PL Check-In", value: 2, indicatorColor: COLOR_STATUS_INFO },
  { title: "Inbound – Ready", value: 6, indicatorColor: COLOR_STATUS_WARNING },
  { title: "In Breach", value: 6, indicatorColor: COLOR_STATUS_DANGER },
  { title: "Due for Deactivation", value: 7, indicatorColor: COLOR_GRAY_500 },
]

export const checkoutStats = [
  { title: "Total Check-Out Today", value: 5, indicatorColor: COLOR_BRAND_PRIMARY },
  { title: "Returned to Active", value: 2, indicatorColor: COLOR_BADGE_ACTIVE },
  { title: "OEM Outbound", value: 1, indicatorColor: COLOR_STATUS_WARNING },
  { title: "Outright Sales", value: 1, indicatorColor: COLOR_STATUS_DANGER },
  { title: "Operational Vehicles", value: 1, indicatorColor: COLOR_STATUS_INFO },
  { title: "Inbound Activated", value: 1, indicatorColor: COLOR_BADGE_ACTIVE },
]

export const checkInFilterSections: FilterSection[] = [
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

export const defaultCheckInFilters: GenericFilterState = {
  checkInType: [],
  reason: [],
  location: [],
  officer: [],
  breachStatus: [],
}

export const checkoutFilterSections: FilterSection[] = [
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
      { value: "Abeokuta Yard", label: "Abeokuta Yard" },
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

export const defaultCheckoutFilters: GenericFilterState = {
  checkInReason: [],
  checkOutStatus: [],
  location: [],
  officer: [],
}

export const movementLogFilterSections: FilterSection[] = [
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
      { value: "Abeokuta Yard", label: "Abeokuta Yard" },
      { value: "Ibadan 3PL", label: "Ibadan 3PL" },
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

export const defaultMovementLogFilters: GenericFilterState = {
  movementType: [],
  movementReason: [],
  location: [],
  officer: [],
}
