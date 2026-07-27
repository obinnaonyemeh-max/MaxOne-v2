import { cn } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"

type RiskLevel = "High Risk" | "Medium Risk" | "Low Risk"
type ContractStatus = "Early Arrears" | "Active" | "Inactive" | "Defaulting"

interface ChampionInformationProps {
  name: string
  avatarUrl?: string
  riskLevel?: RiskLevel
  phoneNumber: string
  location: string
  onboardedDate: string
  contractStatus: ContractStatus
  className?: string
}

const contractVariantMap: Record<ContractStatus, "warning" | "success" | "danger" | "neutral"> = {
  "Early Arrears": "warning",
  "Active": "success",
  "Inactive": "neutral",
  "Defaulting": "danger",
}

export function ChampionInformation({
  name,
  avatarUrl = "/images/champvatar.png",
  riskLevel,
  phoneNumber,
  location,
  onboardedDate,
  contractStatus,
  className,
}: ChampionInformationProps) {
  return (
    <div
      className={cn(
        "bg-content-card border border-border rounded-lg flex flex-col gap-4 pt-6 pb-5 px-5",
        className
      )}
    >
      {/* Champion name section */}
      <div className="bg-[#fcfcfc] border border-[#f3f3f3] rounded py-[15px] px-4">
        <div className="flex items-center gap-2.5">
          <img
            src={avatarUrl}
            alt={name}
            className="w-[54px] h-[54px] rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col">
            <p className="font-medium text-sidebar-item-active text-[15px] tracking-[-0.15px]">
              {name}
            </p>
            {riskLevel && (
              <span
                className={cn(
                  "inline-block w-fit font-medium rounded-full mt-1 text-[11.5px] tracking-[-0.115px] px-1.5 py-0.5",
                  riskLevel === "High Risk" && "bg-[#ffecec] text-[#dc2626]",
                  riskLevel === "Medium Risk" && "bg-[#fff3e0] text-[#f59e0b]",
                  riskLevel === "Low Risk" && "bg-[#fff3e0] text-[#f59e0b]"
                )}
              >
                {riskLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Champion details */}
      <div className="flex flex-col gap-3">
        <DetailRow label="Phone Number" value={phoneNumber} />
        <DetailRow label="Location" value={location} />
        <DetailRow label="Onboarded" value={onboardedDate} />
        <div className="flex items-center justify-between">
          <span className="font-medium text-breadcrumb-root text-[13px] tracking-[-0.13px]">
            Contract status
          </span>
          <StatusBadge variant={contractVariantMap[contractStatus]} withDot size="sm">
            {contractStatus}
          </StatusBadge>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-breadcrumb-root text-[13px] tracking-[-0.13px]">
        {label}
      </span>
      <span className="font-medium text-sidebar-item-active text-right text-[13px] tracking-[-0.13px]">
        {value}
      </span>
    </div>
  )
}
