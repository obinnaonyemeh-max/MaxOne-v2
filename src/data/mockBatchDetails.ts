import type { TimelineEntryData } from "@/components/max"

export interface BatchDetails {
  id: string
  batchId: string
  stage: string
  stageVariant: "success" | "warning" | "info" | "danger" | "default"
  batchInfo: {
    oem: string
    model: string
    trim: string
    quantity: number
    destinationCountry: string
    destinationCity: string
  }
  financials: {
    paymentReference: string
    invoicePoReference: string
  }
  shipping: {
    containerNumber: string
    shippingLine: string
    portOfArrival: string
    expectedDeliveryDate: string
  }
  createdDate: string
  notes: string
  stageHistory: TimelineEntryData[]
}

export const mockBatchDetails: Record<string, BatchDetails> = {
  "1": {
    id: "1",
    batchId: "BATCH-12-3056",
    stage: "At Port",
    stageVariant: "warning",
    batchInfo: {
      oem: "TailG",
      model: "Jidi",
      trim: "V1",
      quantity: 20000,
      destinationCountry: "Ghana",
      destinationCity: "Accra",
    },
    financials: {
      paymentReference: "PAY-2026-TG-3056",
      invoicePoReference: "INV-2026-3056",
    },
    shipping: {
      containerNumber: "MSKU-4829173",
      shippingLine: "Maersk",
      portOfArrival: "Tema Port",
      expectedDeliveryDate: "15 Jun 2026",
    },
    createdDate: "3/17/2026",
    notes: "Priority shipment for Ghana expansion.",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "At Port",
        statusVariant: "warning",
        description: {
          template: "Batch arrived at {location} and is awaiting {action}",
          highlights: {
            location: "Tema Port",
            action: "customs clearance",
          },
        },
        actor: {
          action: "Updated by",
          name: "Logistics Team",
        },
        duration: {
          range: "10 Mar - Current",
          total: "8 days",
        },
      },
      {
        id: "sh2",
        date: "Feb 2026",
        status: "In Transit",
        statusVariant: "info",
        description: {
          template: "Batch shipped from {origin} via {carrier}",
          highlights: {
            origin: "Shanghai",
            carrier: "Maersk Line",
          },
        },
        actor: {
          action: "Shipped by",
          name: "TailG Logistics",
        },
        duration: {
          range: "15 Feb - 10 Mar",
          total: "23 days",
        },
      },
      {
        id: "sh3",
        date: "Jan 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "20,000",
            model: "Jidi",
          },
        },
        actor: {
          action: "Initiated by",
          name: "TailG Factory",
        },
        duration: {
          range: "5 Jan - 15 Feb",
          total: "41 days",
        },
      },
    ],
  },
  "2": {
    id: "2",
    batchId: "BATCH-0990",
    stage: "Identifier Upload",
    stageVariant: "info",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon",
      trim: "Ekon V2",
      quantity: 5000,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-SP-0990",
      invoicePoReference: "INV-2026-0990",
    },
    shipping: {
      containerNumber: "CSQU-7731924",
      shippingLine: "CMA CGM",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "1 Jul 2026",
    },
    createdDate: "2/15/2026",
    notes: "",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "Identifier Upload",
        statusVariant: "info",
        description: {
          template: "VIN and identifier data being uploaded for {quantity} units",
          highlights: {
            quantity: "5,000",
          },
        },
        actor: {
          action: "Updated by",
          name: "Data Team",
        },
        duration: {
          range: "12 Mar - Current",
          total: "6 days",
        },
      },
      {
        id: "sh2",
        date: "Feb 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "5,000",
            model: "Ekon",
          },
        },
        actor: {
          action: "Initiated by",
          name: "Spiro Factory",
        },
        duration: {
          range: "1 Feb - 12 Mar",
          total: "39 days",
        },
      },
    ],
  },
  "3": {
    id: "3",
    batchId: "BATCH-2026-003",
    stage: "In Transit",
    stageVariant: "info",
    batchInfo: {
      oem: "King",
      model: "MAX M4",
      trim: "MM4",
      quantity: 2500,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-KG-003",
      invoicePoReference: "INV-2026-003",
    },
    shipping: {
      containerNumber: "TCLU-5582910",
      shippingLine: "MSC",
      portOfArrival: "Tin Can Port",
      expectedDeliveryDate: "20 Jun 2026",
    },
    createdDate: "1/10/2026",
    notes: "Standard delivery for Lagos operations.",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "In Transit",
        statusVariant: "info",
        description: {
          template: "Batch shipped from {origin} via {carrier}",
          highlights: {
            origin: "Shenzhen",
            carrier: "MSC",
          },
        },
        actor: {
          action: "Shipped by",
          name: "King Logistics",
        },
        duration: {
          range: "5 Mar - Current",
          total: "13 days",
        },
      },
      {
        id: "sh2",
        date: "Feb 2026",
        status: "Identifier Upload",
        statusVariant: "info",
        description: {
          template: "VIN and identifier data uploaded for {quantity} units",
          highlights: {
            quantity: "2,500",
          },
        },
        actor: {
          action: "Completed by",
          name: "Data Team",
        },
        duration: {
          range: "20 Feb - 5 Mar",
          total: "13 days",
        },
      },
      {
        id: "sh3",
        date: "Jan 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "2,500",
            model: "MAX M4",
          },
        },
        actor: {
          action: "Initiated by",
          name: "King Factory",
        },
        duration: {
          range: "10 Jan - 20 Feb",
          total: "41 days",
        },
      },
    ],
  },
  "4": {
    id: "4",
    batchId: "BATCH-2026-002",
    stage: "Ready for Activation",
    stageVariant: "success",
    batchInfo: {
      oem: "TailG",
      model: "Jidi",
      trim: "V1",
      quantity: 400,
      destinationCountry: "Ghana",
      destinationCity: "Accra",
    },
    financials: {
      paymentReference: "PAY-2026-TG-002",
      invoicePoReference: "INV-2026-002",
    },
    shipping: {
      containerNumber: "MSKU-1123847",
      shippingLine: "Maersk",
      portOfArrival: "Tema Port",
      expectedDeliveryDate: "1 Mar 2026",
    },
    createdDate: "2/28/2026",
    notes: "",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "Ready for Activation",
        statusVariant: "success",
        description: {
          template: "Batch QA complete — {quantity} units ready for activation",
          highlights: {
            quantity: "400",
          },
        },
        actor: {
          action: "Approved by",
          name: "QA Team",
        },
        duration: {
          range: "15 Mar - Current",
          total: "3 days",
        },
      },
    ],
  },
  "5": {
    id: "5",
    batchId: "BATCH-2026-001",
    stage: "Identifier Upload",
    stageVariant: "info",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon",
      trim: "Ekon V2",
      quantity: 1000,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-SP-001",
      invoicePoReference: "INV-2026-001",
    },
    shipping: {
      containerNumber: "CSQU-9945261",
      shippingLine: "CMA CGM",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "28 Jun 2026",
    },
    createdDate: "3/1/2026",
    notes: "",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "Identifier Upload",
        statusVariant: "info",
        description: {
          template: "VIN and identifier data being uploaded for {quantity} units",
          highlights: {
            quantity: "1,000",
          },
        },
        actor: {
          action: "Updated by",
          name: "Data Team",
        },
        duration: {
          range: "14 Mar - Current",
          total: "4 days",
        },
      },
    ],
  },
  "6": {
    id: "6",
    batchId: "BATCH-2026-006",
    stage: "In Production",
    stageVariant: "default",
    batchInfo: {
      oem: "King",
      model: "MAX M4",
      trim: "MM4",
      quantity: 3000,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-KG-006",
      invoicePoReference: "INV-2026-006",
    },
    shipping: {
      containerNumber: "-",
      shippingLine: "-",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "15 Jul 2026",
    },
    createdDate: "3/10/2026",
    notes: "New production run for Lagos fleet.",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "3,000",
            model: "MAX M4",
          },
        },
        actor: {
          action: "Initiated by",
          name: "King Factory",
        },
        duration: {
          range: "10 Mar - Current",
          total: "8 days",
        },
      },
    ],
  },
  "7": {
    id: "7",
    batchId: "BATCH-2026-007",
    stage: "Clearing",
    stageVariant: "warning",
    batchInfo: {
      oem: "TailG",
      model: "Jidi",
      trim: "V1",
      quantity: 1500,
      destinationCountry: "Ghana",
      destinationCity: "Accra",
    },
    financials: {
      paymentReference: "PAY-2026-TG-007",
      invoicePoReference: "INV-2026-007",
    },
    shipping: {
      containerNumber: "MSKU-6637281",
      shippingLine: "Maersk",
      portOfArrival: "Tema Port",
      expectedDeliveryDate: "1 May 2026",
    },
    createdDate: "1/20/2026",
    notes: "",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "Clearing",
        statusVariant: "warning",
        description: {
          template: "Batch undergoing customs clearance at {location}",
          highlights: {
            location: "Tema Port",
          },
        },
        actor: {
          action: "Updated by",
          name: "Clearing Agent",
        },
        duration: {
          range: "14 Mar - Current",
          total: "4 days",
        },
      },
      {
        id: "sh2",
        date: "Mar 2026",
        status: "At Port",
        statusVariant: "warning",
        description: {
          template: "Batch arrived at {location}",
          highlights: {
            location: "Tema Port",
          },
        },
        actor: {
          action: "Updated by",
          name: "Logistics Team",
        },
        duration: {
          range: "10 Mar - 14 Mar",
          total: "4 days",
        },
      },
      {
        id: "sh3",
        date: "Feb 2026",
        status: "In Transit",
        statusVariant: "info",
        description: {
          template: "Batch shipped from {origin} via {carrier}",
          highlights: {
            origin: "Shanghai",
            carrier: "Maersk Line",
          },
        },
        actor: {
          action: "Shipped by",
          name: "TailG Logistics",
        },
        duration: {
          range: "10 Feb - 10 Mar",
          total: "28 days",
        },
      },
      {
        id: "sh4",
        date: "Jan 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "1,500",
            model: "Jidi",
          },
        },
        actor: {
          action: "Initiated by",
          name: "TailG Factory",
        },
        duration: {
          range: "20 Jan - 10 Feb",
          total: "21 days",
        },
      },
    ],
  },
  "8": {
    id: "8",
    batchId: "BATCH-2026-008",
    stage: "Warehouse QA",
    stageVariant: "default",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon",
      trim: "Ekon V2",
      quantity: 800,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-SP-008",
      invoicePoReference: "INV-2026-008",
    },
    shipping: {
      containerNumber: "CSQU-3348192",
      shippingLine: "CMA CGM",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "15 Apr 2026",
    },
    createdDate: "12/15/2025",
    notes: "QA inspection in progress.",
    stageHistory: [
      {
        id: "sh1",
        date: "Mar 2026",
        status: "Warehouse QA",
        statusVariant: "default",
        description: {
          template: "Quality inspection in progress for {quantity} units",
          highlights: {
            quantity: "800",
          },
        },
        actor: {
          action: "Updated by",
          name: "QA Team",
        },
        duration: {
          range: "15 Mar - Current",
          total: "3 days",
        },
      },
      {
        id: "sh2",
        date: "Mar 2026",
        status: "Clearing",
        statusVariant: "warning",
        description: {
          template: "Customs clearance completed at {location}",
          highlights: {
            location: "Apapa Port",
          },
        },
        actor: {
          action: "Completed by",
          name: "Clearing Agent",
        },
        duration: {
          range: "10 Mar - 15 Mar",
          total: "5 days",
        },
      },
      {
        id: "sh3",
        date: "Mar 2026",
        status: "At Port",
        statusVariant: "warning",
        description: {
          template: "Batch arrived at {location}",
          highlights: {
            location: "Apapa Port",
          },
        },
        actor: {
          action: "Updated by",
          name: "Logistics Team",
        },
        duration: {
          range: "5 Mar - 10 Mar",
          total: "5 days",
        },
      },
      {
        id: "sh4",
        date: "Feb 2026",
        status: "In Transit",
        statusVariant: "info",
        description: {
          template: "Batch shipped from {origin} via {carrier}",
          highlights: {
            origin: "Guangzhou",
            carrier: "CMA CGM",
          },
        },
        actor: {
          action: "Shipped by",
          name: "Spiro Logistics",
        },
        duration: {
          range: "10 Feb - 5 Mar",
          total: "23 days",
        },
      },
      {
        id: "sh5",
        date: "Jan 2026",
        status: "In Production",
        statusVariant: "default",
        description: {
          template: "Production started for {quantity} units of {model}",
          highlights: {
            quantity: "800",
            model: "Ekon",
          },
        },
        actor: {
          action: "Initiated by",
          name: "Spiro Factory",
        },
        duration: {
          range: "15 Dec - 10 Feb",
          total: "57 days",
        },
      },
    ],
  },
}

export function getBatchDetails(id: string): BatchDetails {
  return mockBatchDetails[id] || mockBatchDetails["1"]
}
