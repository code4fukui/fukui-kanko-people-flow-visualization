import { GRAPH_VIEW_TYPES } from "@fukui-kanko/shared";
import { cn } from "@fukui-kanko/shared/utils";

type AverageBarProps = {
  color: string;
  label: string;
  value: number;
  max: number;
  valueColor: string;
  type: keyof typeof GRAPH_VIEW_TYPES;
};

export const AverageBar: React.FC<AverageBarProps> = ({
  color,
  label,
  value,
  max,
  valueColor,
  type,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)}></div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
    <div className="flex items-center gap-2">
      {type === "day" && (
        <div className="w-16 bg-gray-200 rounded-full h-1.5">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", color)}
            style={{
              width: `${(value / max) * 100}%`,
            }}
          ></div>
        </div>
      )}
      <p className={cn("text-sm min-w-[70px] text-right", valueColor)}>
        {value.toLocaleString()}回/
        {type === "month" ? "月" : type === "week" ? "週" : type === "day" ? "日" : ""}
      </p>
    </div>
  </div>
);
