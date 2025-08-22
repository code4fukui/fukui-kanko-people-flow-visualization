import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared";
import {
  DownloadCSVButton,
  Graph,
  LoadingSpinner,
  MonthRangePicker,
  RangeSelector,
  StatsSummary,
} from "@fukui-kanko/shared/components/parts";
import { cn, getWeekRange } from "@fukui-kanko/shared/utils";

type PeriodGraphPanelProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  isCompareMode: boolean;
  isLoading: boolean;
  filteredData: AggregatedData[];
  filteredDailyData: AggregatedData[];
  className?: string;
  placement: string;
};

export function PeriodGraphPanel({
  type,
  period,
  setPeriod,
  isCompareMode,
  isLoading,
  filteredData,
  filteredDailyData,
  className,
  placement,
}: PeriodGraphPanelProps) {
  return (
    <div className={cn("w-full min-w-0 flex flex-col items-center", className)}>
      <div className={cn("flex gap-2", { "ml-[5.25rem]": !isCompareMode })}>
        {type === "month" && (
          <MonthRangePicker
            startMonth={period.startMonth}
            endMonth={period.endMonth}
            onChange={(start, end) => {
              setPeriod((prev) => {
                const next = { ...prev, startMonth: start, endMonth: end };

                if (start) {
                  const startYear = start.getFullYear();
                  const startMonth = start.getMonth() + 1;
                  // データが12月20日から始まるため、12月の場合は20日、それ以外は1日から
                  const day = startMonth === 12 ? 20 : 1;
                  next.startDate = new Date(
                    `${startYear}-${String(startMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                  );
                  next.startDate.setHours(0, 0, 0, 0);
                  next.startWeekRange = getWeekRange(next.startDate);
                } else {
                  next.startDate = undefined;
                  next.startWeekRange = undefined;
                }

                if (end) {
                  const endYear = end.getFullYear();
                  const endMonth = end.getMonth() + 1;
                  const now = new Date();
                  const isCurrentMonth =
                    endYear === now.getFullYear() && endMonth === now.getMonth() + 1;

                  if (isCurrentMonth) {
                    const yesterday = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate() - 1,
                    );
                    yesterday.setHours(0, 0, 0, 0);
                    next.endDate = yesterday;
                  } else {
                    const lastDay = new Date(endYear, endMonth, 0).getDate();
                    next.endDate = new Date(
                      `${endYear}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
                    );
                    next.endDate.setHours(0, 0, 0, 0);
                  }
                  next.endWeekRange = getWeekRange(next.endDate);
                } else {
                  next.endDate = undefined;
                  next.endWeekRange = undefined;
                }

                return next;
              });
            }}
          />
        )}

        {type === "week" && (
          <RangeSelector
            type="week"
            start={period.startWeekRange}
            end={period.endWeekRange}
            setStart={(range) =>
              setPeriod((prev) => {
                const next = { ...prev, startWeekRange: range };
                if (range) {
                  next.startDate = range.from;
                  next.startMonth = new Date(range.from.getFullYear(), range.from.getMonth(), 1);
                } else {
                  next.startDate = undefined;
                  next.startMonth = undefined;
                }
                return next;
              })
            }
            setEnd={(range) =>
              setPeriod((prev) => {
                const next = { ...prev, endWeekRange: range };
                if (range) {
                  next.endDate = range.to;
                  next.endMonth = new Date(range.to.getFullYear(), range.to.getMonth(), 1);
                } else {
                  next.endDate = undefined;
                  next.endMonth = undefined;
                }
                return next;
              })
            }
          />
        )}

        {(type === "day" || type === "hour") && (
          <RangeSelector
            type="date"
            start={period.startDate}
            end={period.endDate}
            setStart={(date) =>
              setPeriod((prev) => {
                const next = { ...prev, startDate: date };
                if (date) {
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  next.startMonth = new Date(year, month - 1, 1);
                  next.startWeekRange = getWeekRange(date);
                } else {
                  next.startMonth = undefined;
                  next.startWeekRange = undefined;
                }
                return next;
              })
            }
            setEnd={(date) =>
              setPeriod((prev) => {
                const next = { ...prev, endDate: date };
                if (date) {
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  next.endMonth = new Date(year, month - 1, 1);
                  next.endWeekRange = getWeekRange(date);
                } else {
                  next.endMonth = undefined;
                  next.endWeekRange = undefined;
                }
                return next;
              })
            }
          />
        )}
        <div className="flex items-end">
          <DownloadCSVButton
            type={type}
            period={period}
            isCompareMode={isCompareMode}
            data={type === "hour" ? filteredDailyData : filteredData}
            placement={placement}
          />
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
