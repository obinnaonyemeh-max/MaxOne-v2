export type CallScriptFieldType = "radio" | "text"

export interface CallScriptQuestion {
  id: string
  question: string
  fieldType: CallScriptFieldType
  options?: string[]
  required: boolean
  placeholder?: string
}

export interface CallScriptTemplate {
  id: string
  title: string
  questions: CallScriptQuestion[]
}

// --- Subcategory-specific templates ---

const accidentReportScript: CallScriptTemplate = {
  id: "sub-1",
  title: "Accident Report Call Script",
  questions: [
    {
      id: "injury",
      question: "Was anyone injured in the accident?",
      fieldType: "radio",
      options: ["Yes", "No", "Unknown"],
      required: true,
    },
    {
      id: "vehicle-drivable",
      question: "Is the vehicle still drivable?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
    {
      id: "police-report",
      question: "Has a police report been filed?",
      fieldType: "radio",
      options: ["Yes", "No", "In Progress"],
      required: true,
    },
    {
      id: "accident-details",
      question: "Please describe what happened in detail",
      fieldType: "text",
      required: true,
      placeholder: "E.g. collision at intersection, rear-ended by another vehicle...",
    },
    {
      id: "third-party",
      question: "Was a third party involved?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
  ],
}

const theftRobberyScript: CallScriptTemplate = {
  id: "sub-2",
  title: "Theft / Robbery Call Script",
  questions: [
    {
      id: "champion-safe",
      question: "Is the champion currently safe?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
    {
      id: "item-stolen",
      question: "What was stolen?",
      fieldType: "radio",
      options: ["Vehicle", "Personal Belongings", "Both", "Other"],
      required: true,
    },
    {
      id: "police-contacted",
      question: "Have the police been contacted?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
    {
      id: "theft-location",
      question: "Where did the incident occur?",
      fieldType: "text",
      required: true,
      placeholder: "Provide specific location details...",
    },
    {
      id: "suspect-info",
      question: "Can the champion describe any suspects?",
      fieldType: "text",
      required: false,
      placeholder: "Any identifying features, vehicle descriptions, etc.",
    },
  ],
}

const vehicleBreakdownScript: CallScriptTemplate = {
  id: "sub-16",
  title: "Vehicle Breakdown Call Script",
  questions: [
    {
      id: "breakdown-type",
      question: "What type of breakdown occurred?",
      fieldType: "radio",
      options: ["Engine Failure", "Flat Tyre", "Electrical Issue", "Other"],
      required: true,
    },
    {
      id: "safe-location",
      question: "Is the vehicle parked in a safe location?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
    {
      id: "warning-signs",
      question: "Were there any warning signs before the breakdown?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
    {
      id: "warning-details",
      question: "Describe any warning signs or unusual behaviour noticed",
      fieldType: "text",
      required: false,
      placeholder: "E.g. strange noises, dashboard warning lights, smoke...",
    },
    {
      id: "tow-needed",
      question: "Does the champion need a tow service?",
      fieldType: "radio",
      options: ["Yes", "No", "Already Arranged"],
      required: true,
    },
  ],
}

// --- Category-level fallback templates ---

const incidentSafetyFallback: CallScriptTemplate = {
  id: "cat-1",
  title: "Incident & Safety Call Script",
  questions: [
    {
      id: "champion-condition",
      question: "What is the champion's current condition?",
      fieldType: "radio",
      options: ["Safe & Uninjured", "Minor Injury", "Needs Medical Attention"],
      required: true,
    },
    {
      id: "vehicle-status",
      question: "What is the current status of the vehicle?",
      fieldType: "radio",
      options: ["Operational", "Damaged", "Immobile", "Missing"],
      required: true,
    },
    {
      id: "incident-summary",
      question: "Briefly describe the incident",
      fieldType: "text",
      required: true,
      placeholder: "Provide a summary of what happened...",
    },
    {
      id: "immediate-help",
      question: "Does the champion require immediate assistance?",
      fieldType: "radio",
      options: ["Yes", "No"],
      required: true,
    },
  ],
}

const hmoInsuranceFallback: CallScriptTemplate = {
  id: "cat-12",
  title: "HMO / Insurance Call Script",
  questions: [
    {
      id: "request-type",
      question: "What is the nature of the request?",
      fieldType: "radio",
      options: ["New Enrollment", "Claim", "Plan Change", "Inquiry"],
      required: true,
    },
    {
      id: "current-plan",
      question: "Does the champion currently have an active HMO plan?",
      fieldType: "radio",
      options: ["Yes", "No", "Unsure"],
      required: true,
    },
    {
      id: "additional-info",
      question: "Any additional details about the request?",
      fieldType: "text",
      required: false,
      placeholder: "E.g. preferred hospital, specific coverage needs...",
    },
  ],
}

// --- Default generic script ---

const defaultScript: CallScriptTemplate = {
  id: "default",
  title: "General Call Script",
  questions: [
    {
      id: "reason-for-call",
      question: "What is the reason for the champion's call?",
      fieldType: "text",
      required: true,
      placeholder: "Describe the reason for the call...",
    },
    {
      id: "urgency",
      question: "How urgent is this request?",
      fieldType: "radio",
      options: ["Urgent", "Normal", "Low Priority"],
      required: true,
    },
    {
      id: "previous-ticket",
      question: "Has the champion raised a similar issue before?",
      fieldType: "radio",
      options: ["Yes", "No", "Unsure"],
      required: false,
    },
    {
      id: "additional-notes",
      question: "Any additional notes from the call?",
      fieldType: "text",
      required: false,
      placeholder: "Record any other relevant information...",
    },
  ],
}

// --- Lookup maps for O(1) resolution ---

const subcategoryScripts = new Map<string, CallScriptTemplate>([
  [accidentReportScript.id, accidentReportScript],
  [theftRobberyScript.id, theftRobberyScript],
  [vehicleBreakdownScript.id, vehicleBreakdownScript],
])

const categoryScripts = new Map<string, CallScriptTemplate>([
  [incidentSafetyFallback.id, incidentSafetyFallback],
  [hmoInsuranceFallback.id, hmoInsuranceFallback],
])

export function resolveCallScript(
  subcategoryId: string,
  categoryId: string,
): CallScriptTemplate {
  return (
    subcategoryScripts.get(subcategoryId) ??
    categoryScripts.get(categoryId) ??
    defaultScript
  )
}
