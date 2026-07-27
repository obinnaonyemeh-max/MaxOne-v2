import type { AssignmentRecord, TimelineEntryData } from "@/components/max"

export interface VehicleDetails {
  id: string
  assetId: string
  vehicleStatus: string
  vehicleStatusVariant: "success" | "warning" | "info" | "danger" | "default"
  imageUrl: string
  assetType: string
  manufacturer: string
  contractStatus: "Active" | "Inactive"
  lastUpdatedBy: string
  lastPingedOn: string
  basicInfo: {
    vehicleType: string
    model: string
    trim: string
    platformType: string
  }
  identification: {
    chassisNumber: string
    engineNumber: string
    ignitionNumber: string
    plateNumber: string
  }
  vendor: {
    oemVendorName: string
    financialPartner: string
  }
  assignment: {
    location: string
    receiver: string
    deliveryDate: string
    licenseExpiration: string
  }
  telematics: {
    simSerialNumber: string
    deviceImei: string
    phoneNumber: string
    helmetNumber: string
  }
  assignmentHistory: AssignmentRecord[]
  statusHistory: TimelineEntryData[]
}

export const mockVehicleDetails: Record<string, VehicleDetails> = {
  "1": {
    id: "1",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "Active - MCP",
    vehicleStatusVariant: "success",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "2 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Active",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eMotorcycle",
      model: "Max E Series",
      trim: "M2",
      platformType: "Enterprise",
    },
    identification: {
      chassisNumber: "358TF6EFD16D1379",
      engineNumber: "52DSH8313077",
      ignitionNumber: "85949342",
      plateNumber: "EN 234 LSG",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Lekki",
      receiver: "Daniel Dolapo",
      deliveryDate: "2 Dec 2023",
      licenseExpiration: "2 Dec 2026",
    },
    telematics: {
      simSerialNumber: "317GJD7931J",
      deviceImei: "232RYK24224",
      phoneNumber: "07037645392",
      helmetNumber: "MAX-HEM553",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "3 Dec 2023 - Current",
        assigneeName: "Saidu Adewale",
        status: "Active",
        isCurrent: true,
      },
      {
        id: "2",
        duration: "15 Aug 2023 - 2 Dec 2023",
        assigneeName: "Emeka Okafor",
        status: "Inactive",
        isCurrent: false,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Active",
        statusVariant: "success",
        description: {
          template: "Vehicle has been assigned to {champion} and is {action} at {location}",
          highlights: {
            champion: "Saidu Adewale",
            action: "operational",
            location: "Lekki office",
          },
        },
        actor: {
          action: "Activated by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "3 Sep - Current",
          total: "Ongoing",
        },
      },
      {
        id: "sh2",
        date: "Feb 2026",
        status: "3PL Check-in Fleet",
        statusVariant: "warning",
        description: {
          template: "{champion} takes the vehicle to an approved {location} for vehicle maintenance.",
          highlights: {
            champion: "Saidu Adewale",
            location: "3rd party facility",
          },
        },
        actor: {
          action: "Checked in by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "3 Sep - 4 Sep",
          total: "24 hrs",
        },
      },
      {
        id: "sh3",
        date: "Jan 2026",
        status: "Operational Fleet",
        statusVariant: "success",
        description: {
          template: "Vehicle assigned to {champion} for {status}",
          highlights: {
            champion: "Saidu Adewale",
            status: "operational use",
          },
        },
        actor: {
          action: "Initiated by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "3 Sep - 4 Sep",
          total: "24 hrs",
        },
      },
      {
        id: "sh4",
        date: "Jan 2026",
        status: "Inbound",
        statusVariant: "info",
        description: {
          template: "Vehicle in {status} stage at {location}.",
          highlights: {
            status: "Pre-Deployment",
            location: "warehouse",
          },
        },
        actor: {
          action: "Processed by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "1 Jan - 3 Sep",
          total: "8 months",
        },
      },
    ],
  },
  "2": {
    id: "2",
    assetId: "MAX-IN-CH-203",
    vehicleStatus: "Active - Retail",
    vehicleStatusVariant: "success",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "3 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Active",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eTricycle",
      model: "Max T Series",
      trim: "T3",
      platformType: "Enterprise",
    },
    identification: {
      chassisNumber: "458TF6EFD16D1380",
      engineNumber: "62DSH8313078",
      ignitionNumber: "95949343",
      plateNumber: "EN 235 LSG",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Ikeja",
      receiver: "Femi Adeyemi",
      deliveryDate: "5 Dec 2023",
      licenseExpiration: "5 Dec 2026",
    },
    telematics: {
      simSerialNumber: "418HKE8042K",
      deviceImei: "343SZL35335",
      phoneNumber: "08051234567",
      helmetNumber: "MAX-HEM554",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "5 Dec 2023 - Current",
        assigneeName: "Chioma Nwosu",
        status: "Active",
        isCurrent: true,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Active",
        statusVariant: "success",
        description: {
          template: "Vehicle has been assigned to {champion} and is {action} at {location}",
          highlights: {
            champion: "Chioma Nwosu",
            action: "operational",
            location: "Ikeja office",
          },
        },
        actor: {
          action: "Activated by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "5 Dec - Current",
          total: "Ongoing",
        },
      },
      {
        id: "sh2",
        date: "Jan 2026",
        status: "Inbound",
        statusVariant: "info",
        description: {
          template: "Vehicle in {status} stage at {location}",
          highlights: {
            status: "Documentation",
            location: "processing center",
          },
        },
        actor: {
          action: "Processed by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "1 Dec - 5 Dec",
          total: "4 days",
        },
      },
    ],
  },
  "3": {
    id: "3",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "3PL Check-in Fleet - Violation",
    vehicleStatusVariant: "warning",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "4 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Inactive",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eCar",
      model: "Max C Series",
      trim: "C4",
      platformType: "Enterprise",
    },
    identification: {
      chassisNumber: "558TF6EFD16D1381",
      engineNumber: "72DSH8313079",
      ignitionNumber: "95949344",
      plateNumber: "KAN-456-MN",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Ikeja",
      receiver: "Kunle Ojo",
      deliveryDate: "10 Dec 2023",
      licenseExpiration: "10 Dec 2026",
    },
    telematics: {
      simSerialNumber: "519ILF9153L",
      deviceImei: "454TYM46446",
      phoneNumber: "08062345678",
      helmetNumber: "N/A",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "10 Dec 2023 - Current",
        assigneeName: "Kunle Ojo",
        status: "Inactive",
        isCurrent: true,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "3PL Check-in Fleet",
        statusVariant: "warning",
        description: {
          template: "Vehicle checked in due to {reason} at {location}",
          highlights: {
            reason: "traffic violation",
            location: "3PL facility",
          },
        },
        actor: {
          action: "Checked in by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "20 Feb - Current",
          total: "8 days",
        },
      },
      {
        id: "sh2",
        date: "Jan 2026",
        status: "Active",
        statusVariant: "success",
        description: {
          template: "Vehicle was {action} with {champion}",
          highlights: {
            action: "operational",
            champion: "Kunle Ojo",
          },
        },
        actor: {
          action: "Assigned by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "10 Dec - 20 Feb",
          total: "72 days",
        },
      },
    ],
  },
  "4": {
    id: "4",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "Exit - HP Complete",
    vehicleStatusVariant: "danger",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "2 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Active",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eMotorcycle",
      model: "Max E Series",
      trim: "M2",
      platformType: "Retail",
    },
    identification: {
      chassisNumber: "658TF6EFD16D1382",
      engineNumber: "82DSH8313080",
      ignitionNumber: "95949345",
      plateNumber: "OYO-123-AB",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Ikeja",
      receiver: "Adebayo Tunde",
      deliveryDate: "15 Dec 2023",
      licenseExpiration: "15 Dec 2026",
    },
    telematics: {
      simSerialNumber: "620JMG0264M",
      deviceImei: "565UZN57557",
      phoneNumber: "08073456789",
      helmetNumber: "MAX-HEM555",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "15 Dec 2023 - 28 Feb 2026",
        assigneeName: "Adebayo Tunde",
        status: "Completed",
        isCurrent: false,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Exit",
        statusVariant: "danger",
        description: {
          template: "Vehicle ownership transferred to {champion} - {status}",
          highlights: {
            champion: "Adebayo Tunde",
            status: "HP Complete",
          },
        },
        actor: {
          action: "Finalized by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "28 Feb",
          total: "Final",
        },
      },
      {
        id: "sh2",
        date: "Jan 2026",
        status: "Active",
        statusVariant: "success",
        description: {
          template: "Vehicle was {action} with {champion}",
          highlights: {
            action: "operational",
            champion: "Adebayo Tunde",
          },
        },
        actor: {
          action: "Managed by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "15 Dec 2023 - 28 Feb 2026",
          total: "2+ years",
        },
      },
    ],
  },
  "5": {
    id: "5",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "Inbound - Production",
    vehicleStatusVariant: "info",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "2 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Inactive",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eMotorcycle",
      model: "Max E Series",
      trim: "M2",
      platformType: "Pending",
    },
    identification: {
      chassisNumber: "758TF6EFD16D1383",
      engineNumber: "92DSH8313081",
      ignitionNumber: "95949346",
      plateNumber: "Pending",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Warehouse",
      receiver: "Pending",
      deliveryDate: "Pending",
      licenseExpiration: "Pending",
    },
    telematics: {
      simSerialNumber: "Pending",
      deviceImei: "Pending",
      phoneNumber: "Pending",
      helmetNumber: "Pending",
    },
    assignmentHistory: [],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Inbound",
        statusVariant: "info",
        description: {
          template: "Vehicle in {status} stage at {location}",
          highlights: {
            status: "Production",
            location: "OEM facility",
          },
        },
        actor: {
          action: "Logged by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "25 Feb - Current",
          total: "3 days",
        },
      },
    ],
  },
  "6": {
    id: "6",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "Yard check-in Fleet - Assessed - Refurbish",
    vehicleStatusVariant: "warning",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "2 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Active",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eMotorcycle",
      model: "Max E Series",
      trim: "M2",
      platformType: "Enterprise",
    },
    identification: {
      chassisNumber: "858TF6EFD16D1384",
      engineNumber: "02DSH8313082",
      ignitionNumber: "95949347",
      plateNumber: "EKI-789-CD",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Yard",
      receiver: "Maintenance Team",
      deliveryDate: "20 Dec 2023",
      licenseExpiration: "20 Dec 2026",
    },
    telematics: {
      simSerialNumber: "731KNH1375N",
      deviceImei: "676VAO68668",
      phoneNumber: "08084567890",
      helmetNumber: "MAX-HEM556",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "20 Dec 2023 - 1 Feb 2026",
        assigneeName: "Olumide Bello",
        status: "Inactive",
        isCurrent: false,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Yard check-in Fleet",
        statusVariant: "warning",
        description: {
          template: "Vehicle {status} - requires {action}",
          highlights: {
            status: "Assessed",
            action: "refurbishment",
          },
        },
        actor: {
          action: "Assessed by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "1 Feb - Current",
          total: "200 days",
        },
      },
      {
        id: "sh2",
        date: "Jan 2026",
        status: "3PL Check-in Fleet",
        statusVariant: "warning",
        description: {
          template: "Vehicle checked in for {reason}",
          highlights: {
            reason: "Asset Maintenance",
          },
        },
        actor: {
          action: "Checked in by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "15 Jan - 1 Feb",
          total: "17 days",
        },
      },
    ],
  },
  "7": {
    id: "7",
    assetId: "MAX-IB-CH-203",
    vehicleStatus: "Operational Fleet - Operational Vehicle",
    vehicleStatusVariant: "success",
    imageUrl: "/images/2wheeler_overview.svg",
    assetType: "2 wheeler",
    manufacturer: "MaxE",
    contractStatus: "Active",
    lastUpdatedBy: "Samson Oluwaseun",
    lastPingedOn: "24 Jan 2026, 12:35 pm",
    basicInfo: {
      vehicleType: "eMotorcycle",
      model: "Max E Series",
      trim: "M2",
      platformType: "Enterprise",
    },
    identification: {
      chassisNumber: "958TF6EFD16D1385",
      engineNumber: "12DSH8313083",
      ignitionNumber: "95949348",
      plateNumber: "LAG-567-EF",
    },
    vendor: {
      oemVendorName: "GreenDrive Auto",
      financialPartner: "Yamaha",
    },
    assignment: {
      location: "Ikeja",
      receiver: "Operations Team",
      deliveryDate: "25 Dec 2023",
      licenseExpiration: "25 Dec 2026",
    },
    telematics: {
      simSerialNumber: "842LOI2486O",
      deviceImei: "787WBP79779",
      phoneNumber: "08095678901",
      helmetNumber: "MAX-HEM557",
    },
    assignmentHistory: [
      {
        id: "1",
        duration: "25 Dec 2023 - Current",
        assigneeName: "Operations Team",
        status: "Active",
        isCurrent: true,
      },
    ],
    statusHistory: [
      {
        id: "sh1",
        date: "Feb 2026",
        status: "Operational Fleet",
        statusVariant: "success",
        description: {
          template: "Vehicle assigned to {team} as {type}",
          highlights: {
            team: "Operations Team",
            type: "Operational Vehicle",
          },
        },
        actor: {
          action: "Assigned by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "25 Dec 2023 - Current",
          total: "15 days",
        },
      },
      {
        id: "sh2",
        date: "Dec 2023",
        status: "Inbound",
        statusVariant: "info",
        description: {
          template: "Vehicle completed {stage} stage",
          highlights: {
            stage: "Pre-Deployment",
          },
        },
        actor: {
          action: "Processed by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "20 Dec - 25 Dec",
          total: "5 days",
        },
      },
    ],
  },
}

export function getVehicleDetails(id: string): VehicleDetails {
  return mockVehicleDetails[id] || mockVehicleDetails["1"]
}
