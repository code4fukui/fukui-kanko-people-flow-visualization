import {
  DownloadCSVButton,
  MonthRangePicker,
  RangeSelector,
} from "@fukui-kanko/shared/components/parts";
import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared/types";
import { cn } from "@fukui-kanko/shared/utils";
import RainbowLineStackedBarChart from "./rainbow-line-stacked-bar-chart";
import { RainbowLinePieChart } from "./rainbowe-line-pie-chart";

export function RainbowLineChartPanel({
  type,
  period,
  setPeriod,
  isCompareMode,
  data,
  className,
}: {
  type: keyof typeof GRAPH_VIEW_TYPES;
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  isCompareMode: boolean;
  data: AggregatedData[];
  className?: string;
}) {
  const dataInRange = data.filter((row) => {
    const aggregatedFrom = new Date(row["aggregate from"]);
    return (
      aggregatedFrom >=
        (type === "week"
          ? period.startWeekRange?.from || new Date(0)
          : type === "month"
            ? period.startMonth || new Date(0)
            : period.startDate || new Date(0)) &&
      aggregatedFrom <=
        (type === "week"
          ? period.endWeekRange?.to || new Date(0)
          : type === "month"
            ? period.endMonth || new Date(0)
            : period.endDate || new Date(0))
    );
  });

  return (
    <div
      className={cn(
        "flex flex-col items-center grow w-full h-full max-h-full overflow-hidden",
        className,
      )}
    >
      <div className={cn("flex gap-2", { "ml-[5.25rem]": !isCompareMode })}>
        {type === "month" && (
          <MonthRangePicker
            startMonth={period.startMonth}
            endMonth={period.endMonth}
            onChange={(start, end) => {
              setPeriod((prev) => ({ ...prev, startMonth: start, endMonth: end }));
            }}
          />
        )}

        {type === "week" && (
          <RangeSelector
            type="week"
            start={period.startWeekRange}
            end={period.endWeekRange}
            setStart={(range) => setPeriod((prev) => ({ ...prev, startWeekRange: range }))}
            setEnd={(range) => setPeriod((prev) => ({ ...prev, endWeekRange: range }))}
          />
        )}

        {(type === "day" || type === "hour") && (
          <RangeSelector
            type="date"
            start={period.startDate}
            end={period.endDate}
            setStart={(date) => setPeriod((prev) => ({ ...prev, startDate: date }))}
            setEnd={(date) => setPeriod((prev) => ({ ...prev, endDate: date }))}
          />
        )}

        <div className="flex items-end">
          <DownloadCSVButton
            type={type}
            period={period}
            isCompareMode={isCompareMode}
            data={dataInRange}
            placement={"rainbow-line-parking-lot"}
          />
        </div>
      </div>

      {!data ||
      data.length === 0 ||
      ((type === "hour" || type === "day") && (!period.startDate || !period.endDate)) ||
      (type === "week" && (!period.startWeekRange || !period.endWeekRange)) ||
      (type === "month" && (!period.startMonth || !period.endMonth)) ? (
        <div className="flex items-center justify-center w-full h-full text-gray-500">
          <p className="text-lg">表示したい期間を設定してください。</p>
        </div>
      ) : (
        <div
          className={cn(
            "gap-y-4 w-full min-w-full grow pt-4 overflow-auto max-h-full",
            isCompareMode ? "flex flex-col" : "grid grid-cols-2",
          )}
        >
          <RainbowLineStackedBarChart
            data={dataInRange}
            focusedAttribute="placement"
            type={type}
            className="col-span-2 min-h-[calc(100dvh-500px)] h-full z-20"
          />
          <h3 className="w-full h-10 text-xl col-span-2 mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold">
            都道府県別
          </h3>
          <RainbowLineStackedBarChart
            data={dataInRange}
            focusedAttribute="prefectures"
            type={"day"}
            className="z-10"
          />
          <RainbowLinePieChart data={dataInRange} focusedAttribute="prefectures" />
          <h3 className="w-full h-10 col-span-2 text-xl mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold z-10">
            車両分類別
          </h3>
          <RainbowLineStackedBarChart
            data={dataInRange}
            focusedAttribute="carCategories"
            type={"day"}
            className="z-0"
          />
          <RainbowLinePieChart
            data={dataInRange}
            focusedAttribute="carCategories"
            className="z-0"
          />
        </div>
      )}
    </div>
  );
}
