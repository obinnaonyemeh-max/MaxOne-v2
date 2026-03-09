import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className={cn("px-2", className)}>
        <Table>
          <TableHeader className="sticky top-0 z-10 [&_tr]:border-0">
            <TableRow className="hover:bg-transparent border-0">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="h-11 bg-table-header-bg text-table-header-text font-medium first:rounded-l-lg last:rounded-r-lg first:pl-4 last:pr-4"
                  style={{ fontSize: '13px' }}
                >
                  {typeof column.header === "string"
                    ? column.header
                    : "Loading..."}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex} className="py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className={cn("px-2", className)}>
      <Table>
        <TableHeader className="sticky top-0 z-10 [&_tr]:border-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-0"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-11 bg-table-header-bg text-table-header-text font-medium first:rounded-l-lg last:rounded-r-lg first:pl-4 last:pr-4"
                  style={{ fontSize: '13px' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "border-gray-100",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-4 first:pl-4 last:pr-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
