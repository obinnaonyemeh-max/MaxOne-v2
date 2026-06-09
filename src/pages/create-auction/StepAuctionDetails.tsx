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
import type { AuctionForm } from "./types"

const locationOptions = ["Lagos Main Depot", "Abuja Fleet Depot", "Port Harcourt Depot"]

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

          <FormField label="Min bid price (%)">
            <Input
              type="number"
              value={form.minBid}
              onChange={(e) => onUpdateField("minBid", e.target.value)}
              placeholder="100"
              className="h-9 bg-[#F8F8F8]"
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}
