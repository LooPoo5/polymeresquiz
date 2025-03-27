
import * as React from "react"
import { cn } from "@/lib/utils"
import { getPayloadConfigFromPayload } from "../utils"
import { ChartConfig } from "../types"

interface TooltipLabelProps {
  payload?: any[];
  label?: React.ReactNode;
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
  labelClassName?: string;
  hideLabel?: boolean;
  config: ChartConfig;
  labelKey?: string;
}

export const TooltipLabel: React.FC<TooltipLabelProps> = ({
  payload,
  label,
  labelFormatter,
  labelClassName,
  hideLabel,
  config,
  labelKey,
}) => {
  if (hideLabel || !payload?.length) {
    return null;
  }

  const [item] = payload;
  const key = `${labelKey || item.dataKey || item.name || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const value =
    !labelKey && typeof label === "string"
      ? config[label as keyof typeof config]?.label || label
      : itemConfig?.label;

  if (labelFormatter) {
    return (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    );
  }

  if (!value) {
    return null;
  }

  return <div className={cn("font-medium", labelClassName)}>{value}</div>;
};

export default TooltipLabel;
