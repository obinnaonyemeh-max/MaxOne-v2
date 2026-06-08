import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"

interface ContractInformationProps {
  /** Percentage of contract elapsed (0–100) */
  percentage: number
  /** Total days in the contract */
  totalDays: number
  /** Days elapsed so far */
  daysElapsed: number
  /** Contract start date string, e.g. "12 Mar 2024" */
  startDate: string
  /** Contract end date string, e.g. "12 Sep 2025" */
  endDate: string
  className?: string
}

const TOTAL_BARS = 136

export function ContractInformation({
  percentage,
  totalDays,
  daysElapsed,
  startDate,
  endDate,
  className,
}: ContractInformationProps) {
  const filledBars = Math.round((percentage / 100) * TOTAL_BARS)
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const [displayDays, setDisplayDays] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true
        observer.disconnect()

        const counter = { value: 0, days: 0 }

        gsap.to(counter, {
          value: percentage,
          days: daysElapsed,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value))
            }
            setDisplayDays(Math.round(counter.days))
          },
        })

        if (barsRef.current) {
          const bars = barsRef.current.children
          for (let i = 0; i < filledBars; i++) {
            gsap.to(bars[i], {
              backgroundColor: "var(--color-sidebar-item-active)",
              duration: 0.4,
              delay: (i / filledBars) * 0.8,
              ease: "power1.out",
            })
          }
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [percentage, daysElapsed, filledBars])

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-[#f9f8f6] border border-[#f3f3f3] rounded-lg pt-7 px-5 pb-5",
        className
      )}
    >
      {/* Percentage and date range */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-0.5">
          <span
            ref={counterRef}
            className="font-bold text-[28px] text-sidebar-item-active uppercase leading-none"
          >
            0
          </span>
          <span className="font-bold text-xs text-sidebar-item-active uppercase pt-2">
            %
          </span>
        </div>
        <span className="font-medium text-xs text-breadcrumb-root capitalize pt-1">
          {startDate} &rarr; {endDate}
        </span>
      </div>

      {/* Progress bar */}
      <div ref={barsRef} className="flex items-center gap-[2px] mb-4">
        {Array.from({ length: TOTAL_BARS }).map((_, i) => (
          <div
            key={i}
            className="h-[27px] min-w-[3px] flex-1 rounded-[2px] bg-[#d9d9d9]"
          />
        ))}
      </div>

      {/* Elapsed text */}
      <p className="font-medium text-xs text-sidebar-item-active capitalize">
        {displayDays} of {totalDays} Days Elapsed
      </p>
    </div>
  )
}
