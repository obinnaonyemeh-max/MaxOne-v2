import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react"

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined

  const describedBy = [error ? errorId : undefined, hint && !error ? hintId : undefined]
    .filter(Boolean)
    .join(" ") || undefined

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: (children.props as { id?: string }).id ?? fieldId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-2">
        <span className="text-gray-600 font-medium" style={{ fontSize: "13px" }}>
          {label}
        </span>
        {control}
      </label>
      {error && (
        <p id={errorId} role="alert" className="font-medium text-status-danger" style={{ fontSize: "12px" }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-gray-600 font-medium" style={{ fontSize: "12px" }}>
          {hint}
        </p>
      )}
    </div>
  )
}
