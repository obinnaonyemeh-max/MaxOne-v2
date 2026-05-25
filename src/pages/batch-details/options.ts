import type { RegistrationRecord } from "@/data/mockBatchDetailRows"
import type { FilterSection, GenericFilterState } from "@/components/max"

export const stageVariantMap: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  "At Port": "warning",
  "Identifier Upload": "info",
  "In Transit": "info",
  "In Production": "default",
  "Clearing": "warning",
  "Warehouse QA": "default",
  "Ready for Activation": "success",
}

export const stageOrder = [
  "In Production",
  "Identifier Upload",
  "In Transit",
  "At Port",
  "Clearing",
  "Warehouse QA",
  "Ready for Activation",
]

export function getNextStage(currentStage: string): string | null {
  const index = stageOrder.indexOf(currentStage)
  if (index === -1 || index === stageOrder.length - 1) return null
  return stageOrder[index + 1]
}

export const registrationStatusVariant: Record<RegistrationRecord["status"], "success" | "info" | "default"> = {
  "Not Started": "default",
  "Registration In Progress": "info",
  "Registration Completed": "success",
}

export const officerOptions = [
  "Adebayo Ogunlesi",
  "Chioma Nwosu",
  "Emeka Obiora",
  "Fatima Abdullahi",
  "Ibrahim Musa",
  "Ngozi Okafor",
]

export const registrationStatusOptions: RegistrationRecord["status"][] = [
  "Not Started",
  "Registration In Progress",
  "Registration Completed",
]

export const documentTypeOptions = [
  "Supplier Invoice",
  "Bill of Lading",
  "Customs Declaration",
  "Insurance Certificate",
  "Inspection Report",
]

export const regFilterSections: FilterSection[] = [
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

export const defaultRegFilters: GenericFilterState = {
  status: [],
}

export const docFilterSections: FilterSection[] = [
  {
    id: "type",
    title: "Document Type",
    defaultExpanded: true,
    options: documentTypeOptions.map((t) => ({ value: t, label: t })),
  },
]

export const defaultDocFilters: GenericFilterState = {
  type: [],
}

export function getRegistrationStats(records: RegistrationRecord[]) {
  return [
    { title: "Total Uploaded", value: records.length, indicatorColor: "var(--color-status-amber)" },
    { title: "Not Started", value: records.filter((r) => r.status === "Not Started").length, indicatorColor: "var(--color-gray-500)" },
    { title: "In Progress", value: records.filter((r) => r.status === "Registration In Progress").length, indicatorColor: "var(--color-status-info)" },
    { title: "Completed", value: records.filter((r) => r.status === "Registration Completed").length, indicatorColor: "var(--color-success)" },
  ]
}
