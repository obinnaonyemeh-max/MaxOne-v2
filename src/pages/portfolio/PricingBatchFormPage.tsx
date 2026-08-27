import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { TopBar, BackButton } from "@/components/max"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { mockCountries } from "@/data/mockCountries"
import {
  mockAssetClasses,
  mockVehicleTypeOptions,
  mockManufacturers,
  mockVehicleModels,
  mockVehicleTrims,
} from "@/data/mockVehicleCatalog"
import { mockPricingTemplates, costCategoryLabels } from "@/data/mockPricingTemplates"
import { mockFinanciers } from "@/data/mockFinanciers"
import {
  mockPricingBatchRecords,
  addPricingBatchRecord,
  batchGrandTotal,
  type BatchCostCategory,
  type PricingBatchRecord,
} from "@/data/mockPricingBatchRecords"
import { PricingBatchCostAccordion } from "./PricingBatchCostAccordion"
import { LiveCostSummaryCard } from "./LiveCostSummaryCard"
import { UploadVehiclesModal } from "./UploadVehiclesModal"

const PRICING_BATCHES_LIST_ROUTE = "/portfolio/pricing-configuration/pricing-batches"

export default function PricingBatchFormPage() {
  const { id } = useParams<{ id: string }>()
  return <PricingBatchForm key={id ?? "new"} editId={id} />
}

interface PricingBatchFormProps {
  editId?: string
}

