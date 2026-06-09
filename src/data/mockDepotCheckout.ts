export interface DepotCheckoutRecord {
  checkoutId: string
  assetId: string
  vehicleModel: string
  manufacturer: string
  plateNumber: string
  auctionId: string
  buyer: string
  depot: string
  checkoutStage: string
  paymentStatus: string
  scheduledDate: string
  duration: string
}

export const mockDepotCheckoutRecords: DepotCheckoutRecord[] = [
  {
    checkoutId: "CHK-2041",
    assetId: "AST-10293",
    vehicleModel: "Hilux Double Cab",
    manufacturer: "Toyota",
    plateNumber: "KDH 482A",
    auctionId: "AUC-0087",
    buyer: "Westend Motors Ltd",
    depot: "Nairobi",
    checkoutStage: "Pending Checkout",
    paymentStatus: "Cleared",
    scheduledDate: "2026-06-12",
    duration: "2 days",
  },
  {
    checkoutId: "CHK-2042",
    assetId: "AST-10311",
    vehicleModel: "Canter FE85",
    manufacturer: "Mitsubishi",
    plateNumber: "KCT 119B",
    auctionId: "AUC-0087",
    buyer: "Jamal Holdings",
    depot: "Mombasa",
    checkoutStage: "Ready for Release",
    paymentStatus: "Cleared",
    scheduledDate: "2026-06-11",
    duration: "1 day",
  },
  {
    checkoutId: "CHK-2043",
    assetId: "AST-10402",
    vehicleModel: "Probox",
    manufacturer: "Toyota",
    plateNumber: "KDA 776C",
    auctionId: "AUC-0085",
    buyer: "Grace Wanjiru",
    depot: "Nairobi",
    checkoutStage: "On Hold",
    paymentStatus: "Pending",
    scheduledDate: "2026-06-14",
    duration: "5 days",
  },
  {
    checkoutId: "CHK-2044",
    assetId: "AST-10455",
    vehicleModel: "NV350 Caravan",
    manufacturer: "Nissan",
    plateNumber: "KCX 203D",
    auctionId: "AUC-0085",
    buyer: "Coastal Logistics",
    depot: "Mombasa",
    checkoutStage: "Released",
    paymentStatus: "Cleared",
    scheduledDate: "2026-06-08",
    duration: "—",
  },
  {
    checkoutId: "CHK-2045",
    assetId: "AST-10488",
    vehicleModel: "Forward FRR",
    manufacturer: "Isuzu",
    plateNumber: "KDB 901E",
    auctionId: "AUC-0088",
    buyer: "Rift Valley Traders",
    depot: "Kisumu",
    checkoutStage: "Pending Checkout",
    paymentStatus: "Pending",
    scheduledDate: "2026-06-15",
    duration: "3 days",
  },
  {
    checkoutId: "CHK-2046",
    assetId: "AST-10510",
    vehicleModel: "Hiace",
    manufacturer: "Toyota",
    plateNumber: "KDC 558F",
    auctionId: "AUC-0088",
    buyer: "Samuel Otieno",
    depot: "Kisumu",
    checkoutStage: "Ready for Release",
    paymentStatus: "Cleared",
    scheduledDate: "2026-06-13",
    duration: "1 day",
  },
]
