import type { SidebarSection, SidebarUser } from "@/components/max"

export const sidebarSections: SidebarSection[] = [
  {
    id: "home",
    label: "Home",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_menu.svg",
        href: "/dashboard",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "fleet-register",
        label: "Fleet Register",
        icon: "/images/fleet_menu.svg",
        badge: "24K",
        href: "/fleet-register",
      },
      {
        id: "asset-movement",
        label: "Asset Movement",
        icon: "/images/asset_movement_menu.svg",
        href: "/asset-movement",
      },
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    items: [
      {
        id: "growth-activation",
        label: "Growth & Activation",
        icon: "/images/growth_activation_menu.svg",
        children: [
          {
            id: "activation-dashboard",
            label: "Activation Dashboard",
            href: "/growth-activation",
          },
          {
            id: "mcp-management",
            label: "MCP Management",
          },
          {
            id: "chairman-dashboard",
            label: "Chairman Dashboard",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
        ],
      },
      {
        id: "inbound",
        label: "Inbound",
        icon: "/images/inbound_menu.svg",
      },
    ],
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    items: [
      {
        id: "refurbishment",
        label: "Refurbishment",
        icon: "/images/refurbishment_menu.svg",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: "/images/maintenance_menu.svg",
        children: [
          {
            id: "service-schedule",
            label: "Service Schedule",
          },
          {
            id: "predictive-lab",
            label: "Predictive Lab",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
        ],
      },
      {
        id: "disposal-auction",
        label: "Disposal & Auction",
        icon: "/images/disposal_auction_menu.svg",
        children: [
          {
            id: "disposal-management",
            label: "Disposal Management",
          },
          {
            id: "conversion-request",
            label: "Conversion Request",
          },
          {
            id: "auction",
            label: "Auction",
            badge: "Soon",
            badgeVariant: "coming-soon",
          },
          {
            id: "scrap-management",
            label: "Scrap Management",
          },
          {
            id: "closed-assets",
            label: "Closed Assets",
          },
        ],
      },
    ],
  },
  {
    id: "fleet-intelligence",
    label: "Fleet Intelligence",
    items: [
      {
        id: "fleet-performance",
        label: "Fleet Performance",
        icon: "/images/fleet_performance_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "driver-safety",
        label: "Driver Safety",
        icon: "/images/driver_safety_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "asset-health",
        label: "Asset Health",
        icon: "/images/asset_health_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "revenue-analytics",
        label: "Revenue Analytics",
        icon: "/images/revenue_analytics_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
    ],
  },
  {
    id: "control",
    label: "Control",
    items: [
      {
        id: "asset-assessment-engine",
        label: "Asset Assessment Engine",
        icon: "/images/asset_assessment_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: "/images/compliance_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "vendor-management",
        label: "Vendor Management",
        icon: "/images/vendor_management_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
      {
        id: "governance",
        label: "Governance",
        icon: "/images/governance_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
    ],
  },
]

export const sidebarUser: SidebarUser = {
  name: "Desmond Nsogbuwa",
  role: "Fleet Manager",
}
