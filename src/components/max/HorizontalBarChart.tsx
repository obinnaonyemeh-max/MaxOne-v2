import { cn } from "@/lib/utils"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"

export interface BarChartSeries {
  name: string
  data: number[]
  color: string
}

interface HorizontalBarChartProps {
  title: string
  categories: string[]
  series: BarChartSeries[]
  showLegend?: boolean
  stacked?: boolean
  className?: string
}

export function HorizontalBarChart({
  title,
  categories,
  series,
  showLegend = false,
  stacked = false,
  className,
}: HorizontalBarChartProps) {
  const chartSeries = series.map((s) => ({
    name: s.name,
    data: s.data,
  }))

  const colors = series.map((s) => s.color)

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    colors,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3A3A3",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#555556",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: "#EAEAEA",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      show: showLegend,
      position: "bottom",
      horizontalAlign: "right",
      markers: {
        size: 8,
        shape: "circle",
      },
      fontSize: "12px",
      fontWeight: 500,
      labels: {
        colors: "#555556",
      },
      itemMargin: {
        horizontal: 12,
      },
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
        },
      },
    },
  }

  return (
    <div
      className={cn(
        "bg-gray-25 border border-gray-200 rounded-lg",
        className
      )}
    >
      <div className="px-5 pt-5 pb-2">
        <h3
          className="text-gray-950"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {title}
        </h3>
      </div>

      <div className="px-3 pb-4">
        <Chart
          options={options}
          series={chartSeries}
          type="bar"
          height={250}
        />
      </div>
    </div>
  )
}
