
import * as RechartsPrimitive from "recharts"
import ChartContainer from "./ChartContainer"
import ChartStyle from "./ChartStyle"
import ChartTooltipContent from "./ChartTooltipContent"
import ChartLegendContent from "./ChartLegendContent"
import { ChartConfig } from "./types"
import { useChart } from "./ChartContext"

// Create simple re-exports for the tooltip and legend
const ChartTooltip = RechartsPrimitive.Tooltip
const ChartLegend = RechartsPrimitive.Legend

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
  type ChartConfig
}
