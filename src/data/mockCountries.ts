// Countries MAX operates fleets in — shared across Pricing Configuration.

export interface Country {
  id: string
  name: string
  code: string
  flag: string
}

export const mockCountries: Country[] = [
  { id: "ng", name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { id: "ke", name: "Kenya", code: "KE", flag: "🇰🇪" },
  { id: "ug", name: "Uganda", code: "UG", flag: "🇺🇬" },
  { id: "gh", name: "Ghana", code: "GH", flag: "🇬🇭" },
]
