import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChampionInformation } from "@/components/max/ChampionInformation"
import { mockChampionDetails, type ChampionDetails } from "@/data/mockChampionDetails"

interface StepSelectChampionProps {
  searchQuery: string
  selectedChampion: ChampionDetails | null
  onSearchChange: (query: string) => void
  onSelectChampion: (champion: ChampionDetails) => void
  onClearChampion: () => void
}

export function StepSelectChampion({
  searchQuery,
  selectedChampion,
  onSearchChange,
  onSelectChampion,
  onClearChampion,
}: StepSelectChampionProps) {
  const champions = Object.values(mockChampionDetails)

  const filteredChampions = searchQuery.trim()
    ? champions.filter((c) => {
        const q = searchQuery.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.championId.toLowerCase().includes(q)
        )
      })
    : []

  if (selectedChampion) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "15px" }}>
            Selected Champion
          </h3>
          <Button variant="outline" size="sm" onClick={onClearChampion}>
            Change
          </Button>
        </div>
        <ChampionInformation
          name={selectedChampion.name}
          avatarUrl={selectedChampion.avatarUrl}
          riskLevel={selectedChampion.riskLevel}
          phoneNumber={selectedChampion.phoneNumber}
          location={selectedChampion.location}
          onboardedDate={selectedChampion.onboardedDate}
          lastPingedOn={selectedChampion.lastPingedOn}
          contractStatus={selectedChampion.contractStatus as "Active" | "Inactive" | "Early Arrears" | "Defaulting"}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sidebar-item-active" style={{ fontSize: "15px" }}>
        Search for a Champion
      </h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search champion by name or ID..."
          className="pl-9 h-10"
        />
      </div>

      {searchQuery.trim() && filteredChampions.length > 0 && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {filteredChampions.map((champion) => (
            <button
              key={champion.id}
              type="button"
              onClick={() => onSelectChampion(champion)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <img
                src={champion.avatarUrl || "/images/champvatar.png"}
                alt={champion.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-item-active text-sm truncate">
                  {champion.name}
                </p>
                <p className="text-xs text-breadcrumb-root">
                  {champion.championId} &middot; {champion.location}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searchQuery.trim() && filteredChampions.length === 0 && (
        <p className="text-sm text-breadcrumb-root py-4 text-center">
          No champions found matching "{searchQuery}"
        </p>
      )}
    </div>
  )
}
