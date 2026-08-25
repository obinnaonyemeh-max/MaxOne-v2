import { CITY_DEPOT_OPTIONS } from "./cities"
import type { FilterSection, GenericFilterState } from "@/components/max"
import { mockDisposalRecords } from "./mockDisposal"

export interface AuctionEvent {
  id: string
  title: string
  location: string
  startDate: string
  endDate: string
  vehicles: number
  minBid: string
  status: "Active" | "Upcoming" | "Closed"
}

export interface AuctionVehicle {
  id: string
  vehicleId: string
  plateNumber: string
  makeModel: string
  type: string
  condition: "Excellent" | "Fair" | "Salvage"
  score: number
  location: string
  startingBid: string
}

export const mockAuctionVehicles = [
  { id: "1", vehicleId: "VH-00421", plateNumber: "LND-421-HB", makeModel: "Honda CB125F", type: "2W", condition: "Excellent", score: 87, location: "Lagos Depot", startingBid: "₦150,000" },
  { id: "2", vehicleId: "VH-00398", plateNumber: "LND-398-KA", makeModel: "Bajaj Maxima C", type: "3W", condition: "Fair", score: 61, location: "Lagos Depot", startingBid: "₦100,000" },
  { id: "3", vehicleId: "VH-00289", plateNumber: "ABJ-289-FC", makeModel: "TVS Apache RTR 160", type: "2W", condition: "Excellent", score: 92, location: "Abeokuta Depot", startingBid: "₦180,000" },
  { id: "4", vehicleId: "VH-00315", plateNumber: "LND-315-PQ", makeModel: "Yamaha Crux Rev", type: "2W", condition: "Salvage", score: 34, location: "Lagos Depot", startingBid: "₦30,000" },
  { id: "5", vehicleId: "VH-00276", plateNumber: "ABJ-276-GH", makeModel: "Honda CG 125", type: "2W", condition: "Fair", score: 58, location: "Abeokuta Depot", startingBid: "₦80,000" },
  { id: "6", vehicleId: "VH-00251", plateNumber: "RIV-251-PH", makeModel: "Keke Napep 200", type: "3W", condition: "Fair", score: 55, location: "Sango Ota Depot", startingBid: "₦90,000" },
] satisfies AuctionVehicle[]

