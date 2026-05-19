import { TopBar, PageHeader } from "@/components/max"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { CheckInTab } from "./asset-movement/CheckInTab"
import { CheckoutTab } from "./asset-movement/CheckoutTab"
import { MovementLogTab } from "./asset-movement/MovementLogTab"

export default function AssetMovementPage() {
  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Operations" }, { label: "Asset Movement" }]}
      />
      <PageHeader
        title="Asset Movement"
        subtitle="Monitor vehicle check-ins, check-outs, and movement history"
        className="shrink-0"
      />

      <Tabs defaultValue="check-in" className="flex-1 flex flex-col min-h-0 px-6">
        <TabsList variant="line" className="shrink-0 pb-0 gap-0 w-fit">
          <TabsTrigger value="check-in" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Check-In
          </TabsTrigger>
          <TabsTrigger value="checkout" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Checkout
          </TabsTrigger>
          <TabsTrigger value="movement-log" className="px-4 py-2" style={{ fontSize: "14px" }}>
            Movement Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check-in" className="flex-1 flex flex-col min-h-0 mt-4">
          <CheckInTab />
        </TabsContent>

        <TabsContent value="checkout" className="flex-1 flex flex-col min-h-0 mt-4">
          <CheckoutTab />
        </TabsContent>

        <TabsContent value="movement-log" className="flex-1 flex flex-col min-h-0 mt-4">
          <MovementLogTab />
        </TabsContent>
      </Tabs>
    </>
  )
}
