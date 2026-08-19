import type { SidebarSection, SidebarUser } from "@/components/max"

export const sidebarSections: SidebarSection[] = [
  {
    id: "home",
    label: "Overview",
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
        id: "inbound",
        label: "Inbound",
        icon: "/images/inbound_menu.svg",
        children: [
          {
            id: "inbound-batches",
            label: "Batches",
            href: "/inbound/batches",
          },
          {
            id: "inbound-stock-setup",
            label: "Vehicle Master Data",
            href: "/inbound/stock-setup",
          },
        ],
      },
      {
        id: "activation-readiness",
        label: "Activation Readiness",
        icon: "/images/memo_circle_check_menu.svg",
        href: "/activation/readiness",
      },
      {
        id: "vehicle-document",
        label: "Vehicle Document",
        icon: "/images/document_menu.svg",
        href: "/vehicle-document",
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
        href: "/refurbishment",
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: "/images/maintenance_menu.svg",
        children: [
          {
            id: "service-schedule",
            label: "Service Schedule",
            href: "/service-schedule",
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
            href: "/disposal-management",
          },
          {
            id: "conversion-request",
            label: "Conversion Request",
            href: "/conversion-request",
          },
          {
            id: "auction",
            label: "Auction",
            href: "/auction",
          },
          {
            id: "scrap-management",
            label: "Scrap Management",
            href: "/scrap-management",
          },
          {
            id: "closed-assets",
            label: "Closed Assets",
            href: "/closed-assets",
          },
        ],
      },
    ],
  },
  {
    id: "transfer",
    label: "Ownership Transfer",
    items: [
      {
        id: "all-transfer",
        label: "All Transfer",
        icon: "/images/asset_movement_menu.svg",
        href: "/transfer/all",
      },
    ],
  },
  {
    id: "activation-assignment",
    label: "Activation & Assignment",
    items: [
      {
        id: "asset-reassignment",
        label: "Asset Reassignment",
        icon: "/images/asset_movement_menu.svg",
        children: [
          {
            id: "asset-reassignment-kit",
            label: "Kit",
            href: "/activation-assignment/asset-reassignment/kit",
          },
        ],
      },
    ],
  },
  // {
  //   id: "fleet-intelligence",
  //   label: "Fleet Intelligence",
  //   items: [
  //     {
  //       id: "fleet-performance",
  //       label: "Fleet Performance",
  //       icon: "/images/fleet_performance_menu.svg",
  //       badge: "Soon",
  //       badgeVariant: "coming-soon",
  //     },
  //     {
  //       id: "driver-safety",
  //       label: "Driver Safety",
  //       icon: "/images/driver_safety_menu.svg",
  //       badge: "Soon",
  //       badgeVariant: "coming-soon",
  //     },
  //     {
  //       id: "asset-health",
  //       label: "Asset Health",
  //       icon: "/images/asset_health_menu.svg",
  //       badge: "Soon",
  //       badgeVariant: "coming-soon",
  //     },
  //     {
  //       id: "revenue-analytics",
  //       label: "Revenue Analytics",
  //       icon: "/images/revenue_analytics_menu.svg",
  //       badge: "Soon",
  //       badgeVariant: "coming-soon",
  //     },
  //   ],
  // },
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

export const driverGrowthSidebarSections: SidebarSection[] = [
  {
    id: "home",
    label: "Overview",
    items: [
      {
        id: "activation-dashboard",
        label: "Activation Dashboard",
        icon: "/images/growth_activation_menu.svg",
        href: "/growth-activation",
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      {
        id: "mcp-management",
        label: "MCP Management",
        icon: "/images/fleet_menu.svg",
        href: "/mcp-management",
      },
      {
        id: "chairman-dashboard",
        label: "Chairman Dashboard",
        icon: "/images/dashboard_menu.svg",
        badge: "Soon",
        badgeVariant: "coming-soon",
      },
    ],
  },
]

export const driverExperienceSidebarSections: SidebarSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "overview-dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_menu.svg",
        href: "/driver-experience/dashboard",
      },
    ],
  },
  {
    id: "driver-experience",
    label: "Driver Experience",
    items: [
      {
        id: "champion-360",
        label: "Champion 360",
        icon: "/images/agent_menu.svg",
        href: "/champion-360",
      },
      {
        id: "ticket-management",
        label: "Ticket Management",
        icon: "/images/issues_menu.svg",
        href: "/ticket-management",
      },
      {
        id: "driver-safety-score",
        label: "Drivers Safety Performance",
        icon: "/images/driver_safety_menu.svg",
        href: "/driver-safety-score",
      },
      {
        id: "welfare",
        label: "Welfare",
        icon: "/images/agent_menu.svg",
        href: "/welfare",
      },
      {
        id: "approvals",
        label: "Approvals",
        icon: "/images/memo_circle_check_menu.svg",
        href: "/driver-experience/approvals",
      },
      {
        id: "performance",
        label: "Performance",
        icon: "/images/fleet_performance_menu.svg",
        href: "/performance",
      },
    ],
  },
]

