// Mock data for Portfolio > Collections > All Collections.
// Portfolio-at-Risk (PAR) view: contracts with days-past-due and outstanding balance.

export type VehiclePowertrain = "EV" | "ICE"
export type CollectionVehicleType = "Two-Wheeler" | "Three-Wheeler" | "Four-Wheeler"
export type DpdBucket =
  | "Early Arrears · 1–2 DPD"
  | "3–15 DPD"
  | "Watchlist · 16–30 DPD"
  | "31–60 DPD"
  | "61–90 DPD"
  | "91–180 DPD"
  | "180+ DPD"

export interface CollectionContract {
  id: string
  contract: string
  champion: string
  location: string
  vehicle: VehiclePowertrain
  vehicleType: CollectionVehicleType
  dpd: number
  bucket: DpdBucket
  outstanding: number // in Naira
}

export interface ParBucketStat {
  label: DpdBucket
  count: number
  amount: number // in Naira
  share: number // percentage of portfolio
}

// Headline figures shown in the stat-card row.
export const collectionsTotal = {
  amount: 45_700_000,
  contracts: 324,
}

// One card per DPD bucket in the collections taxonomy.
export const parBuckets: ParBucketStat[] = [
  { label: "Early Arrears · 1–2 DPD", count: 40, amount: 5_600_000, share: 12.3 },
  { label: "3–15 DPD", count: 30, amount: 4_200_000, share: 9.2 },
  { label: "Watchlist · 16–30 DPD", count: 25, amount: 3_500_000, share: 7.7 },
  { label: "31–60 DPD", count: 20, amount: 3_000_000, share: 6.6 },
  { label: "61–90 DPD", count: 30, amount: 4_580_600, share: 10.1 },
  { label: "91–180 DPD", count: 35, amount: 4_420_000, share: 9.6 },
  { label: "180+ DPD", count: 4, amount: 619_400, share: 1.4 },
]

export const mockCollectionContracts: CollectionContract[] = [
  { id: "c-1", contract: "CT-90034", champion: "Ifeoma U.", location: "Kumasi", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 333, bucket: "180+ DPD", outstanding: 170_900 },
  { id: "c-2", contract: "CT-90207", champion: "Aisha K.", location: "Abuja", vehicle: "ICE", vehicleType: "Two-Wheeler", dpd: 305, bucket: "180+ DPD", outstanding: 97_000 },
  { id: "c-3", contract: "CT-90186", champion: "Chinedu I.", location: "Kaduna", vehicle: "EV", vehicleType: "Four-Wheeler", dpd: 293, bucket: "180+ DPD", outstanding: 135_400 },
  { id: "c-4", contract: "CT-90160", champion: "Adaeze O.", location: "Kaduna", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 283, bucket: "180+ DPD", outstanding: 216_100 },
  { id: "c-5", contract: "CT-90212", champion: "Amina R.", location: "Nairobi", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 179, bucket: "91–180 DPD", outstanding: 322_800 },
  { id: "c-6", contract: "CT-90140", champion: "Adaeze O.", location: "Lagos", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 173, bucket: "91–180 DPD", outstanding: 257_400 },
  { id: "c-7", contract: "CT-90063", champion: "Zainab B.", location: "Ibadan", vehicle: "EV", vehicleType: "Four-Wheeler", dpd: 169, bucket: "91–180 DPD", outstanding: 31_000 },
  { id: "c-8", contract: "CT-90131", champion: "Tunde S.", location: "Kaduna", vehicle: "EV", vehicleType: "Four-Wheeler", dpd: 157, bucket: "91–180 DPD", outstanding: 40_800 },
  { id: "c-9", contract: "CT-90193", champion: "Kojo D.", location: "Kano", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 146, bucket: "91–180 DPD", outstanding: 259_900 },
  { id: "c-10", contract: "CT-90039", champion: "Rashida M.", location: "Lagos", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 137, bucket: "91–180 DPD", outstanding: 154_500 },
  { id: "c-11", contract: "CT-90104", champion: "Peter O.", location: "Accra", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 127, bucket: "91–180 DPD", outstanding: 232_400 },
  { id: "c-12", contract: "CT-90118", champion: "Mensah A.", location: "Kano", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 123, bucket: "91–180 DPD", outstanding: 240_400 },
  { id: "c-13", contract: "CT-90084", champion: "Peter O.", location: "Nairobi", vehicle: "EV", vehicleType: "Three-Wheeler", dpd: 112, bucket: "91–180 DPD", outstanding: 232_800 },
  { id: "c-14", contract: "CT-90156", champion: "Halima Y.", location: "Kaduna", vehicle: "ICE", vehicleType: "Two-Wheeler", dpd: 112, bucket: "91–180 DPD", outstanding: 52_800 },
  { id: "c-15", contract: "CT-90210", champion: "Ngozi C.", location: "Accra", vehicle: "ICE", vehicleType: "Two-Wheeler", dpd: 105, bucket: "91–180 DPD", outstanding: 89_300 },
  { id: "c-16", contract: "CTR-20457", champion: "Zainab Njoku", location: "Jinja", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 88, bucket: "61–90 DPD", outstanding: 1_400 },
  { id: "c-17", contract: "CTR-20482", champion: "Chuka Osei", location: "Port Harcourt", vehicle: "ICE", vehicleType: "Three-Wheeler", dpd: 85, bucket: "61–90 DPD", outstanding: 2_300 },
  { id: "c-18", contract: "CTR-20491", champion: "Fatima B.", location: "Abuja", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 74, bucket: "61–90 DPD", outstanding: 63_500 },
  { id: "c-19", contract: "CTR-20388", champion: "Emeka N.", location: "Enugu", vehicle: "EV", vehicleType: "Three-Wheeler", dpd: 63, bucket: "61–90 DPD", outstanding: 118_700 },
  { id: "c-20", contract: "CTR-20301", champion: "Segun A.", location: "Lagos", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 52, bucket: "31–60 DPD", outstanding: 44_900 },
  { id: "c-21", contract: "CTR-20276", champion: "Halima Y.", location: "Kano", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 41, bucket: "31–60 DPD", outstanding: 77_200 },
  { id: "c-22", contract: "CTR-20194", champion: "Kelechi E.", location: "Onitsha", vehicle: "ICE", vehicleType: "Three-Wheeler", dpd: 28, bucket: "Watchlist · 16–30 DPD", outstanding: 21_600 },
  { id: "c-23", contract: "CTR-20155", champion: "Aisha K.", location: "Ibadan", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 19, bucket: "Watchlist · 16–30 DPD", outstanding: 15_050 },
  { id: "c-24", contract: "CTR-20098", champion: "Musa I.", location: "Kaduna", vehicle: "ICE", vehicleType: "Four-Wheeler", dpd: 9, bucket: "3–15 DPD", outstanding: 8_300 },
  { id: "c-25", contract: "CTR-20071", champion: "Grace A.", location: "Lagos", vehicle: "EV", vehicleType: "Two-Wheeler", dpd: 2, bucket: "Early Arrears · 1–2 DPD", outstanding: 4_200 },
]
