import {
  TopBar,
  PageHeader,
} from "@/components/max"

export default function WelfarePerformancePage() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Driver Experience" },
          { label: "Welfare & Performance" },
        ]}
      />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <PageHeader
          title="Welfare & Performance"
          subtitle="Track driver welfare programs and performance indicators"
          className="px-0"
        />
        {/* Page content will go here */}
      </div>
    </>
  )
}