export const auctionVehicleFilterSections: FilterSection[] = [
  {
    id: "condition",
    title: "Condition",
    defaultExpanded: true,
    options: [
      { value: "Excellent", label: "Excellent" },
      { value: "Fair", label: "Fair" },
      { value: "Salvage", label: "Salvage" },
    ],
  },
  {
    id: "type",
    title: "Type",
    options: [
      { value: "2W", label: "2 Wheeler" },
      { value: "3W", label: "3 Wheeler" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_DEPOT_OPTIONS,
  },
]

export const defaultAuctionVehicleFilters: GenericFilterState = {
  condition: [],
  type: [],
  location: [],
}

export interface AllocationVehicle {
  id: string
  vehicleId: string
  plateNumber: string
  makeModel: string
  location: string
  type: string
  auctionStatus: "Available" | "Sold" | "Reserved"
  bids: number
  winningBid: string | null
  leadingBidId?: string
}

export interface AuctionAllocation {
  eventId: string
  bidsPlaced: number
  uniqueBidders: number
  endsInSeconds: number
  vehicles: AllocationVehicle[]
}

export const allocationFilterSections: FilterSection[] = [
  {
    id: "auctionStatus",
    title: "Auction Status",
    defaultExpanded: true,
    options: [
      { value: "Available", label: "Available" },
      { value: "Sold", label: "Sold" },
      { value: "Reserved", label: "Reserved" },
    ],
  },
  {
    id: "type",
    title: "Type",
    options: [
      { value: "2W", label: "2 Wheeler" },
      { value: "3W", label: "3 Wheeler" },
    ],
  },
  {
    id: "location",
    title: "Location",
    options: CITY_DEPOT_OPTIONS,
  },
]

export const defaultAllocationFilters: GenericFilterState = {
  auctionStatus: [],
  type: [],
  location: [],
}

export const mockAuctionAllocations: AuctionAllocation[] = [
  {
    eventId: "1",
    bidsPlaced: 47,
    uniqueBidders: 18,
    endsInSeconds: 9606,
    vehicles: [
      { id: "1", vehicleId: "VH-00421", plateNumber: "LND-421-HB", makeModel: "Honda CB125F", location: "Lagos Depot", type: "2W", auctionStatus: "Available", bids: 7, winningBid: "₦210,000", leadingBidId: "BID-00891" },
      { id: "2", vehicleId: "VH-00398", plateNumber: "LND-398-KA", makeModel: "Bajaj Maxima C", location: "Lagos Depot", type: "3W", auctionStatus: "Available", bids: 4, winningBid: "₦165,000", leadingBidId: "BID-00742" },
      { id: "3", vehicleId: "VH-00289", plateNumber: "ABJ-289-FC", makeModel: "TVS Apache RTR 160", location: "Abeokuta Depot", type: "2W", auctionStatus: "Sold", bids: 9, winningBid: "₦255,000", leadingBidId: "BID-00915" },
      { id: "4", vehicleId: "VH-00315", plateNumber: "LND-315-PQ", makeModel: "Yamaha Crux Rev", location: "Lagos Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "5", vehicleId: "VH-00276", plateNumber: "ABJ-276-GH", makeModel: "Honda CG 125", location: "Abeokuta Depot", type: "2W", auctionStatus: "Available", bids: 5, winningBid: "₦135,000", leadingBidId: "BID-00688" },
      { id: "6", vehicleId: "VH-00251", plateNumber: "RIV-251-PH", makeModel: "Keke Napep 200", location: "Sango Ota Depot", type: "3W", auctionStatus: "Reserved", bids: 3, winningBid: "₦120,000", leadingBidId: "BID-00574" },
    ],
  },
  {
    eventId: "2",
    bidsPlaced: 0,
    uniqueBidders: 0,
    endsInSeconds: 0,
    vehicles: [
      { id: "1", vehicleId: "VH-00512", plateNumber: "ABJ-512-LM", makeModel: "Honda CB125F", location: "Abeokuta Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "2", vehicleId: "VH-00488", plateNumber: "ABJ-488-NP", makeModel: "Bajaj Boxer", location: "Abeokuta Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "3", vehicleId: "VH-00455", plateNumber: "ABJ-455-QR", makeModel: "Bajaj Maxima C", location: "Abeokuta Depot", type: "3W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "4", vehicleId: "VH-00432", plateNumber: "ABJ-432-ST", makeModel: "TVS Apache RTR 160", location: "Abeokuta Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "5", vehicleId: "VH-00401", plateNumber: "ABJ-401-UV", makeModel: "Yamaha Crux Rev", location: "Abeokuta Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
    ],
  },
  {
    eventId: "3",
    bidsPlaced: 0,
    uniqueBidders: 0,
    endsInSeconds: 0,
    vehicles: [
      { id: "1", vehicleId: "VH-00321", plateNumber: "RIV-321-AB", makeModel: "Keke Napep 200", location: "Sango Ota Depot", type: "3W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "2", vehicleId: "VH-00298", plateNumber: "RIV-298-CD", makeModel: "Honda CG 125", location: "Sango Ota Depot", type: "2W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "3", vehicleId: "VH-00277", plateNumber: "RIV-277-EF", makeModel: "Bajaj Maxima C", location: "Sango Ota Depot", type: "3W", auctionStatus: "Available", bids: 0, winningBid: null },
      { id: "4", vehicleId: "VH-00254", plateNumber: "RIV-254-GH", makeModel: "TVS King 3W", location: "Sango Ota Depot", type: "3W", auctionStatus: "Available", bids: 0, winningBid: null },
    ],
  },
  {
    eventId: "4",
    bidsPlaced: 62,
    uniqueBidders: 24,
    endsInSeconds: 0,
    vehicles: [
      { id: "1", vehicleId: "VH-00188", plateNumber: "LND-188-RT", makeModel: "Honda CB125F", location: "Lagos Depot", type: "2W", auctionStatus: "Sold", bids: 11, winningBid: "₦240,000", leadingBidId: "BID-01120" },
      { id: "2", vehicleId: "VH-00203", plateNumber: "LND-203-MN", makeModel: "Bajaj Boxer", location: "Lagos Depot", type: "2W", auctionStatus: "Sold", bids: 8, winningBid: "₦195,000", leadingBidId: "BID-00803" },
      { id: "3", vehicleId: "VH-00167", plateNumber: "LND-167-WX", makeModel: "TVS King 3W", location: "Lagos Depot", type: "3W", auctionStatus: "Reserved", bids: 2, winningBid: "₦150,000", leadingBidId: "BID-00667" },
      { id: "4", vehicleId: "VH-00210", plateNumber: "LND-210-ZA", makeModel: "Yamaha Crux Rev", location: "Lagos Depot", type: "2W", auctionStatus: "Sold", bids: 6, winningBid: "₦175,000", leadingBidId: "BID-00759" },
    ],
  },
]

export interface AllocatedVehicle {
  id: string
  vehicleId: string
  plateNumber: string
  makeModel: string
  location: string
  type: string
  winner: string
  winningBid: string
  payment: "Paid" | "Awaiting"
  status: "Sold" | "Secured"
  action: "Checkout" | "Reallocate" | "Collected"
}

export interface UnallocatedVehicle {
  id: string
  vehicleId: string
  plateNumber: string
  makeModel: string
  location: string
  type: string
  reason: string
}

export interface AuctionClosedResult {
  eventId: string
  allocated: number
  unallocated: number
  totalRevenue: string
  fillRate: number
  allocatedVehicles: AllocatedVehicle[]
  unallocatedVehicles: UnallocatedVehicle[]
}

export const mockAuctionClosedResults: AuctionClosedResult[] = [
  {
    eventId: "4",
    allocated: 3,
    unallocated: 1,
    totalRevenue: "₦545K",
    fillRate: 75,
    allocatedVehicles: [
      { id: "1", vehicleId: "VH-00421", plateNumber: "LND-421-HB", makeModel: "Honda CB125F", location: "Lagos Depot", type: "2W", winner: "BID-00891", winningBid: "₦190,000", payment: "Paid", status: "Sold", action: "Checkout" },
      { id: "2", vehicleId: "VH-00398", plateNumber: "LND-398-KA", makeModel: "Bajaj Maxima C", location: "Lagos Depot", type: "3W", winner: "BID-00445", winningBid: "₦145,000", payment: "Awaiting", status: "Secured", action: "Reallocate" },
      { id: "3", vehicleId: "VH-00289", plateNumber: "ABJ-289-FC", makeModel: "TVS Apache RTR", location: "Abeokuta Depot", type: "2W", winner: "BID-00612", winningBid: "₦210,000", payment: "Paid", status: "Sold", action: "Collected" },
    ],
    unallocatedVehicles: [
      { id: "1", vehicleId: "VH-00315", plateNumber: "LND-315-PQ", makeModel: "Yamaha Crux Rev", location: "Lagos Depot", type: "2W", reason: "No bids placed" },
    ],
  },
]

export const mockAuctionEvents = [
  { id: "1", title: "Lagos Disposal Run #14", location: "Lagos Depot", startDate: "10 Jun 2026", endDate: "12 Jun 2026", vehicles: 24, minBid: "₦100,000", status: "Active" },
  { id: "2", title: "Abeokuta Fleet Clear Q2", location: "Abeokuta Depot", startDate: "20 Jun 2026", endDate: "22 Jun 2026", vehicles: 18, minBid: "₦80,000", status: "Upcoming" },
  { id: "3", title: "Sango Ota Cycle 3 Disposal", location: "Sango Ota Depot", startDate: "25 Jun 2026", endDate: "27 Jun 2026", vehicles: 9, minBid: "₦60,000", status: "Upcoming" },
  { id: "4", title: "Lagos Disposal Run #13", location: "Lagos Depot", startDate: "01 Jun 2026", endDate: "03 Jun 2026", vehicles: 31, minBid: "₦100,000", status: "Closed" },
] satisfies AuctionEvent[]

export type AuctionVehicleStatusVariant =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "default"
  | "neutral"

export interface AuctionVehicleDetail {
  vehicleId: string
  year: number
  makeModel: string
  plateNumber: string
  type: string
  status: string
  statusVariant: AuctionVehicleStatusVariant
  photos: string[]
  vin: string
  location: string
  fuel: string
  bodyStyle: string
  engine: string
  transmission: string
  colour: string
  odometer: string
  lossType: string
  titleStatus: string
  keyStatus: string
  condition: string
  conditionScore: number
  description: string
  currentBid: string
  numberOfBids: number
  minIncrement: string
  bidEndsInSeconds: number
  vamsStatus: string
  acv: string
  seller: string
  bidHistory: BidHistoryEntry[]
  conditionParts: ConditionPart[]
}

export type PartCondition = "GOOD" | "FAIR" | "POOR" | "N/A"

export interface ConditionPart {
  id: string
  name: string
  condition: PartCondition
  note: string
}

const auctionConditionParts: ConditionPart[] = [
  { id: "1", name: "Engine", condition: "GOOD", note: "No leaks, starts first kick" },
  { id: "2", name: "Transmission", condition: "GOOD", note: "All gears engage cleanly" },
  { id: "3", name: "Frame / Chassis", condition: "GOOD", note: "No cracks or bends" },
  { id: "4", name: "Front Suspension", condition: "GOOD", note: "Forks in good condition" },
  { id: "5", name: "Rear Suspension", condition: "FAIR", note: "Slight play in rear shock" },
  { id: "6", name: "Front Brake", condition: "GOOD", note: "Pads at 70%" },
  { id: "7", name: "Rear Brake", condition: "GOOD", note: "Recently serviced" },
  { id: "8", name: "Tyres", condition: "FAIR", note: "60% tread remaining" },
  { id: "9", name: "Fuel Tank", condition: "GOOD", note: "No rust, no leaks" },
  { id: "10", name: "Exhaust", condition: "GOOD", note: "No cracks or excessive rust" },
  { id: "11", name: "Electrics / Wiring", condition: "GOOD", note: "All lights functional" },
  { id: "12", name: "Instruments", condition: "GOOD", note: "Speedo and indicators working" },
  { id: "13", name: "Body / Fairings", condition: "FAIR", note: "Minor scratches on left fairing" },
  { id: "14", name: "Chain & Sprocket", condition: "GOOD", note: "Within service limit" },
  { id: "15", name: "Battery", condition: "GOOD", note: "Holds charge" },
]

export interface BidHistoryEntry {
  id: string
  bidderId: string
  bidAmount: string
  time: string
  status: "Leading" | "Outbid"
}

const auctionBidHistory: BidHistoryEntry[] = [
  { id: "1", bidderId: "BID-00891", bidAmount: "₦185,000", time: "11 Jun 10:33", status: "Leading" },
  { id: "2", bidderId: "BID-00445", bidAmount: "₦179,000", time: "11 Jun 08:20", status: "Outbid" },
  { id: "3", bidderId: "BID-00234", bidAmount: "₦172,000", time: "10 Jun 14:55", status: "Outbid" },
  { id: "4", bidderId: "BID-00612", bidAmount: "₦168,000", time: "10 Jun 13:27", status: "Outbid" },
  { id: "5", bidderId: "BID-00445", bidAmount: "₦162,000", time: "10 Jun 11:02", status: "Outbid" },
  { id: "6", bidderId: "BID-00891", bidAmount: "₦155,000", time: "10 Jun 09:41", status: "Outbid" },
  { id: "7", bidderId: "BID-00234", bidAmount: "₦150,000", time: "10 Jun 09:14", status: "Outbid" },
]

const auctionVehiclePhotos = [
  "/images/auction_photo_1.jpg",
  "/images/auction_photo_2.jpg",
  "/images/auction_photo_3.jpg",
]

const auctionVehicleYears: Record<string, number> = {
  "VH-00421": 2024,
  "VH-00398": 2023,
  "VH-00289": 2024,
  "VH-00315": 2022,
}

const auctionStatusVariant: Record<string, AuctionVehicleStatusVariant> = {
  Available: "success",
  Sold: "info",
  Secured: "warning",
  Reserved: "warning",
  Unallocated: "default",
}

export function getAuctionVehicleDetail(vehicleId: string): AuctionVehicleDetail | null {
  const base = (
    makeModel: string,
    plateNumber: string,
    type: string,
    status: string,
    location: string
  ): AuctionVehicleDetail => ({
    vehicleId,
    year: auctionVehicleYears[vehicleId] ?? 2024,
    makeModel,
    plateNumber,
    type,
    status,
    statusVariant: auctionStatusVariant[status] ?? "default",
    photos: auctionVehiclePhotos,
    vin: "JH2PC40J1HM200012",
    location,
    fuel: "ICE",
    bodyStyle: "Sport",
    engine: "125cc Single",
    transmission: "Manual",
    colour: "Red",
    odometer: "48,200 km",
    lossType: "Wear & Tear",
    titleStatus: "Clear",
    keyStatus: "Present",
    condition: "Excellent",
    conditionScore: 87,
    description:
      `Well-maintained ${auctionVehicleYears[vehicleId] ?? 2024} ${makeModel} used for last-mile delivery. Minor cosmetic scratches on left fairing. Engine and transmission in excellent condition. All service records available. Tyres at 60% tread. Brakes recently serviced.`,
    currentBid: "₦185,000",
    numberOfBids: 7,
    minIncrement: "₦5,000",
    bidEndsInSeconds: 52328,
    vamsStatus: "Pending Auction",
    acv: "₦210,000",
    seller: "MAX Fleet Lagos",
    bidHistory: auctionBidHistory,
    conditionParts: auctionConditionParts,
  })

  for (const allocation of mockAuctionAllocations) {
    const v = allocation.vehicles.find((x) => x.vehicleId === vehicleId)
    if (v) return base(v.makeModel, v.plateNumber, v.type, v.auctionStatus, v.location)
  }

  for (const result of mockAuctionClosedResults) {
    const a = result.allocatedVehicles.find((x) => x.vehicleId === vehicleId)
    if (a) return base(a.makeModel, a.plateNumber, a.type, a.status, a.location)
    const u = result.unallocatedVehicles.find((x) => x.vehicleId === vehicleId)
    if (u) return base(u.makeModel, u.plateNumber, u.type, "Unallocated", u.location)
  }

  const disposal = mockDisposalRecords.find((d) => d.assetId === vehicleId)
  if (disposal) {
    const status = disposal.disposalStage === "Auctioned – Awaiting Pickup" ? "Sold" : "Available"
    return base(disposal.vehicleModel, disposal.plateNumber, "2W", status, disposal.location)
  }

  return null
}
