import { cn } from "@/lib/utils"

export interface ActivationQueueItem {
  activationType: string
  count: number
  overdue: number
}

interface ActivationQueueCardProps {
  title?: string
  data: ActivationQueueItem[]
  className?: string
}

export function ActivationQueueCard({
  title = "Activation Queue",
  data,
  className,
}: ActivationQueueCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg",
        className
      )}
    >
      <div className="px-5 pt-5 pb-4">
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
      </div>

      <div className="px-5 pb-5">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="text-left text-gray-600 px-4 py-3"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  Activation type
                </th>
                <th
                  className="text-left text-gray-600 px-4 py-3"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  Count
                </th>
                <th
                  className="text-left text-gray-600 px-4 py-3"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  &gt;48hrs
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    index < data.length - 1 && "border-b border-gray-100"
                  )}
                >
                  <td
                    className="text-gray-600 px-4 py-3"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {item.activationType}
                  </td>
                  <td
                    className="text-gray-950 px-4 py-3"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {item.count}
                  </td>
                  <td
                    className="text-status-danger px-4 py-3"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {item.overdue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
