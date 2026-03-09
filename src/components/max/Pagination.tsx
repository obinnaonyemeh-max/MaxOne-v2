import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  itemLabel?: string
  className?: string
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push("ellipsis")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis")
    }

    pages.push(totalPages)
  }

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  itemLabel = "items",
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pages = generatePageNumbers(currentPage, totalPages)

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 px-2 py-2",
        className
      )}
    >
      <p className="font-medium text-pagination-text" style={{ fontSize: '13px' }}>
        Showing{" "}
        <span className="font-medium text-sidebar-item-active">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-sidebar-item-active">
          {totalItems.toLocaleString()}
        </span>{" "}
        {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 font-medium text-sidebar-item-active"
              style={{ fontSize: '13px' }}
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 min-w-8 px-3 font-medium",
                currentPage === page
                  ? "bg-brand-dark text-white hover:bg-brand-dark/90"
                  : "border-border bg-white text-sidebar-item-active hover:bg-gray-50"
              )}
              style={{ fontSize: '13px' }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="font-medium text-pagination-text" style={{ fontSize: '13px' }}>Showing per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[76px] border-border font-medium text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option.toString()}
                  className="font-medium text-foreground"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
