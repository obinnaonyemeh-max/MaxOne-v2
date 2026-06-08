import { useRef, useEffect } from "react"
import { Landmark, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip"
import gsap from "gsap"

interface BankAccount {
  bankName: string
  accountNumber: string
  iconUrl?: string
  isPrimary?: boolean
}

interface WalletInformationProps {
  balance: string
  bvn: string
  bankAccounts: BankAccount[]
  className?: string
}

export function WalletInformation({
  balance,
  bvn,
  bankAccounts,
  className,
}: WalletInformationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const balanceRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true
        observer.disconnect()

        const numericBalance = Number(balance.replace(/,/g, "")) || 0
        const counter = { value: 0 }

        gsap.to(counter, {
          value: numericBalance,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (balanceRef.current) {
              balanceRef.current.textContent = Math.round(counter.value).toLocaleString()
            }
          },
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [balance])

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg pt-7 px-5 pb-5 flex flex-col gap-4",
        className
      )}
    >
      {/* Balance */}
      <div className="flex flex-col">
        <span className="font-medium text-xs text-sidebar-item-active capitalize mb-2">
          Available Balance
        </span>
        <div className="flex items-baseline">
          <span className="font-bold text-lg text-black">₦</span>
          <span
            ref={balanceRef}
            className="font-bold text-[28px] text-black uppercase leading-none"
          >
            0
          </span>
        </div>
      </div>

      {/* Bank details row */}
      <div className="flex items-center gap-2 w-full">
        {/* BVN card */}
        <div className="bg-white border border-[#e6e6e6] rounded-lg h-[46px] flex items-center gap-2 px-3 shrink-0">
          <div className="bg-[#ececec] rounded-md flex items-center justify-center h-5 w-5 shrink-0">
            <Landmark className="h-3 w-3 text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[10px] text-[#a0a1a1] capitalize whitespace-nowrap">
              Bank Verification Number (BVN)
            </span>
            <span className="font-bold text-xs text-black">{bvn}</span>
          </div>
        </div>

        {/* Bank account cards */}
        {bankAccounts.map((account, index) => (
          <div
            key={index}
            className="bg-white border border-[#e6e6e6] rounded-lg h-[46px] flex items-center gap-3 px-3 flex-1 min-w-0"
          >
            {account.iconUrl ? (
              <img
                src={account.iconUrl}
                alt={account.bankName}
                className="h-5 w-5 object-contain shrink-0"
              />
            ) : (
              <div className="bg-[#ececec] rounded-md flex items-center justify-center h-5 w-5 shrink-0">
                <Landmark className="h-3 w-3 text-gray-500" />
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-[10px] text-[#a0a1a1] capitalize truncate">
                {account.bankName}
              </span>
              <span className="font-bold text-xs text-black">{account.accountNumber}</span>
            </div>
            {account.isPrimary && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Star className="h-3.5 w-3.5 text-black shrink-0" fill="currentColor" />
                </TooltipTrigger>
                <TooltipContent>Primary Account</TooltipContent>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
