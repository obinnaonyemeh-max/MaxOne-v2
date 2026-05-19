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

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-400 font-medium" style={{ fontSize: "13px" }}>{label}</label>
      {children}
    </div>
  )
}
