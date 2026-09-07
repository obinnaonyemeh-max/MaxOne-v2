import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { FalconDashboardBody } from "@/pages/falcon-dashboard/FalconDashboardBody"
import { FALCON_SLIDESHOW_SCREENS } from "@/pages/falcon-dashboard/falconSlideshow"

interface FalconDashboardSlideshowProps {
  onClose: () => void
}

export function FalconDashboardSlideshow({ onClose }: FalconDashboardSlideshowProps) {
  const [screenIndex, setScreenIndex] = useState(0)
  const screen = FALCON_SLIDESHOW_SCREENS[screenIndex]
  const total = FALCON_SLIDESHOW_SCREENS.length

  const goPrev = useCallback(() => {
    setScreenIndex((current) => (current - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setScreenIndex((current) => (current + 1) % total)
  }, [total])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") goPrev()
      if (event.key === "ArrowRight") goNext()
    }

    window.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [goNext, goPrev, onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-0 flex-col bg-content-card"
      role="dialog"
      aria-modal="true"
      aria-label={`Falcon metrics slideshow: ${screen.label}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 px-4 pt-4 pb-3">
        <h1
          className="flex items-end gap-1 font-semibold text-sidebar-item-active"
          style={{ fontSize: "22px" }}
        >
          {screen.label}
          <span className="mb-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-950"
          aria-label="Exit slideshow"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-16">
        <FalconDashboardBody moduleId={screen.id} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[110] flex justify-center">
        <div className="pointer-events-auto inline-flex items-center overflow-hidden rounded-full bg-gray-900 text-white shadow-lg">
          <button
            type="button"
            onClick={goPrev}
            className="px-3 py-2 text-white transition-colors hover:bg-white/10"
            aria-label="Previous screen"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="h-5 w-px bg-white/20" />
          <span className="min-w-16 px-4 py-2 text-center text-sm font-medium tabular-nums">
            {screenIndex + 1} / {total}
          </span>
          <span className="h-5 w-px bg-white/20" />
          <button
            type="button"
            onClick={goNext}
            className="px-3 py-2 text-white transition-colors hover:bg-white/10"
            aria-label="Next screen"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
