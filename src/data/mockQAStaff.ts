export interface QAStaff {
  id: string
  name: string
  location: string
}

export const mockQAStaff: QAStaff[] = [
  { id: "qa-1", name: "Amaka Okonkwo", location: "Lagos Hub" },
  { id: "qa-2", name: "Tunde Adebayo", location: "Lagos Hub" },
  { id: "qa-3", name: "Ngozi Eze", location: "Lagos Hub" },
  { id: "qa-4", name: "Funke Adeyemi", location: "Ibadan Hub" },
  { id: "qa-5", name: "Ibrahim Musa", location: "Ibadan Hub" },
  { id: "qa-6", name: "Chinedu Okafor", location: "Abeokuta Hub" },
]

export function getQAStaffById(id: string): QAStaff | undefined {
  return mockQAStaff.find((qa) => qa.id === id)
}

export function getQAStaffForLocation(location: string): QAStaff[] {
  return mockQAStaff
    .filter((qa) => qa.location === location)
    .sort((a, b) => a.name.localeCompare(b.name))
}
