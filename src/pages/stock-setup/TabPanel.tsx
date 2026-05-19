import { Plus } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/max"
import { Button } from "@/components/ui/button"

export function TabPanel<T>({
  count,
  countLabel,
  addLabel,
  onAdd,
  columns,
  data,
}: {
  count: number
  countLabel: string
  addLabel: string
  onAdd: () => void
  columns: ColumnDef<T>[]
  data: T[]
}) {
  return (
    <div className="flex flex-1 flex flex-col min-h-0 rounded-t-[14px] rounded-b-[4px] border border-table-border">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 shrink-0">
        <span className="text-sm font-medium text-muted-foreground">
          {count} {countLabel}
        </span>
        <Button className="gap-2" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
