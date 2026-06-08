import type { ChampionDetails } from "@/data/mockChampionDetails"

export type WizardStep = 1 | 2 | 3 | 4

export interface TicketCategory {
  id: string
  name: string
  icon: string
  subcategoryCount: number
}

export interface TicketSubcategory {
  id: string
  categoryId: string
  name: string
  concernedTeam: string
  slaTime: string
  priorityLevel: "High" | "Medium" | "Low"
}

export interface TicketDetailsForm {
  platform: string
  reporter: string
  priority: string
  city: string
  locationDescription: string
  date: Date | undefined
  time: string
  incidentDescription: string
  attachments: File[]
}

export interface WizardState {
  currentStep: WizardStep
  championSearch: string
  selectedChampion: ChampionDetails | null
  categorySearch: string
  selectedCategory: TicketCategory | null
  selectedSubcategory: TicketSubcategory | null
  details: TicketDetailsForm
}

export type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_CHAMPION_SEARCH"; query: string }
  | { type: "SELECT_CHAMPION"; champion: ChampionDetails }
  | { type: "CLEAR_CHAMPION" }
  | { type: "SET_CATEGORY_SEARCH"; query: string }
  | { type: "SELECT_CATEGORY"; category: TicketCategory }
  | { type: "SELECT_SUBCATEGORY"; subcategory: TicketSubcategory }
  | { type: "UPDATE_DETAILS"; field: keyof TicketDetailsForm; value: TicketDetailsForm[keyof TicketDetailsForm] }
  | { type: "ADD_ATTACHMENT"; file: File }
  | { type: "REMOVE_ATTACHMENT"; index: number }
  | { type: "RESET" }
