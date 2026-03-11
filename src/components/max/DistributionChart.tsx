import { cn } from "@/lib/utils"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

export interface DistributionDataItem {
  label: string
  value: number
  color: string
}

interface DistributionChartProps {
  title: string
  data: DistributionDataItem[]
  className?: string
}

export function DistributionChart({
  title,
  data,
  className,
}: DistributionChartProps) {
  const series = data.map((item) => item.value)
  const colors = data.map((item) => item.color)

  const options: ApexOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
      },
    },
    colors,
    labels: data.map((item) => item.label),
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
      },
    },
    stroke: {
      width: 6,
      colors: ["#FDFDFD"],
      lineCap: "round",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.9,
        } as { type: string; value?: number },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
  }

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4",
        className
      )}
    >
      <h4
        className="text-gray-950 mb-4"
        style={{ fontSize: "16px", fontWeight: 500 }}
      >
        {title}
      </h4>

      <div className="flex items-center" style={{ gap: "100px" }}>
        <div className="shrink-0" style={{ width: "185px", height: "185px" }}>
          <Chart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height="100%"
          />
        </div>

        <div className="flex-1">
          <p
            className="text-gray-600 mb-2"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Legend
          </p>
          <div className="space-y-1.5">
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="shrink-0 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="text-gray-400"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  {item.label}
                </span>
                <span
                  className="text-gray-950"
                  style={{ fontSize: "12px", fontWeight: 500, marginLeft: "-4px" }}
                >
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
