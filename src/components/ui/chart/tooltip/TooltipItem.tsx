
import * as React from "react"
import { cn } from "@/lib/utils"
import { getPayloadConfigFromPayload } from "../utils"
import { ChartConfig } from "../types"

interface TooltipItemProps {
  item: any;
  index: number;
  config: ChartConfig;
  formatter?: (value: any, name: string, props: any, index: number, payload: any) => React.ReactNode;
  indicator?: "line" | "dot" | "dashed";
  hideIndicator?: boolean;
  nestLabel?: boolean;
  nameKey?: string;
}

export const TooltipItem: React.FC<TooltipItemProps> = ({
  item,
  index,
  config,
  formatter,
  indicator = "dot",
  hideIndicator = false,
  nestLabel = false,
  nameKey,
}) => {
  const key = `${nameKey || item.name || item.dataKey || "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor = item.payload?.fill || item.color

  if (formatter && item?.value !== undefined && item.name) {
    return formatter(item.value, item.name, item, index, item.payload)
  }

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center"
      )}
    >
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <TooltipIndicator 
            indicator={indicator} 
            color={indicatorColor} 
            nestLabel={nestLabel} 
          />
        )
      )}
      <div
        className={cn(
          "flex flex-1 justify-between leading-none",
          nestLabel ? "items-end" : "items-center"
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel}
          <span className="text-muted-foreground">
            {itemConfig?.label || item.name}
          </span>
        </div>
        {item.value && (
          <span className="font-mono font-medium tabular-nums text-foreground">
            {item.value.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}

interface TooltipIndicatorProps {
  indicator: "line" | "dot" | "dashed";
  color?: string;
  nestLabel?: boolean;
}

export const TooltipIndicator: React.FC<TooltipIndicatorProps> = ({
  indicator,
  color,
  nestLabel
}) => {
  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicator === "dashed",
          "my-0.5": nestLabel && indicator === "dashed",
        }
      )}
      style={
        {
          "--color-bg": color,
          "--color-border": color,
        } as React.CSSProperties
      }
    />
  )
}

export default TooltipItem
