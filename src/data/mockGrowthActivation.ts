export interface ChannelData {
  name: string
  today: number
  thisWeek: number
  thisMonth: number
  avgPerDay: number
  trend: { value: number; direction: "up" | "down" }
}

export interface GrowthActivationRecord {
  assetId: string
  vehicleModel: string
  plateNumber: string
  customerName: string
  channel: "Retail" | "Enterprise" | "MCP" | "Outright Sale"
  officer: string
  location: string
  activationTime: string
}

export const growthChannels = [
  { name: "Retail", today: 12, thisWeek: 42, thisMonth: 187, avgPerDay: 1.7, trend: { value: 1.1, direction: "down" } },
  { name: "Enterprise", today: 17, thisWeek: 58, thisMonth: 210, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
  { name: "MCP", today: 8, thisWeek: 31, thisMonth: 120, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
  { name: "Outright Sales", today: 4, thisWeek: 14, thisMonth: 52, avgPerDay: 1.7, trend: { value: 1.1, direction: "up" } },
] satisfies ChannelData[]

export const growthTrendData = [
  { date: "Feb 10", Retail: 21, Enterprise: 18, MCP: 14, "Outright Sale": 10 },
  { date: "Feb 12", Retail: 19, Enterprise: 22, MCP: 12, "Outright Sale": 8 },
  { date: "Feb 14", Retail: 24, Enterprise: 20, MCP: 16, "Outright Sale": 11 },
  { date: "Feb 16", Retail: 18, Enterprise: 15, MCP: 10, "Outright Sale": 7 },
  { date: "Feb 18", Retail: 22, Enterprise: 21, MCP: 18, "Outright Sale": 9 },
  { date: "Feb 20", Retail: 20, Enterprise: 19, MCP: 14, "Outright Sale": 12 },
  { date: "Feb 22", Retail: 16, Enterprise: 14, MCP: 11, "Outright Sale": 6 },
  { date: "Feb 25", Retail: 23, Enterprise: 20, MCP: 17, "Outright Sale": 10 },
  { date: "Feb 27", Retail: 21, Enterprise: 22, MCP: 15, "Outright Sale": 8 },
  { date: "Mar 1", Retail: 19, Enterprise: 17, MCP: 12, "Outright Sale": 9 },
  { date: "Mar 2", Retail: 25, Enterprise: 23, MCP: 19, "Outright Sale": 11 },
  { date: "Mar 4", Retail: 22, Enterprise: 18, MCP: 14, "Outright Sale": 7 },
  { date: "Mar 6", Retail: 17, Enterprise: 15, MCP: 10, "Outright Sale": 8 },
  { date: "Mar 7", Retail: 20, Enterprise: 21, MCP: 16, "Outright Sale": 10 },
]

export const growthLocationData = [
  { name: "Lagos", value: 245 },
  { name: "Sagamu", value: 198 },
  { name: "Ibadan", value: 142 },
  { name: "Abeokuta", value: 105 },
  { name: "Sango Ota", value: 72 },
  { name: "Osogbo", value: 88 },
  { name: "Akure", value: 61 },
]

export const mockGrowthActivationRecords = [
  {
    assetId: "AST-4501",
    vehicleModel: "EV-S200",
    plateNumber: "RYD-1122",
    customerName: "Mohammed Ali",
    channel: "Retail",
    officer: "Ahmed Al-Rashid",
    location: "Lagos",
    activationTime: "2026-03-10 09:15",
  },
  {
    assetId: "AST-4502",
    vehicleModel: "EV-X400",
    plateNumber: "JED-3344",
    customerName: "Khalid Enterprises",
    channel: "Enterprise",
    officer: "Sarah Khan",
    location: "Sagamu",
    activationTime: "2026-03-10 10:30",
  },
  {
    assetId: "AST-4503",
    vehicleModel: "EV-T300",
    plateNumber: "DXB-5566",
    customerName: "Fleet Corp MCP",
    channel: "MCP",
    officer: "Omar Hassan",
    location: "Ibadan",
    activationTime: "2026-03-10 11:00",
  },
  {
    assetId: "AST-4504",
    vehicleModel: "EV-C100",
    plateNumber: "CAI-7788",
    customerName: "Nadia Saleh",
    channel: "Retail",
    officer: "Fatima Noor",
    location: "Abeokuta",
    activationTime: "2026-03-10 12:45",
  },
  {
    assetId: "AST-4505",
    vehicleModel: "EV-S200",
    plateNumber: "RYD-9900",
    customerName: "Hassan Trading Co",
    channel: "Enterprise",
    officer: "Ahmed Al-Rashid",
    location: "Lagos",
    activationTime: "2026-03-10 13:20",
  },
  {
    assetId: "AST-4506",
    vehicleModel: "EV-X400",
    plateNumber: "DMM-1234",
    customerName: "Ali Transport",
    channel: "MCP",
    officer: "Yusuf Bakr",
    location: "Sango Ota",
    activationTime: "2026-03-10 14:00",
  },
  {
    assetId: "AST-4507",
    vehicleModel: "EV-T300",
    plateNumber: "JED-5678",
    customerName: "Fahad Motors",
    channel: "Outright Sale",
    officer: "Sarah Khan",
    location: "Sagamu",
    activationTime: "2026-03-10 14:30",
  },
  {
    assetId: "AST-4508",
    vehicleModel: "EV-C100",
    plateNumber: "DXB-2233",
    customerName: "Layla Ibrahim",
    channel: "Retail",
    officer: "Omar Hassan",
    location: "Ibadan",
    activationTime: "2026-03-10 15:10",
  },
] satisfies GrowthActivationRecord[]
