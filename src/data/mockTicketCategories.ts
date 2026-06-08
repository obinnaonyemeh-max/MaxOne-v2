import type { TicketCategory, TicketSubcategory } from "@/pages/create-ticket/types"

export const ticketCategories: TicketCategory[] = [
  { id: "cat-1",  name: "Incident Safety",     icon: "ShieldAlert",      subcategoryCount: 3 },
  { id: "cat-2",  name: "Phone Number Update",  icon: "Phone",            subcategoryCount: 2 },
  { id: "cat-3",  name: "Documentation",        icon: "FileText",         subcategoryCount: 3 },
  { id: "cat-4",  name: "Portfolio",            icon: "Briefcase",        subcategoryCount: 2 },
  { id: "cat-5",  name: "Telematics",           icon: "Radio",            subcategoryCount: 3 },
  { id: "cat-6",  name: "Prospect",             icon: "UserPlus",         subcategoryCount: 2 },
  { id: "cat-7",  name: "Fleet",                icon: "Car",              subcategoryCount: 3 },
  { id: "cat-8",  name: "Reverification",       icon: "ScanSearch",       subcategoryCount: 2 },
  { id: "cat-9",  name: "Leave Request",        icon: "CalendarOff",      subcategoryCount: 2 },
  { id: "cat-10", name: "Others",               icon: "MoreHorizontal",   subcategoryCount: 3 },
  { id: "cat-11", name: "Reactivation",         icon: "RefreshCw",        subcategoryCount: 2 },
  { id: "cat-12", name: "HMO/Insurance",        icon: "HeartPulse",       subcategoryCount: 3 },
]

