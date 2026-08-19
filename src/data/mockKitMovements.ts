export type KitEventType = "Created" | "Assignment" | "Reassignment"

export interface KitMovementEvent {
  id: string
  date: string
  dateTime: string
  eventType: KitEventType
  fromClient: string | null
  toClient: string | null
  plateChange: string
  chassisKitId: string
  actor: string
  reason: string
}

const CREATED_ACTOR = "M. Sani (Inventory Officer)"
const ASSIGN_ACTOR = "A. Bello (Activation Officer)"
const REASSIGN_ACTOR = "D. Udogie (Fleet Officer)"

const movements: Record<string, KitMovementEvent[]> = {
  // Assigned — never reassigned
  "KIT-30011": [
    {
      id: "KIT-30011-0",
      date: "01 Jun 2026",
      dateTime: "01 Jun 2026, 09:00 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30011",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
    {
      id: "KIT-30011-1",
      date: "12 Jun 2026",
      dateTime: "12 Jun 2026, 10:14 AM",
      eventType: "Assignment",
      fromClient: null,
      toClient: "CH-10234 (Opeyemi Orekoya)",
      plateChange: "— → KJA-119-XL",
      chassisKitId: "KIT-30011",
      actor: ASSIGN_ACTOR,
      reason: "Initial Activation",
    },
  ],
  // Assigned — has been reassigned
  "KIT-30012": [
    {
      id: "KIT-30012-0",
      date: "28 Apr 2026",
      dateTime: "28 Apr 2026, 08:30 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30012",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
    {
      id: "KIT-30012-1",
      date: "15 May 2026",
      dateTime: "15 May 2026, 09:02 AM",
      eventType: "Assignment",
      fromClient: null,
      toClient: "CH-10234 (Opeyemi Orekoya)",
      plateChange: "— → OGN-115-CT",
      chassisKitId: "KIT-30012",
      actor: ASSIGN_ACTOR,
      reason: "Initial Activation",
    },
    {
      id: "KIT-30012-2",
      date: "20 Jul 2026",
      dateTime: "20 Jul 2026, 02:45 PM",
      eventType: "Reassignment",
      fromClient: "CH-10234 (Opeyemi Orekoya)",
      toClient: "CH-11002 (Amina Yusuf)",
      plateChange: "OGN-115-CT → OGN-115-CT",
      chassisKitId: "KIT-30012",
      actor: REASSIGN_ACTOR,
      reason: "Champion Swap",
    },
  ],
  // Assigned — never reassigned
  "KIT-30013": [
    {
      id: "KIT-30013-0",
      date: "05 Jul 2026",
      dateTime: "05 Jul 2026, 10:45 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30013",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
    {
      id: "KIT-30013-1",
      date: "15 Jul 2026",
      dateTime: "15 Jul 2026, 11:30 AM",
      eventType: "Assignment",
      fromClient: null,
      toClient: "CH-10891 (Chidinma Eze)",
      plateChange: "— → ABJ-772-KD",
      chassisKitId: "KIT-30013",
      actor: ASSIGN_ACTOR,
      reason: "Initial Activation",
    },
  ],
  // New
  "KIT-30014": [
    {
      id: "KIT-30014-0",
      date: "10 Jul 2026",
      dateTime: "10 Jul 2026, 08:20 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30014",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
  ],
  // New
  "KIT-30015": [
    {
      id: "KIT-30015-0",
      date: "08 Jul 2026",
      dateTime: "08 Jul 2026, 04:10 PM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30015",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
  ],
  // Assigned — never reassigned
  "KIT-30016": [
    {
      id: "KIT-30016-0",
      date: "12 Jun 2026",
      dateTime: "12 Jun 2026, 09:15 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30016",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
    {
      id: "KIT-30016-1",
      date: "22 Jun 2026",
      dateTime: "22 Jun 2026, 01:05 PM",
      eventType: "Assignment",
      fromClient: null,
      toClient: "CH-11245 (Emeka Obi)",
      plateChange: "— → LND-889-RS",
      chassisKitId: "KIT-30016",
      actor: ASSIGN_ACTOR,
      reason: "Initial Activation",
    },
  ],
  // Assigned — has been reassigned
  "KIT-30017": [
    {
      id: "KIT-30017-0",
      date: "01 Jun 2026",
      dateTime: "01 Jun 2026, 08:00 AM",
      eventType: "Created",
      fromClient: null,
      toClient: null,
      plateChange: "—",
      chassisKitId: "KIT-30017",
      actor: CREATED_ACTOR,
      reason: "Kit Registered",
    },
    {
      id: "KIT-30017-1",
      date: "10 Jun 2026",
      dateTime: "10 Jun 2026, 10:00 AM",
      eventType: "Assignment",
      fromClient: null,
      toClient: "CH-11245 (Emeka Obi)",
      plateChange: "— → LND-330-QZ",
      chassisKitId: "KIT-30017",
      actor: ASSIGN_ACTOR,
      reason: "Initial Activation",
    },
    {
      id: "KIT-30017-2",
      date: "19 Jul 2026",
      dateTime: "19 Jul 2026, 03:22 PM",
      eventType: "Reassignment",
      fromClient: "CH-11245 (Emeka Obi)",
      toClient: "CH-11310 (Tunde Bakare)",
      plateChange: "LND-330-QZ → LND-330-QZ",
      chassisKitId: "KIT-30017",
      actor: REASSIGN_ACTOR,
      reason: "Champion Swap",
    },
  ],
}

export function getKitMovements(kitId: string): KitMovementEvent[] {
  return movements[kitId] ?? []
}
