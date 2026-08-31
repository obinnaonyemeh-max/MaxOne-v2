import React from "react"

export function AddVehicleOptionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-transparent bg-gray-50 p-6 text-center transition-all hover:border-gray-300"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        <img src={icon} alt="" className="h-12 w-auto" />
      </div>
      <div>
        <p className="font-semibold text-sidebar-item-active" style={{ fontSize: "14px" }}>{title}</p>
        <p className="mt-1 font-medium text-breadcrumb-root" style={{ fontSize: "12px" }}>{description}</p>
      </div>
    </button>
  )
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-status-info" />
        <h3 className="font-semibold text-sidebar-item-active uppercase" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

export { FormField } from "@/components/max/FormField"

