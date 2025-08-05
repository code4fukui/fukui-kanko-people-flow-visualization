import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared";
import {
  Graph,
  LoadingSpinner,
  MonthRangePicker,
  RangeSelector,
  StatsSummary,
} from "@fukui-kanko/shared/components/parts";
import { cn } from "@fukui-kanko/shared/utils";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";

type PeriodGraphPanelProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  isCompareMode: boolean;
  isLoading: boolean;
  filteredData: AggregatedData[];
  filteredDailyData: AggregatedData[];
  className?: string;
};

function convertToCSV(data: AggregatedData[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function PeriodGraphPanel({
  type,
  period,
  setPeriod,
  isCompareMode,
  isLoading,
  filteredData,
  filteredDailyData,
  className,
}: PeriodGraphPanelProps) {
  const handleDownloadCSV = (data: AggregatedData[]) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "fukui-terminal-data.csv");
  };

  return (
    <div className={cn("w-full min-w-0 flex flex-col items-center", className)}>
      <div className="flex gap-2 pl-[5.25rem]">
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
          <button
            className="h-9 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => handleDownloadCSV(type === "hour" ? filteredDailyData : filteredData)}
            disabled={
              !(
                (period.startMonth && period.endMonth) ||
                (period.startWeekRange && period.endWeekRange) ||
                (period.startDate && period.endDate)
              )
            }
          >
            <span className="flex items-center gap-1">
              <DownloadIcon size={16} />
              {!isCompareMode && <span className="hidden sm:inline">CSV</span>}
            </span>
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-end min-h-[40vh]">
        <div
          className={`${
            (period.startMonth && period.endMonth) ||
            (period.startWeekRange && period.endWeekRange) ||
            (period.startDate && period.endDate)
              ? "min-h-[60vh] pt-4 pb-0 mt-2"
              : "min-h-[20vh]"
          } w-full`}
        >
          {isLoading && type === "hour" ? (
            <LoadingSpinner />
          ) : (period.startMonth && period.endMonth) ||
            (period.startWeekRange && period.endWeekRange) ||
            (period.startDate && period.endDate) ? (
            <>
              <div className="rounded-lg w-full h-[60vh]">
                <Graph type={type} data={type === "hour" ? filteredDailyData : filteredData} />
              </div>
              <div
                className={cn("mx-auto px-4 mt-4", {
                  "w-full": isCompareMode,
                  "w-2/3": !isCompareMode,
                })}
              >
                <StatsSummary
                  type={type}
                  data={type === "hour" ? filteredDailyData : filteredData}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-lg">表示したい期間を設定してください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
