import type { HTMLAttributes, KeyboardEvent } from "react"

/** Keyboard-operable props for a mouse-clickable non-button surface. */
export function clickableSurfaceProps(
  onClick?: () => void,
  ariaLabel?: string
): HTMLAttributes<HTMLElement> {
  if (!onClick) return {}
  return {
    role: "button",
    tabIndex: 0,
    onClick,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onClick()
      }
    },
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
  }
}