function PricingBatchForm({ editId }: PricingBatchFormProps) {
  const navigate = useNavigate()
  const editingBatch = editId ? mockPricingBatchRecords.find((b) => b.id === editId) : undefined
  const isEditMode = editingBatch !== undefined

  const [countryId, setCountryId] = useState(editingBatch?.countryId ?? "")
  const [pricingTemplateId, setPricingTemplateId] = useState(editingBatch?.pricingTemplateId ?? "")
  const [assetClassId, setAssetClassId] = useState(editingBatch?.assetClassId ?? "")
  const [vehicleTypeId, setVehicleTypeId] = useState(editingBatch?.vehicleTypeId ?? "")
  const [manufacturerId, setManufacturerId] = useState(editingBatch?.manufacturerId ?? "")
  const [modelId, setModelId] = useState(editingBatch?.modelId ?? "")
  const [trimId, setTrimId] = useState(editingBatch?.trimId ?? "")
  const [financierId, setFinancierId] = useState(editingBatch?.financierId ?? "")
  const [costCategories, setCostCategories] = useState<BatchCostCategory[]>(editingBatch?.costCategories ?? [])
  const [vehicleCount, setVehicleCount] = useState(editingBatch?.vehicleCount ?? 0)
  const [showUpload, setShowUpload] = useState(false)

  const country = mockCountries.find((c) => c.id === countryId) ?? null

  const vehicleTypeOptions = useMemo(
    () => mockVehicleTypeOptions.filter((v) => v.assetClassId === assetClassId),
    [assetClassId]
  )
  const modelOptions = useMemo(() => mockVehicleModels.filter((m) => m.manufacturerId === manufacturerId), [manufacturerId])
  const trimOptions = useMemo(() => mockVehicleTrims.filter((t) => t.modelId === modelId), [modelId])

  const handleAssetClassChange = (value: string) => {
    setAssetClassId(value)
    setVehicleTypeId("")
  }

  const handleManufacturerChange = (value: string) => {
    setManufacturerId(value)
    setModelId("")
    setTrimId("")
  }

  const handleModelChange = (value: string) => {
    setModelId(value)
    setTrimId("")
  }

  const handleTemplateChange = (value: string) => {
    setPricingTemplateId(value)
    const template = mockPricingTemplates.find((t) => t.id === value)
    if (!template) return
    setCostCategories(
      template.costCategories.map((category) => ({
        key: category.key,
        label: costCategoryLabels[category.key],
        lineItems: category.lineItems.map((li) => ({ id: li.id, label: li.label, value: 0, auto: li.auto, unit: li.unit })),
      }))
    )
  }

  const handleLineItemChange = (categoryKey: string, lineItemId: string, value: number) => {
    setCostCategories((prev) =>
      prev.map((category) =>
        category.key !== categoryKey
          ? category
          : { ...category, lineItems: category.lineItems.map((li) => (li.id === lineItemId ? { ...li, value } : li)) }
      )
    )
  }

  const grandTotal = batchGrandTotal(costCategories)

  const isValid =
    countryId !== "" &&
    pricingTemplateId !== "" &&
    assetClassId !== "" &&
    vehicleTypeId !== "" &&
    manufacturerId !== "" &&
    modelId !== "" &&
    trimId !== "" &&
    financierId !== "" &&
    costCategories.length > 0

  const handleSave = () => {
    if (!isValid) return

    const template = mockPricingTemplates.find((t) => t.id === pricingTemplateId)!
    const assetClass = mockAssetClasses.find((a) => a.id === assetClassId)!
    const vehicleType = mockVehicleTypeOptions.find((v) => v.id === vehicleTypeId)!
    const manufacturer = mockManufacturers.find((m) => m.id === manufacturerId)!
    const model = mockVehicleModels.find((m) => m.id === modelId)!
    const trim = mockVehicleTrims.find((t) => t.id === trimId)!
    const financier = mockFinanciers.find((f) => f.id === financierId)!

    const nextSeq = mockPricingBatchRecords.length + 1
    const record: PricingBatchRecord = {
      id: editingBatch ? editingBatch.id : String(nextSeq),
      code: editingBatch ? editingBatch.code : `MAX-${country!.code}-BATCH-${String(nextSeq).padStart(3, "0")}`,
      countryId: country!.id,
      countryName: country!.name,
      pricingTemplateId: template.id,
      pricingTemplateName: template.name,
      assetClassId: assetClass.id,
      assetClassName: assetClass.name,
      vehicleTypeId: vehicleType.id,
      vehicleTypeName: vehicleType.name,
      manufacturerId: manufacturer.id,
      manufacturerName: manufacturer.name,
      modelId: model.id,
      modelName: model.name,
      trimId: trim.id,
      trimName: trim.name,
      financierId: financier.id,
      financierName: financier.financierName,
      costCategories,
      grandTotal,
      vehicleCount,
      status: editingBatch?.status ?? "Active",
      dateCreated:
        editingBatch?.dateCreated ??
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    }

    if (editingBatch) {
      const index = mockPricingBatchRecords.findIndex((b) => b.id === editingBatch.id)
      if (index !== -1) mockPricingBatchRecords[index] = record
    } else {
      addPricingBatchRecord(record)
    }

    toast.success(isEditMode ? "Pricing batch updated" : "Pricing batch created", {
      description: `${record.code} — ${record.manufacturerName} ${record.modelName} (${record.trimName})`,
    })
    navigate(PRICING_BATCHES_LIST_ROUTE)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Products & Pricing" },
          { label: "Pricing Configuration" },
          { label: "Pricing Batches", href: PRICING_BATCHES_LIST_ROUTE },
          { label: isEditMode ? "Edit" : "New" },
        ]}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 flex items-center gap-3">
          <BackButton onClick={() => navigate(PRICING_BATCHES_LIST_ROUTE)} />
          <div>
            <h1 className="flex items-end gap-1 font-semibold text-sidebar-item-active" style={{ fontSize: "22px" }}>
              {isEditMode ? `Edit Pricing Batch ${editingBatch?.code}` : "Create New Pricing Batch"}
              <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
            </h1>
            <p className="mt-1 text-sm font-medium text-breadcrumb-root">
              Define pricing for a vehicle batch by inheriting a pricing template and linking a financier
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-3 gap-6 items-start">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <FormSection title="Target Country & Pricing Template">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Target Country *">
                    <Select value={countryId} onValueChange={setCountryId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCountries.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Pricing Template *">
                    <Select value={pricingTemplateId} onValueChange={handleTemplateChange}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select pricing template" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPricingTemplates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </FormSection>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <FormSection title="Vehicle & Financier Details">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Asset Class *">
                    <Select value={assetClassId} onValueChange={handleAssetClassChange}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select asset class" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAssetClasses.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Vehicle Type *">
                    <Select value={vehicleTypeId} onValueChange={setVehicleTypeId} disabled={!assetClassId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder={assetClassId ? "Select vehicle type" : "Select asset class first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypeOptions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Manufacturer *">
                    <Select value={manufacturerId} onValueChange={handleManufacturerChange}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockManufacturers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Model *">
                    <Select value={modelId} onValueChange={handleModelChange} disabled={!manufacturerId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder={manufacturerId ? "Select model" : "Select manufacturer first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Trim *">
                    <Select value={trimId} onValueChange={setTrimId} disabled={!modelId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder={modelId ? "Select trim" : "Select model first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {trimOptions.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Financier *">
                    <Select value={financierId} onValueChange={setFinancierId}>
                      <SelectTrigger className="h-9 w-full bg-input-soft">
                        <SelectValue placeholder="Select financier" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockFinanciers.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.financierName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </FormSection>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <FormSection title="Cost Breakdown">
                {costCategories.length === 0 ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-25 py-10">
                    <p className="text-sm font-medium text-breadcrumb-root">
                      Select a pricing template to load cost line items.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {costCategories.map((category) => (
                      <PricingBatchCostAccordion
                        key={category.key}
                        category={category}
                        onLineItemChange={handleLineItemChange}
                      />
                    ))}
                  </div>
                )}
              </FormSection>
            </div>
          </div>

          <div className="col-span-1">
            <LiveCostSummaryCard
              country={country}
              costCategories={costCategories}
              grandTotal={grandTotal}
              vehicleCount={vehicleCount}
              onUploadVehicles={() => setShowUpload(true)}
            />
          </div>
        </div>

        <div className="px-6 border-t border-divider py-4 mt-2">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate(PRICING_BATCHES_LIST_ROUTE)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-dark text-white hover:bg-brand-dark/90"
              disabled={!isValid}
              onClick={handleSave}
            >
              {isEditMode ? "Save Changes" : "Create Batch"}
            </Button>
          </div>
        </div>
      </div>

      <UploadVehiclesModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onComplete={(count) => setVehicleCount((prev) => prev + count)}
      />
    </>
  )
}