export const ticketSubcategories: TicketSubcategory[] = [
  // Incident Safety
  { id: "sub-1",  categoryId: "cat-1",  name: "Accident Report",          concernedTeam: "Safety Team",       slaTime: "2 hours",  priorityLevel: "High" },
  { id: "sub-2",  categoryId: "cat-1",  name: "Theft / Robbery",          concernedTeam: "Safety Team",       slaTime: "1 hour",   priorityLevel: "High" },
  { id: "sub-3",  categoryId: "cat-1",  name: "Vehicle Seizure",          concernedTeam: "Safety Team",       slaTime: "4 hours",  priorityLevel: "Medium" },

  // Phone Number Update
  { id: "sub-4",  categoryId: "cat-2",  name: "Primary Number Change",    concernedTeam: "Support Team",      slaTime: "24 hours", priorityLevel: "Low" },
  { id: "sub-5",  categoryId: "cat-2",  name: "Emergency Contact Update", concernedTeam: "Support Team",      slaTime: "24 hours", priorityLevel: "Low" },

  // Documentation
  { id: "sub-6",  categoryId: "cat-3",  name: "License Renewal",          concernedTeam: "Documentation Team", slaTime: "48 hours", priorityLevel: "Medium" },
  { id: "sub-7",  categoryId: "cat-3",  name: "Vehicle Papers",           concernedTeam: "Documentation Team", slaTime: "48 hours", priorityLevel: "Medium" },
  { id: "sub-8",  categoryId: "cat-3",  name: "Insurance Certificate",    concernedTeam: "Documentation Team", slaTime: "24 hours", priorityLevel: "Medium" },

  // Portfolio
  { id: "sub-9",  categoryId: "cat-4",  name: "Portfolio Transfer",       concernedTeam: "Portfolio Team",    slaTime: "24 hours", priorityLevel: "Medium" },
  { id: "sub-10", categoryId: "cat-4",  name: "Portfolio Reassignment",   concernedTeam: "Portfolio Team",    slaTime: "12 hours", priorityLevel: "Medium" },

  // Telematics
  { id: "sub-11", categoryId: "cat-5",  name: "Device Malfunction",       concernedTeam: "Telematics Team",   slaTime: "4 hours",  priorityLevel: "High" },
  { id: "sub-12", categoryId: "cat-5",  name: "GPS Tracking Issue",       concernedTeam: "Telematics Team",   slaTime: "6 hours",  priorityLevel: "Medium" },
  { id: "sub-13", categoryId: "cat-5",  name: "Device Replacement",       concernedTeam: "Telematics Team",   slaTime: "24 hours", priorityLevel: "Low" },

  // Prospect
  { id: "sub-14", categoryId: "cat-6",  name: "New Prospect Inquiry",     concernedTeam: "Growth Team",       slaTime: "12 hours", priorityLevel: "Medium" },
  { id: "sub-15", categoryId: "cat-6",  name: "Prospect Follow-up",       concernedTeam: "Growth Team",       slaTime: "24 hours", priorityLevel: "Low" },

  // Fleet
  { id: "sub-16", categoryId: "cat-7",  name: "Vehicle Breakdown",        concernedTeam: "Fleet Team",        slaTime: "2 hours",  priorityLevel: "High" },
  { id: "sub-17", categoryId: "cat-7",  name: "Scheduled Maintenance",    concernedTeam: "Fleet Team",        slaTime: "48 hours", priorityLevel: "Low" },
  { id: "sub-18", categoryId: "cat-7",  name: "Vehicle Swap Request",     concernedTeam: "Fleet Team",        slaTime: "24 hours", priorityLevel: "Medium" },

  // Reverification
  { id: "sub-19", categoryId: "cat-8",  name: "Identity Reverification",  concernedTeam: "Compliance Team",   slaTime: "24 hours", priorityLevel: "Medium" },
  { id: "sub-20", categoryId: "cat-8",  name: "Address Reverification",   concernedTeam: "Compliance Team",   slaTime: "48 hours", priorityLevel: "Low" },

  // Leave Request
  { id: "sub-21", categoryId: "cat-9",  name: "Planned Leave",            concernedTeam: "Operations Team",   slaTime: "48 hours", priorityLevel: "Low" },
  { id: "sub-22", categoryId: "cat-9",  name: "Emergency Leave",          concernedTeam: "Operations Team",   slaTime: "4 hours",  priorityLevel: "High" },

  // Others
  { id: "sub-23", categoryId: "cat-10", name: "General Inquiry",          concernedTeam: "Support Team",      slaTime: "24 hours", priorityLevel: "Low" },
  { id: "sub-24", categoryId: "cat-10", name: "Complaint",                concernedTeam: "Support Team",      slaTime: "12 hours", priorityLevel: "Medium" },
  { id: "sub-25", categoryId: "cat-10", name: "Feedback / Suggestion",    concernedTeam: "Support Team",      slaTime: "48 hours", priorityLevel: "Low" },

  // Reactivation
  { id: "sub-26", categoryId: "cat-11", name: "Account Reactivation",     concernedTeam: "Operations Team",   slaTime: "12 hours", priorityLevel: "Medium" },
  { id: "sub-27", categoryId: "cat-11", name: "Vehicle Reactivation",     concernedTeam: "Fleet Team",        slaTime: "24 hours", priorityLevel: "Medium" },

  // HMO/Insurance
  { id: "sub-28", categoryId: "cat-12", name: "HMO Enrollment",           concernedTeam: "Welfare Team",      slaTime: "48 hours", priorityLevel: "Low" },
  { id: "sub-29", categoryId: "cat-12", name: "Insurance Claim",          concernedTeam: "Welfare Team",      slaTime: "12 hours", priorityLevel: "High" },
  { id: "sub-30", categoryId: "cat-12", name: "HMO Plan Change",          concernedTeam: "Welfare Team",      slaTime: "24 hours", priorityLevel: "Medium" },
]

export function getSubcategoriesByCategoryId(categoryId: string): TicketSubcategory[] {
  return ticketSubcategories.filter((sub) => sub.categoryId === categoryId)
}
