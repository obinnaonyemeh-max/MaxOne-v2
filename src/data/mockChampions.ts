export interface Champion {
  id: string
  name: string
  championId: string
  avatarUrl: string
  contactNumber: string
  city: string
  subcity: string
  plateNumber: string
  outstandingBalance: number
  lastActiveDate: string
}

export function championLocationLabel(champion: Pick<Champion, "city" | "subcity">): string {
  return `${champion.city} – ${champion.subcity}`
}

export function getChampionById(id: string): Champion | undefined {
  return mockChampions.find((champion) => champion.id === id)
}

export function getChampionByCode(championId: string): Champion | undefined {
  return mockChampions.find((champion) => champion.championId === championId)
}

const AVATAR = "/images/champvatar.png"

export const mockChampions: Champion[] = [
  { id: "1",  name: "Adewale Ogunleye",   championId: "CHP-001", avatarUrl: AVATAR, contactNumber: "+234 801 234 5678", city: "Lagos",         subcity: "Ikeja",               plateNumber: "LAG-234-XY", outstandingBalance: 125000, lastActiveDate: "28 May 2026" },
  { id: "2",  name: "Chinedu Okafor",     championId: "CHP-002", avatarUrl: AVATAR, contactNumber: "+234 802 345 6789", city: "Lagos",         subcity: "Lekki",               plateNumber: "LAG-891-AB", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
  { id: "3",  name: "Emeka Nwosu",        championId: "CHP-003", avatarUrl: AVATAR, contactNumber: "+234 803 456 7890", city: "Lagos",         subcity: "Surulere",            plateNumber: "LAG-456-CD", outstandingBalance: 45000,  lastActiveDate: "25 May 2026" },
  { id: "4",  name: "Funke Adeyemi",      championId: "CHP-004", avatarUrl: AVATAR, contactNumber: "+234 804 567 8901", city: "Lagos",         subcity: "Yaba",                plateNumber: "LAG-112-EF", outstandingBalance: 200000, lastActiveDate: "20 May 2026" },
  { id: "5",  name: "Gbenga Alabi",       championId: "CHP-005", avatarUrl: AVATAR, contactNumber: "+234 805 678 9012", city: "Lagos",         subcity: "Victoria Island",     plateNumber: "LAG-778-GH", outstandingBalance: 0,      lastActiveDate: "31 May 2026" },
  { id: "6",  name: "Hassan Musa",        championId: "CHP-006", avatarUrl: AVATAR, contactNumber: "+234 806 789 0123", city: "Lagos",         subcity: "Ajah",                plateNumber: "LAG-334-IJ", outstandingBalance: 87500,  lastActiveDate: "27 May 2026" },
  { id: "7",  name: "Ibrahim Yusuf",      championId: "CHP-007", avatarUrl: AVATAR, contactNumber: "+234 807 890 1234", city: "Lagos",         subcity: "Ikorodu",             plateNumber: "LAG-556-KL", outstandingBalance: 310000, lastActiveDate: "15 May 2026" },
  { id: "8",  name: "Janet Eze",          championId: "CHP-008", avatarUrl: AVATAR, contactNumber: "+234 808 901 2345", city: "Lagos",         subcity: "Ikeja",               plateNumber: "LAG-990-MN", outstandingBalance: 0,      lastActiveDate: "29 May 2026" },
  { id: "9",  name: "Kalu Nnamdi",        championId: "CHP-009", avatarUrl: AVATAR, contactNumber: "+234 809 012 3456", city: "Lagos",         subcity: "Oshodi",              plateNumber: "LAG-221-OP", outstandingBalance: 62000,  lastActiveDate: "22 May 2026" },
  { id: "10", name: "Lateef Bakare",      championId: "CHP-010", avatarUrl: AVATAR, contactNumber: "+234 810 123 4567", city: "Lagos",         subcity: "Agege",               plateNumber: "LAG-443-QR", outstandingBalance: 155000, lastActiveDate: "18 May 2026" },
  { id: "11", name: "Maryam Abdullahi",   championId: "CHP-011", avatarUrl: AVATAR, contactNumber: "+234 811 234 5678", city: "Lagos",         subcity: "Lekki",               plateNumber: "LAG-667-ST", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
  { id: "12", name: "Ngozi Umeh",         championId: "CHP-012", avatarUrl: AVATAR, contactNumber: "+234 812 345 6789", city: "Lagos",         subcity: "Surulere",            plateNumber: "LAG-889-UV", outstandingBalance: 29000,  lastActiveDate: "26 May 2026" },
  { id: "13", name: "Olumide Fashola",    championId: "CHP-013", avatarUrl: AVATAR, contactNumber: "+234 813 456 7890", city: "Lagos",         subcity: "Ikeja",               plateNumber: "LAG-101-WX", outstandingBalance: 0,      lastActiveDate: "31 May 2026" },
  { id: "14", name: "Patricia Obi",       championId: "CHP-014", avatarUrl: AVATAR, contactNumber: "+234 814 567 8901", city: "Abuja",         subcity: "Wuse",                plateNumber: "ABJ-201-AA", outstandingBalance: 178000, lastActiveDate: "29 May 2026" },
  { id: "15", name: "Rasheed Balogun",    championId: "CHP-015", avatarUrl: AVATAR, contactNumber: "+234 815 678 9012", city: "Abuja",         subcity: "Garki",               plateNumber: "ABJ-302-BB", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
  { id: "16", name: "Sade Ogundimu",      championId: "CHP-016", avatarUrl: AVATAR, contactNumber: "+234 816 789 0123", city: "Lagos",         subcity: "Yaba",                plateNumber: "LAG-402-YZ", outstandingBalance: 95000,  lastActiveDate: "24 May 2026" },
  { id: "17", name: "Tochukwu Ibe",       championId: "CHP-017", avatarUrl: AVATAR, contactNumber: "+234 817 890 1234", city: "Kano",          subcity: "Sabon Gari",          plateNumber: "KAN-501-CC", outstandingBalance: 240000, lastActiveDate: "20 May 2026" },
  { id: "18", name: "Uche Onyekachi",     championId: "CHP-018", avatarUrl: AVATAR, contactNumber: "+234 818 901 2345", city: "Lagos",         subcity: "Lekki",               plateNumber: "LAG-603-DD", outstandingBalance: 0,      lastActiveDate: "31 May 2026" },
  { id: "19", name: "Victor Ajayi",       championId: "CHP-019", avatarUrl: AVATAR, contactNumber: "+234 819 012 3456", city: "Ibadan",        subcity: "Ring Road",           plateNumber: "IBD-701-EE", outstandingBalance: 52000,  lastActiveDate: "27 May 2026" },
  { id: "20", name: "Wumi Ayodele",       championId: "CHP-020", avatarUrl: AVATAR, contactNumber: "+234 820 123 4567", city: "Lagos",         subcity: "Agege",               plateNumber: "LAG-804-FF", outstandingBalance: 0,      lastActiveDate: "28 May 2026" },
  { id: "21", name: "Yinka Olawale",      championId: "CHP-021", avatarUrl: AVATAR, contactNumber: "+234 821 234 5678", city: "Lagos",         subcity: "Victoria Island",     plateNumber: "LAG-905-GG", outstandingBalance: 410000, lastActiveDate: "15 May 2026" },
  { id: "22", name: "Zainab Mohammed",    championId: "CHP-022", avatarUrl: AVATAR, contactNumber: "+234 822 345 6789", city: "Abuja",         subcity: "Wuse",                plateNumber: "ABJ-106-HH", outstandingBalance: 33000,  lastActiveDate: "26 May 2026" },
  { id: "23", name: "Abdulrahman Sule",   championId: "CHP-023", avatarUrl: AVATAR, contactNumber: "+234 823 456 7890", city: "Lagos",         subcity: "Oshodi",              plateNumber: "LAG-207-JJ", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
  { id: "24", name: "Bimpe Afolabi",      championId: "CHP-024", avatarUrl: AVATAR, contactNumber: "+234 824 567 8901", city: "Lagos",         subcity: "Surulere",            plateNumber: "LAG-308-KK", outstandingBalance: 67500,  lastActiveDate: "23 May 2026" },
  { id: "25", name: "Chidera Anyanwu",    championId: "CHP-025", avatarUrl: AVATAR, contactNumber: "+234 825 678 9012", city: "Port Harcourt", subcity: "D-Line",              plateNumber: "PHC-409-LL", outstandingBalance: 190000, lastActiveDate: "19 May 2026" },
  { id: "26", name: "Dele Ogundare",      championId: "CHP-026", avatarUrl: AVATAR, contactNumber: "+234 826 789 0123", city: "Lagos",         subcity: "Ikorodu",             plateNumber: "LAG-510-MM", outstandingBalance: 0,      lastActiveDate: "31 May 2026" },
  { id: "27", name: "Esther Nwankwo",     championId: "CHP-027", avatarUrl: AVATAR, contactNumber: "+234 827 890 1234", city: "Lagos",         subcity: "Ajah",                plateNumber: "LAG-611-NN", outstandingBalance: 145000, lastActiveDate: "21 May 2026" },
  { id: "28", name: "Femi Adegoke",       championId: "CHP-028", avatarUrl: AVATAR, contactNumber: "+234 828 901 2345", city: "Kano",          subcity: "Sabon Gari",          plateNumber: "KAN-712-PP", outstandingBalance: 0,      lastActiveDate: "29 May 2026" },
  { id: "29", name: "Gloria Adekunle",    championId: "CHP-029", avatarUrl: AVATAR, contactNumber: "+234 829 012 3456", city: "Lagos",         subcity: "Ikeja",               plateNumber: "LAG-813-QQ", outstandingBalance: 82000,  lastActiveDate: "25 May 2026" },
  { id: "30", name: "Henry Okoro",        championId: "CHP-030", avatarUrl: AVATAR, contactNumber: "+234 830 123 4567", city: "Ibadan",        subcity: "Ring Road",           plateNumber: "IBD-914-RR", outstandingBalance: 0,      lastActiveDate: "28 May 2026" },
  { id: "31", name: "Ifeoma Chukwu",      championId: "CHP-031", avatarUrl: AVATAR, contactNumber: "+234 831 234 5678", city: "Lagos",         subcity: "Lekki",               plateNumber: "LAG-015-SS", outstandingBalance: 275000, lastActiveDate: "17 May 2026" },
  { id: "32", name: "James Okechukwu",    championId: "CHP-032", avatarUrl: AVATAR, contactNumber: "+234 832 345 6789", city: "Abuja",         subcity: "Garki",               plateNumber: "ABJ-116-TT", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
  { id: "33", name: "Kemi Solanke",       championId: "CHP-033", avatarUrl: AVATAR, contactNumber: "+234 833 456 7890", city: "Lagos",         subcity: "Yaba",                plateNumber: "LAG-217-UU", outstandingBalance: 118000, lastActiveDate: "22 May 2026" },
  { id: "34", name: "Lukman Garba",       championId: "CHP-034", avatarUrl: AVATAR, contactNumber: "+234 834 567 8901", city: "Port Harcourt", subcity: "D-Line",              plateNumber: "PHC-318-VV", outstandingBalance: 0,      lastActiveDate: "27 May 2026" },
  { id: "35", name: "Morenike Taiwo",     championId: "CHP-035", avatarUrl: AVATAR, contactNumber: "+234 835 678 9012", city: "Lagos",         subcity: "Victoria Island",     plateNumber: "LAG-419-WW", outstandingBalance: 56000,  lastActiveDate: "26 May 2026" },
  { id: "36", name: "Nonso Emelife",      championId: "CHP-036", avatarUrl: AVATAR, contactNumber: "+234 836 789 0123", city: "Lagos",         subcity: "Oshodi",              plateNumber: "LAG-520-XX", outstandingBalance: 0,      lastActiveDate: "31 May 2026" },
  { id: "37", name: "Olayinka Dada",      championId: "CHP-037", avatarUrl: AVATAR, contactNumber: "+234 837 890 1234", city: "Lagos",         subcity: "Agege",               plateNumber: "LAG-621-YY", outstandingBalance: 205000, lastActiveDate: "16 May 2026" },
  { id: "38", name: "Promise Bassey",     championId: "CHP-038", avatarUrl: AVATAR, contactNumber: "+234 838 901 2345", city: "Abuja",         subcity: "Wuse",                plateNumber: "ABJ-722-ZZ", outstandingBalance: 0,      lastActiveDate: "29 May 2026" },
  { id: "39", name: "Quadri Animashaun",  championId: "CHP-039", avatarUrl: AVATAR, contactNumber: "+234 839 012 3456", city: "Lagos",         subcity: "Ikorodu",             plateNumber: "LAG-823-AB", outstandingBalance: 73000,  lastActiveDate: "24 May 2026" },
  { id: "40", name: "Rukayat Abiodun",    championId: "CHP-040", avatarUrl: AVATAR, contactNumber: "+234 840 123 4567", city: "Lagos",         subcity: "Ajah",                plateNumber: "LAG-924-CD", outstandingBalance: 0,      lastActiveDate: "30 May 2026" },
]
