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
    vehicleStatus: "Asset Checkout",
    vehicleStatusVariant: "info",
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
        status: "Asset Checkout",
        statusVariant: "info",
        description: {
          template: "Vehicle has been given to {champion} and {action} of the {location}",
          highlights: {
            champion: "Saidu Adewale",
            action: "checked out",
            location: "Lekki office",
          },
        },
        actor: {
          action: "Checked out by",
          name: "Destiny Udogie",
        },
        duration: {
          range: "3 Sep - 4 Sep",
          total: "24 hrs",
        },
      },
      {
        id: "sh2",
        date: "Feb 2026",
        status: "3rd Party Check-In",
        statusVariant: "danger",
        description: {
          template: "{champion} takes the vehicle to an approved {location} for vehicle maintenance.",
          highlights: {
            champion: "Saidu Adewale",
            location: "3rd party",
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
        status: "HP Completed",
        statusVariant: "success",
        description: {
          template: "Vehicle transfer to {champion} was {status}",
          highlights: {
            champion: "Saidu Adewale",
            status: "in progress",
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
        status: "3rd Party Check-In",
        statusVariant: "danger",
        description: {
          template: "{champion} takes the vehicle to an approved {location} for vehicle maintenance.",
          highlights: {
            champion: "Saidu Adewale",
            location: "3rd party",
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
    ],
  },
  "2": {
    id: "2",
    assetId: "MAX-IN-CH-203",
    vehicleStatus: "Asset Checkout",
    vehicleStatusVariant: "info",
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
        status: "Asset Checkout",
        statusVariant: "info",
        description: {
          template: "Vehicle has been given to {champion} and {action} of the {location}",
          highlights: {
            champion: "Chioma Nwosu",
            action: "checked out",
            location: "Ikeja office",
          },
        },
        actor: {
          action: "Checked out by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "5 Dec - 6 Dec",
          total: "24 hrs",
        },
      },
      {
        id: "sh2",
        date: "Jan 2026",
        status: "HP Completed",
        statusVariant: "success",
        description: {
          template: "Vehicle transfer to {champion} was {status}",
          highlights: {
            champion: "Chioma Nwosu",
            status: "completed",
          },
        },
        actor: {
          action: "Initiated by",
          name: "Samson Oluwaseun",
        },
        duration: {
          range: "1 Dec - 5 Dec",
          total: "4 days",
        },
      },
    ],
  },
}

export function getVehicleDetails(id: string): VehicleDetails {
  return mockVehicleDetails[id] || mockVehicleDetails["1"]
}
