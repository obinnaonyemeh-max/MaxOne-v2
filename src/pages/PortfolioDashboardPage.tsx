import { TopBar, PageHeader } from "@/components/max"

export default function PortfolioDashboardPage() {
  return (
    <>
      <TopBar breadcrumbs={[{ label: "Portfolio" }, { label: "Dashboard" }]} />
      <PageHeader
        title="Dashboard"
        subtitle="Portfolio overview and performance at a glance."
      />
    </>
  )
}
