export interface AuctionForm {
  title: string
  location: string
  startDate?: Date
  endDate?: Date
  minBid: string
}

export type AuctionStep = 1 | 2 | 3

export const auctionSteps = [
  { number: 1, label: "Auction Details" },
  { number: 2, label: "Assign Vehicles" },
  { number: 3, label: "Review & Publish" },
] as const
