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
}) => {
  const isOverall = label === "全体平均";
  const hideBar = isOverall && (type === "month" || type === "week");

  const unit = isOverall
    ? type === "month"
      ? "回/月"
      : type === "week"
        ? "回/週"
        : "回/日"
    : "回/日";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", color)}></div>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {!hideBar && (
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={cn("h-full rounded-full transition-all duration-1000", color)}
              style={{ width: `${(value / max) * 100}%` }}
            ></div>
          </div>
        )}
        <p className={cn("text-sm min-w-[80px] text-right", valueColor)}>
          {value.toLocaleString()}
          {unit}
        </p>
      </div>
    </div>
  );
};
