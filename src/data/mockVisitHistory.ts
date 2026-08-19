type StatusBadgeVariant = "success" | "danger" | "warning" | "info" | "default" | "neutral"

export type VisitType = "City" | "Office" | "Swap Station"
export type VisitStatus = "Active" | "Ended"

export interface VisitRecord {
  id: string
  officerName: string
  type: VisitType
  startTime: string
  endTime: string
  duration: string
  status: VisitStatus
  alerts: number
}

export const visitTypeVariantMap: Record<VisitType, StatusBadgeVariant> = {
  City: "info",
  Office: "warning",
  "Swap Station": "success",
}

export const visitStatusVariantMap: Record<VisitStatus, StatusBadgeVariant> = {
  Active: "success",
  Ended: "neutral",
}

export const visitSummary = {
  geofenceVisits: 256,
  avgSwapStationDuration: "1 hr 20 min",
  avgOfficeDuration: "45 min",
  totalAlerts: 12,
}

export const mockVisitRecords: VisitRecord[] = [
  { id: "vs-1",  officerName: "Daniel Amokachi", type: "City",       startTime: "18 Aug 2026, 08:12", endTime: "—",                    duration: "2 hr 04 min", status: "Active", alerts: 1 },
  { id: "vs-2",  officerName: "Sarah Johnson",   type: "Swap Station"  , startTime: "18 Aug 2026, 07:55", endTime: "18 Aug 2026, 09:20",   duration: "1 hr 25 min", status: "Ended",  alerts: 0 },
  { id: "vs-3",  officerName: "Michael Chen",    type: "Office",      startTime: "18 Aug 2026, 09:03", endTime: "—",                    duration: "1 hr 12 min", status: "Active", alerts: 2 },
  { id: "vs-4",  officerName: "Fatima Bello",    type: "City",        startTime: "18 Aug 2026, 06:40", endTime: "18 Aug 2026, 08:05",   duration: "1 hr 25 min", status: "Ended",  alerts: 0 },
  { id: "vs-5",  officerName: "Chidi Okafor",    type: "Swap Station"  ,  startTime: "18 Aug 2026, 10:15", endTime: "—",                    duration: "38 min",      status: "Active", alerts: 0 },
  { id: "vs-6",  officerName: "Aisha Mohammed",  type: "Office",      startTime: "17 Aug 2026, 14:22", endTime: "17 Aug 2026, 15:07",   duration: "45 min",      status: "Ended",  alerts: 1 },
  { id: "vs-7",  officerName: "Emeka Nwosu",     type: "City",        startTime: "17 Aug 2026, 12:00", endTime: "17 Aug 2026, 14:30",   duration: "2 hr 30 min", status: "Ended",  alerts: 3 },
  { id: "vs-8",  officerName: "Grace Okafor",    type: "Swap Station"  ,  startTime: "17 Aug 2026, 09:48", endTime: "17 Aug 2026, 11:02",   duration: "1 hr 14 min", status: "Ended",  alerts: 0 },
  { id: "vs-9",  officerName: "Tunde Bakare",    type: "Office",      startTime: "18 Aug 2026, 11:05", endTime: "—",                    duration: "22 min",      status: "Active", alerts: 0 },
  { id: "vs-10", officerName: "Ngozi Eze",       type: "City",        startTime: "16 Aug 2026, 16:30", endTime: "16 Aug 2026, 18:12",   duration: "1 hr 42 min", status: "Ended",  alerts: 2 },
  { id: "vs-11", officerName: "Ibrahim Yusuf",   type: "Swap Station"  ,  startTime: "16 Aug 2026, 08:10", endTime: "16 Aug 2026, 09:35",   duration: "1 hr 25 min", status: "Ended",  alerts: 0 },
  { id: "vs-12", officerName: "Funmilayo Ade",   type: "Office",      startTime: "18 Aug 2026, 07:20", endTime: "18 Aug 2026, 08:00",   duration: "40 min",      status: "Ended",  alerts: 1 },
  { id: "vs-13", officerName: "Daniel Amokachi", type: "Swap Station"  ,  startTime: "15 Aug 2026, 13:15", endTime: "15 Aug 2026, 14:48",   duration: "1 hr 33 min", status: "Ended",  alerts: 0 },
  { id: "vs-14", officerName: "Sarah Johnson",   type: "City",        startTime: "18 Aug 2026, 10:40", endTime: "—",                    duration: "1 hr 08 min", status: "Active", alerts: 1 },
  { id: "vs-15", officerName: "Michael Chen",    type: "Office",      startTime: "15 Aug 2026, 09:00", endTime: "15 Aug 2026, 09:52",   duration: "52 min",      status: "Ended",  alerts: 0 },
  { id: "vs-16", officerName: "Fatima Bello",    type: "Swap Station"  ,  startTime: "18 Aug 2026, 06:05", endTime: "18 Aug 2026, 07:40",   duration: "1 hr 35 min", status: "Ended",  alerts: 0 },
]
