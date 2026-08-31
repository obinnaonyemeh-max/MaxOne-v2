import { DatePickerField } from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormSection, FormField } from "@/pages/vehicles/FormControls"
import { CITY_DEPOT_OPTIONS } from "@/data/cities"
import type { AuctionForm } from "./types"

const locationOptions = CITY_DEPOT_OPTIONS.map((option) => option.value)

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

interface StepAuctionDetailsProps {
  form: AuctionForm
  onUpdateField: <K extends keyof AuctionForm>(field: K, value: AuctionForm[K]) => void
  onStartDateChange: (date: Date | undefined) => void
}

export function StepAuctionDetails({ form, onUpdateField, onStartDateChange }: StepAuctionDetailsProps) {
  return (
    <div className="p-5">
      <FormSection title="Auction Details">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <FormField label="Auction title">
            <Input
              value={form.title}
              onChange={(e) => onUpdateField("title", e.target.value)}
              placeholder="e.g. Lagos Disposal Run"
              className="h-9 bg-[#F8F8F8]"
            />
          </FormField>

          <FormField label="Location">
            <Select value={form.location} onValueChange={(v) => onUpdateField("location", v)}>
              <SelectTrigger className="w-full bg-[#F8F8F8] border border-input">
                <SelectValue placeholder="Select location..." />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Start date">
            <DatePickerField
              value={form.startDate}
              onChange={onStartDateChange}
              placeholder="DD/MM/YYYY"
              triggerClassName="bg-[#F8F8F8]"
              disabled={(date) => date <= startOfToday()}
            />
          </FormField>

          <FormField label="End date">
            <DatePickerField
              value={form.endDate}
              onChange={(d) => onUpdateField("endDate", d)}
              placeholder="DD/MM/YYYY"
              triggerClassName="bg-[#F8F8F8]"
              disabled={(date) => {
                if (date <= startOfToday()) return true
                if (form.startDate && date <= form.startDate) return true
                return false
              }}
            />
          </FormField>

          <FormField label="Min bid price (%)" hint="Percentage of the buyout price">
            <Input
              type="number"
              value={form.minBid}
              onChange={(e) => onUpdateField("minBid", e.target.value)}
              placeholder="100"
              className="h-9 bg-[#F8F8F8]"
            />
          </FormField>

          <FormField label="Minimum increment" hint="Smallest amount a bid can increase by">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-600" style={{ fontSize: "13px" }}>
                ₦
              </span>
              <Input
                type="number"
                value={form.minIncrement}
                onChange={(e) => onUpdateField("minIncrement", e.target.value)}
                placeholder="50,000"
                className="h-9 bg-[#F8F8F8] pl-7"
              />
            </div>
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}
