export type ReferrerProfile = "Champion" | "Staff"

export type PaymentStatus =
  | "Eligible for First Reward"
  | "First Reward Paid"
  | "Eligible for Second Reward"
  | "Final Reward Paid"

const rewardStatuses: PaymentStatus[] = [
  "Eligible for First Reward",
  "First Reward Paid",
  "Eligible for Second Reward",
  "Final Reward Paid",
]

export interface Referral {
  id: string
  prospectName: string
  email: string
  contact: string
  status: PaymentStatus
  referredBy: string
  referrerProfile: ReferrerProfile
  location: string
  dateReferred: string
}

// Rows visible in the reference design (REFERRED tab)
const seedReferrals: Referral[] = [
  { id: "REF-9200", prospectName: "Muhammed Adams", email: "max-la-33000@gmail.com", contact: "+234721132115", status: "Eligible for First Reward", referredBy: "TOBI ADEDOYIN", referrerProfile: "Champion", location: "Lagos", dateReferred: "25 Jun 2026" },
  { id: "REF-9201", prospectName: "Abass Olawale", email: "max-la-33001@gmail.com", contact: "+234725119169", status: "First Reward Paid", referredBy: "Tokunbo Shade Andy", referrerProfile: "Staff", location: "Ibadan", dateReferred: "16 Jun 2026" },
  { id: "REF-9204", prospectName: "David Daminagbor", email: "max-la-33004@gmail.com", contact: "+234737080332", status: "Eligible for Second Reward", referredBy: "Field Team Lagos", referrerProfile: "Champion", location: "Sagamu", dateReferred: "21 May 2026" },
  { id: "REF-9205", prospectName: "Rasheed Odelade", email: "max-la-33005@gmail.com", contact: "+234741067386", status: "Final Reward Paid", referredBy: "TOBI ADEDOYIN", referrerProfile: "Staff", location: "Benin City", dateReferred: "12 May 2026" },
  { id: "REF-9208", prospectName: "Tobi Adeoye", email: "max-la-33008@gmail.com", contact: "+234753028548", status: "Eligible for First Reward", referredBy: "Mama G Recruit", referrerProfile: "Champion", location: "Lagos", dateReferred: "16 Apr 2026" },
  { id: "REF-9209", prospectName: "Emeka Umeh", email: "max-la-33009@gmail.com", contact: "+234757015602", status: "First Reward Paid", referredBy: "Field Team Lagos", referrerProfile: "Staff", location: "Ibadan", dateReferred: "07 Apr 2026" },
  { id: "REF-9212", prospectName: "Sola Ajibade", email: "max-la-33012@gmail.com", contact: "+234768976765", status: "Eligible for Second Reward", referredBy: "Chuks Eze", referrerProfile: "Champion", location: "Sagamu", dateReferred: "12 Mar 2026" },
  { id: "REF-9213", prospectName: "Uche Nwankwo", email: "max-la-33013@gmail.com", contact: "+234772963819", status: "Final Reward Paid", referredBy: "Mama G Recruit", referrerProfile: "Staff", location: "Benin City", dateReferred: "03 Mar 2026" },
  { id: "REF-9216", prospectName: "Chidi Nnamdi", email: "max-la-33016@gmail.com", contact: "+234784924982", status: "Eligible for First Reward", referredBy: "Tokunbo Shade Andy", referrerProfile: "Champion", location: "Lagos", dateReferred: "05 Feb 2026" },
  { id: "REF-9217", prospectName: "Femi Aluko", email: "max-la-33017@gmail.com", contact: "+234788912036", status: "First Reward Paid", referredBy: "Chuks Eze", referrerProfile: "Staff", location: "Ibadan", dateReferred: "27 Jan 2026" },
  { id: "REF-9220", prospectName: "Muhammed Adams", email: "max-la-33020@gmail.com", contact: "+234700873199", status: "Eligible for Second Reward", referredBy: "TOBI ADEDOYIN", referrerProfile: "Champion", location: "Sagamu", dateReferred: "09 Aug 2026" },
  { id: "REF-9221", prospectName: "Abass Olawale", email: "max-la-33021@gmail.com", contact: "+234704860253", status: "Final Reward Paid", referredBy: "Tokunbo Shade Andy", referrerProfile: "Staff", location: "Benin City", dateReferred: "31 Jul 2026" },
]

const prospectNames = ["Ola Bankole", "Ngozi Ibe", "Kunle Ade", "Ifeoma Obi", "Segun Bello", "Amaka Nwosu", "Bola Kimball", "Yemi Alade", "Tunde Bakare", "Ada Umeh"]
const referrers = ["TOBI ADEDOYIN", "Tokunbo Shade Andy", "Field Team Lagos", "Mama G Recruit", "Chuks Eze"]
const profiles: ReferrerProfile[] = ["Champion", "Staff"]
const locations = ["Lagos", "Ibadan", "Sagamu", "Benin City"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

// Deterministically extend to 22 rows so pagination has multiple pages
const extraReferrals: Referral[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 24
  return {
    id: `REF-${9221 + n}`,
    prospectName: prospectNames[i % prospectNames.length],
    email: `max-la-${33021 + n}@gmail.com`,
    contact: `+234${(7050000000 + n * 1739317).toString().slice(0, 10)}`,
    status: rewardStatuses[i % rewardStatuses.length],
    referredBy: referrers[i % referrers.length],
    referrerProfile: profiles[i % profiles.length],
    location: locations[i % locations.length],
    dateReferred: `${String(2 + (i % 26)).padStart(2, "0")} ${months[i % months.length]} 2026`,
  }
})

export const mockReferrals: Referral[] = [...seedReferrals, ...extraReferrals]

// ---- Awaiting Payment tab ----

export interface AwaitingPayment {
  id: string
  referrer: string
  referrerProfile: string
  status: PaymentStatus
  location: string
  amount: number
  dateReferred: string
}

const awaitingReferrers = ["Chuks Eze", "Tokunbo Shade Andy", "Tobi Adedoyin", "Field Team Lagos", "Mama G Recruit"]
const awaitingLocations = ["Abuja", "Kano"]
const awaitingMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

export const mockAwaitingPayments: AwaitingPayment[] = Array.from({ length: 14 }, (_, i) => ({
  id: `AWP-${9000 + i}`,
  referrer: awaitingReferrers[i % awaitingReferrers.length],
  referrerProfile: i % 2 === 0 ? "Champion" : "Staff",
  status: i % 3 === 0 ? "Eligible for Second Reward" : "Eligible for First Reward",
  location: awaitingLocations[i % awaitingLocations.length],
  amount: 5000,
  dateReferred: `${String(3 + (i % 25)).padStart(2, "0")} ${awaitingMonths[i % awaitingMonths.length]} 2026`,
}))

// ---- Completed Payouts tab ----

export interface CompletedPayout {
  id: string
  referrer: string
  referrerProfile: string
  status: "Final Payment"
  location: string
  amount: number
  dateReferred: string
}

export const mockCompletedPayouts: CompletedPayout[] = Array.from({ length: 14 }, (_, i) => ({
  id: `CMP-${9000 + i}`,
  referrer: awaitingReferrers[i % awaitingReferrers.length],
  referrerProfile: i % 2 === 0 ? "Champion" : "Staff",
  status: "Final Payment",
  location: awaitingLocations[i % awaitingLocations.length],
  amount: 5000,
  dateReferred: `${String(2 + (i % 26)).padStart(2, "0")} ${awaitingMonths[i % awaitingMonths.length]} 2026`,
}))