export const falconSidebarSections: SidebarSection[] = [
  {
    id: "home",
    label: "Overview",
    items: [
      {
        id: "falcon-dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_menu.svg",
        href: "/falcon/dashboard",
      },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    items: [
      {
        id: "vehicle-register",
        label: "Vehicle Register",
        icon: "/images/fleet_menu.svg",
        href: "/falcon/vehicle-register",
      },
      {
        id: "alerts",
        label: "Alerts",
        icon: "/images/issues_menu.svg",
        children: [
          { id: "tamper-alerts", label: "Tamper Alerts", href: "/falcon/alerts/tamper" },
          { id: "battery-alerts", label: "Battery Alerts", href: "/falcon/alerts/battery" },
        ],
      },
      {
        id: "geofencing",
        label: "Geofencing",
        icon: "/images/compliance_menu.svg",
        href: "/falcon/geofences",
      },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    items: [
      {
        id: "stations-hubs",
        label: "Stations & Hubs",
        icon: "/images/asset_movement_menu.svg",
        href: "/falcon/swap-stations",
      },
      {
        id: "batteries",
        label: "Batteries",
        icon: "/images/asset_health_menu.svg",
        children: [
          { id: "batteries-dashboard", label: "Dashboard", href: "/falcon/batteries/dashboard" },
          { id: "battery-register", label: "Battery Register", href: "/falcon/batteries/register" },
        ],
      },
      {
        id: "ev-chargers",
        label: "EV Chargers",
        icon: "/images/maintenance_menu.svg",
        href: "/falcon/ev-chargers",
      },
    ],
  },
]

// Each Portfolio entry is a collapsible section header (like Fleet Operations'
// HOME / OPERATIONS / DEPLOYMENT). Items under each section are added as the
// contents of each are provided.
export const portfolioSidebarSections: SidebarSection[] = [
  {
    id: "portfolio-home",
    label: "Home",
    items: [
      {
        id: "portfolio-dashboard",
        label: "Dashboard",
        icon: "/images/dashboard_menu.svg",
        href: "/portfolio/dashboard",
      },
    ],
  },
  {
    id: "portfolio-champions",
    label: "Champions",
    items: [
      {
        id: "portfolio-champion-overview",
        label: "Champion Overview",
        icon: "/images/agent_menu.svg",
        href: "/portfolio/champions/overview",
      },
      {
        id: "portfolio-referral-management",
        label: "Referral Management",
        icon: "/images/referral_menu.svg",
        href: "/portfolio/champions/referrals",
      },
      {
        id: "portfolio-blacklist",
        label: "Blacklist",
        icon: "/images/blacklist_menu.svg",
        href: "/portfolio/champions/blacklist",
      },
    ],
  },
  {
    id: "portfolio-contracts",
    label: "Contracts",
    items: [
      {
        id: "portfolio-all-contracts",
        label: "All Contracts",
        icon: "/images/document_menu.svg",
        href: "/portfolio/contracts/all",
      },
      {
        id: "portfolio-initiated-contracts",
        label: "Initiated Contracts",
        icon: "/images/initiated_contract_menu.svg",
        href: "/portfolio/contracts/initiated",
      },
      {
        id: "portfolio-restructured-contracts",
        label: "Restructured Contracts",
        icon: "/images/restructured_contract_menu.svg",
        href: "/portfolio/contracts/restructured",
      },
      {
        id: "portfolio-pending-approval",
        label: "Pending Approval",
        icon: "/images/memo_circle_check_menu.svg",
        href: "/portfolio/contracts/pending-approval",
      },
      {
        id: "portfolio-disputed-contracts",
        label: "Disputed Contracts",
        icon: "/images/disputed_contract_menu.svg",
        href: "/portfolio/contracts/disputed",
      },
    ],
  },
  {
    id: "portfolio-products-pricing",
    label: "Products & Pricing",
    items: [
      {
        id: "portfolio-pricing-configuration",
        label: "Pricing Configuration",
        icon: "/images/config_menu.svg",
        children: [
          {
            id: "portfolio-pricing-config-new-asset",
            label: "New Asset",
          },
        ],
      },
      {
        id: "portfolio-dynamic-pricing-engine",
        label: "Dynamic Pricing Engine",
        icon: "/images/pricing_engine_menu.svg",
      },
      {
        id: "portfolio-dynamic-repricing-engine",
        label: "Dynamic Repricing Engine",
        icon: "/images/pricing_engine_menu.svg",
      },
      {
        id: "portfolio-early-termination-engine",
        label: "Early Termination Engine",
        icon: "/images/early_termination_menu.svg",
      },
      {
        id: "portfolio-revenue-recognition",
        label: "Revenue Recognition",
        icon: "/images/revenue_analytics_menu.svg",
      },
    ],
  },
  {
    id: "portfolio-credit-underwriting",
    label: "Credit & Underwriting",
    items: [
      {
        id: "portfolio-retail-scorecard-config",
        label: "Retail Scorecard Configuration",
        icon: "/images/config_menu.svg",
      },
      {
        id: "portfolio-enterprise-scorecard-config",
        label: "Enterprise Scorecard Configuration",
        icon: "/images/config_menu.svg",
      },
    ],
  },
  {
    id: "portfolio-collections",
    label: "Collections",
    items: [
      {
        id: "portfolio-all-collections",
        label: "All Collections",
        icon: "/images/revenue_analytics_menu.svg",
        href: "/portfolio/collections/all",
      },
    ],
  },
  {
    id: "portfolio-recovery",
    label: "Recovery",
    items: [
      {
        id: "portfolio-recovery-command-center",
        label: "Recovery Command Center",
        icon: "/images/dashboard_menu.svg",
      },
      {
        id: "portfolio-recovery-officers",
        label: "Recovery Officers",
        icon: "/images/agent_menu.svg",
        href: "/portfolio/recovery/officers",
      },
      {
        id: "portfolio-pending-recoveries",
        label: "Pending Recoveries",
        icon: "/images/pending_recovery_menu.svg",
      },
      {
        id: "portfolio-recoveries-in-session",
        label: "Recoveries in Session",
        icon: "/images/recovery_in_session_menu.svg",
        children: [
          {
            id: "portfolio-successful-recoveries",
            label: "Successful Recoveries",
          },
          {
            id: "portfolio-failed-recoveries",
            label: "Failed Recoveries",
          },
        ],
      },
      {
        id: "portfolio-pending-check-ins",
        label: "Pending Check-Ins",
        icon: "/images/pending_checkin_menu.svg",
      },
    ],
  },
  {
    id: "portfolio-insurance-management",
    label: "Insurance Management",
    items: [
      {
        id: "portfolio-insurance-overview",
        label: "Insurance Overview",
        icon: "/images/compliance_menu.svg",
      },
    ],
  },
  {
    id: "portfolio-funding",
    label: "Funding",
    items: [
      {
        id: "portfolio-financier-setup",
        label: "Financier Setup",
        icon: "/images/config_menu.svg",
      },
    ],
  },
  {
    id: "portfolio-ops",
    label: "Portfolio Ops",
    items: [
      {
        id: "portfolio-write-offs",
        label: "Write-offs",
        icon: "/images/early_termination_menu.svg",
      },
    ],
  },
]

export const sidebarUser: SidebarUser = {
  name: "Desmond Nsogbuwa",
  role: "Fleet Manager",
}
