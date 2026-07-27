export interface BatchDetails {
  id: string
  batchId: string
  batchInfo: {
    oem: string
    model: string
    trim: string
    quantityOrdered: number
    quantityReceived: number
    quantityInTransit: number
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
}

export const mockBatchDetails: Record<string, BatchDetails> = {
  "1": {
    id: "1",
    batchId: "BATCH-12-3056",
    batchInfo: {
      oem: "TailG",
      model: "Jidi V1 Standard",
      trim: "V1",
      quantityOrdered: 20000,
      quantityReceived: 5000,
      quantityInTransit: 7500,
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
  },
  "2": {
    id: "2",
    batchId: "BATCH-0990",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon V2 Standard",
      trim: "Ekon V2",
      quantityOrdered: 5000,
      quantityReceived: 1250,
      quantityInTransit: 1875,
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
  },
  "3": {
    id: "3",
    batchId: "BATCH-2026-003",
    batchInfo: {
      oem: "King",
      model: "MAX M4 Cargo",
      trim: "MM4",
      quantityOrdered: 2500,
      quantityReceived: 625,
      quantityInTransit: 937,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-KG-003",
      invoicePoReference: "INV-2026-003",
    },
    shipping: {
      containerNumber: "HLCU-9847563",
      shippingLine: "Hapag-Lloyd",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "20 May 2026",
    },
    createdDate: "3/1/2026",
    notes: "Cargo variant for logistics partners.",
  },
  "4": {
    id: "4",
    batchId: "BATCH-2026-002",
    batchInfo: {
      oem: "TailG",
      model: "Jidi V1 Standard",
      trim: "V1",
      quantityOrdered: 400,
      quantityReceived: 400,
      quantityInTransit: 0,
      destinationCountry: "Ghana",
      destinationCity: "Accra",
    },
    financials: {
      paymentReference: "PAY-2026-TG-002",
      invoicePoReference: "INV-2026-002",
    },
    shipping: {
      containerNumber: "OOLU-3847291",
      shippingLine: "OOCL",
      portOfArrival: "Tema Port",
      expectedDeliveryDate: "1 Apr 2026",
    },
    createdDate: "1/20/2026",
    notes: "Small batch for pilot program.",
  },
  "5": {
    id: "5",
    batchId: "BATCH-2026-001",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon V2 Standard",
      trim: "Ekon V2",
      quantityOrdered: 1000,
      quantityReceived: 250,
      quantityInTransit: 375,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-SP-001",
      invoicePoReference: "INV-2026-001",
    },
    shipping: {
      containerNumber: "TCLU-5829173",
      shippingLine: "MSC",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "15 May 2026",
    },
    createdDate: "2/1/2026",
    notes: "",
  },
  "6": {
    id: "6",
    batchId: "BATCH-2026-006",
    batchInfo: {
      oem: "King",
      model: "MAX M4 Cargo",
      trim: "MM4",
      quantityOrdered: 3000,
      quantityReceived: 0,
      quantityInTransit: 0,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-KG-006",
      invoicePoReference: "INV-2026-006",
    },
    shipping: {
      containerNumber: "Pending",
      shippingLine: "TBD",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "15 Aug 2026",
    },
    createdDate: "3/10/2026",
    notes: "Large cargo batch for enterprise clients.",
  },
  "7": {
    id: "7",
    batchId: "BATCH-2026-007",
    batchInfo: {
      oem: "TailG",
      model: "Jidi V1 Standard",
      trim: "V1",
      quantityOrdered: 1500,
      quantityReceived: 375,
      quantityInTransit: 562,
      destinationCountry: "Ghana",
      destinationCity: "Accra",
    },
    financials: {
      paymentReference: "PAY-2026-TG-007",
      invoicePoReference: "INV-2026-007",
    },
    shipping: {
      containerNumber: "CMAU-2938475",
      shippingLine: "CMA CGM",
      portOfArrival: "Tema Port",
      expectedDeliveryDate: "25 Apr 2026",
    },
    createdDate: "2/20/2026",
    notes: "",
  },
  "8": {
    id: "8",
    batchId: "BATCH-2026-008",
    batchInfo: {
      oem: "Spiro",
      model: "Ekon V2 Standard",
      trim: "Ekon V2",
      quantityOrdered: 800,
      quantityReceived: 600,
      quantityInTransit: 100,
      destinationCountry: "Nigeria",
      destinationCity: "Lagos",
    },
    financials: {
      paymentReference: "PAY-2026-SP-008",
      invoicePoReference: "INV-2026-008",
    },
    shipping: {
      containerNumber: "MSKU-7382910",
      shippingLine: "Maersk",
      portOfArrival: "Apapa Port",
      expectedDeliveryDate: "10 Apr 2026",
    },
    createdDate: "1/15/2026",
    notes: "Fast-track batch for Lagos market.",
  },
}

export function getBatchDetails(id: string): BatchDetails {
  return mockBatchDetails[id] || mockBatchDetails["1"]
}
