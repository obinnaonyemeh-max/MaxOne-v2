import { cn } from "@/lib/utils"

export interface StatusTab {
  id: string
  label: string
  count: number
}

interface StatusTabsProps {
  tabs: StatusTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return count.toLocaleString()
  }
  return count.toString()
}

export function StatusTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: StatusTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto border-b border-transparent px-6",
        className
      )}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab
        const isFirst = index === 0

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative whitespace-nowrap px-2 py-3 text-sm font-medium transition-colors duration-200 ease-in-out",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>
              {isFirst ? (
                <>
                  <span>
                    {tab.label}
                  </span>
                  <span className="ml-1">({formatCount(tab.count)})</span>
                </>
              ) : (
                <>
                  {tab.label}
                  <span className="ml-1 text-muted-foreground">
                    ({formatCount(tab.count)})
                  </span>
                </>
              )}
            </span>
            <span 
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-200 ease-in-out",
                isActive 
                  ? "opacity-100 scale-x-100" 
                  : "opacity-0 scale-x-0"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
