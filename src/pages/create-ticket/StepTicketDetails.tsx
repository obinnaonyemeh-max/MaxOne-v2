import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import {
  InfoCard,
  InfoGrid,
  StatusBadge,
  VehicleOverviewCard,
} from "@/components/max"
import { priorityVariantMap } from "@/data/mockTicketRecords"
import type { ChampionDetails } from "@/data/mockChampionDetails"
import { CallScriptRenderer } from "./CallScriptRenderer"
import type { TicketCategory, TicketSubcategory, TicketDetailsForm } from "./types"

const vehicleRelatedCategoryIds = new Set(["cat-1", "cat-5", "cat-7", "cat-11"])

interface StepTicketDetailsProps {
  champion: ChampionDetails
  category: TicketCategory
  subcategory: TicketSubcategory
  details: TicketDetailsForm
  onUpdateField: (field: keyof TicketDetailsForm, value: TicketDetailsForm[keyof TicketDetailsForm]) => void
  callScriptAnswers: Record<string, string>
  onUpdateCallScriptAnswer: (questionId: string, value: string) => void
}

export function StepTicketDetails({
  champion,
  category,
  subcategory,
  details,
  onUpdateField,
  callScriptAnswers,
  onUpdateCallScriptAnswer,
}: StepTicketDetailsProps) {
  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left column — form */}
      <div className="col-span-3 space-y-6">
        <div className="rounded-lg border border-gray-200 p-5 space-y-6">
          <FormSection title="Ticket Information">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <FormField label="Platform">
                <Select
                  value={details.platform}
                  onValueChange={(v) => onUpdateField("platform", v)}
                >
                  <SelectTrigger className="w-full bg-[#F8F8F8] border border-input">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phone Call">Phone Call</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="In-App">In-App</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Reporter">
                <Input
                  value={details.reporter}
                  onChange={(e) => onUpdateField("reporter", e.target.value)}
                  placeholder="Enter reporter name"
                  className="h-9 bg-[#F8F8F8]"
                />
              </FormField>

              <FormField label="Priority">
                <Select
                  value={details.priority}
                  onValueChange={(v) => onUpdateField("priority", v)}
                >
                  <SelectTrigger className="w-full bg-[#F8F8F8] border border-input">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="City">
                <Select
                  value={details.city}
                  onValueChange={(v) => onUpdateField("city", v)}
                >
                  <SelectTrigger className="w-full bg-[#F8F8F8] border border-input">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Ibadan">Ibadan</SelectItem>
                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </FormSection>
        </div>

        <div className="rounded-lg border border-gray-200 p-5">
          <CallScriptRenderer
            subcategoryId={subcategory.id}
            categoryId={category.id}
            answers={callScriptAnswers}
            onAnswerChange={onUpdateCallScriptAnswer}
          />
        </div>
      </div>

      {/* Right column — summary */}
      <div className="col-span-2 space-y-4">
        <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
          <div className="bg-white border border-[#f3f3f3] rounded py-3 px-3">
            <div className="flex items-center gap-2.5">
              <img
                src={champion.avatarUrl || "/images/champvatar.png"}
                alt={champion.name}
                className="w-[54px] h-[54px] rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col">
                <p className="font-medium text-sidebar-item-active text-[15px] tracking-[-0.15px]">
                  {champion.name}
                </p>
                {champion.riskLevel && (
                  <span
                    className={cn(
                      "inline-block w-fit font-medium rounded-full mt-1 text-[11.5px] tracking-[-0.115px] px-1.5 py-0.5",
                      champion.riskLevel === "High Risk" && "bg-[#ffecec] text-[#dc2626]",
                      champion.riskLevel === "Medium Risk" && "bg-[#fff3e0] text-[#f59e0b]",
                      champion.riskLevel === "Low Risk" && "bg-[#fff3e0] text-[#f59e0b]"
                    )}
                  >
                    {champion.riskLevel}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-breadcrumb-root text-[13px] tracking-[-0.13px]">Phone Number</span>
              <span className="font-medium text-sidebar-item-active text-right text-[13px] tracking-[-0.13px]">{champion.phoneNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-breadcrumb-root text-[13px] tracking-[-0.13px]">Contract status</span>
              <StatusBadge
                variant={
                  champion.contractStatus === "Active" ? "success"
                    : champion.contractStatus === "Inactive" ? "neutral"
                    : "warning"
                }
                withDot
                size="sm"
              >
                {champion.contractStatus}
              </StatusBadge>
            </div>
          </div>
        </div>

        {vehicleRelatedCategoryIds.has(category.id) && (
          <VehicleOverviewCard
            className="bg-gray-50 border-gray-100"
            imageUrl={champion.vehicle.imageUrl}
            details={[
              { label: "Asset Type", value: champion.vehicle.assetType },
              { label: "Manufacturer", value: champion.vehicle.manufacturer },
              {
                label: "Contract Status",
                value: champion.vehicle.contractStatus,
                isStatus: true,
                statusVariant: champion.vehicle.contractStatus === "Active" ? "success" as const : "warning" as const,
              },
              { label: "Last Pinged", value: champion.vehicle.lastPingedOn },
            ]}
          />
        )}

        <InfoCard title="Selection Summary">
          <InfoGrid
            columns={2}
            items={[
              { label: "Champion", value: champion.name },
              { label: "Category", value: category.name },
              { label: "Subcategory", value: subcategory.name },
              { label: "Concerned Team", value: subcategory.concernedTeam },
              { label: "SLA", value: subcategory.slaTime },
              {
                label: "Priority",
                value: (
                  <StatusBadge
                    variant={priorityVariantMap[subcategory.priorityLevel]}
                    withDot
                    size="sm"
                  >
                    {subcategory.priorityLevel}
                  </StatusBadge>
                ),
              },
            ]}
          />
        </InfoCard>

      </div>
    </div>
  )
}
