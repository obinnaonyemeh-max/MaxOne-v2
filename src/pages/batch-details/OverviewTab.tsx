import { InfoCard, InfoGrid, StatusBadge } from "@/components/max"
import type { BatchDetails } from "@/data/mockBatchDetails"

export function OverviewTab({ batch }: { batch: BatchDetails }) {
  return (
    <div className="bg-content-card flex flex-col gap-3 h-fit rounded-lg border border-border p-3">
      <InfoCard title="BATCH INFORMATION">
        <InfoGrid
          columns={4}
          showDividers
          items={[
            { label: "Batch ID", value: batch.batchId },
            { label: "OEM / Manufacturer", value: batch.batchInfo.oem },
            { label: "Name", value: batch.batchInfo.model },
            { label: "Trim", value: batch.batchInfo.trim },
            { label: "Quantity Ordered", value: batch.batchInfo.quantityOrdered.toLocaleString() },
            { label: "Quantity Received", value: batch.batchInfo.quantityReceived.toLocaleString() },
            { label: "Quantity In Transit", value: batch.batchInfo.quantityInTransit.toLocaleString() },
            { label: "Destination Country", value: batch.batchInfo.destinationCountry },
            { label: "Destination City", value: batch.batchInfo.destinationCity },
            { label: "Status", value: <StatusBadge variant={batch.stageVariant} withDot>{batch.stage}</StatusBadge> },
          ]}
        />
      </InfoCard>

      <InfoCard title="PROGRESS">
        <InfoGrid
          columns={4}
          showDividers
          items={[
            { label: "Identifiers Uploaded", value: "1/400" },
            { label: "Registration Complete", value: "1/400" },
          ]}
        />
      </InfoCard>

      <InfoCard title="SHIPPING DETAILS">
        <InfoGrid
          columns={4}
          showDividers
          items={[
            { label: "Container Number", value: batch.shipping.containerNumber },
            { label: "Shipping Line", value: batch.shipping.shippingLine },
            { label: "Port of Arrival", value: batch.shipping.portOfArrival },
            { label: "Expected Delivery Date", value: batch.shipping.expectedDeliveryDate },
          ]}
        />
      </InfoCard>

      <InfoCard title="FINANCIAL DETAILS">
        <InfoGrid
          columns={4}
          showDividers
          items={[
            { label: "Payment Reference", value: batch.financials.paymentReference },
            { label: "Invoice / PO Reference", value: batch.financials.invoicePoReference },
          ]}
        />
      </InfoCard>

      {batch.notes && (
        <InfoCard title="NOTES">
          <p className="text-sm text-table-text">{batch.notes}</p>
        </InfoCard>
      )}
    </div>
  )
}
