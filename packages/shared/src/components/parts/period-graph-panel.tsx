import { AggregatedData, Period } from "@fukui-kanko/shared";
import {
  Graph,
  LoadingSpinner,
  MonthRangePicker,
  RangeSelector,
} from "@fukui-kanko/shared/components/parts";

type PeriodGraphPanelProps = {
  type: "month" | "week" | "day" | "hour";
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  isLoading: boolean;
  filteredData: AggregatedData[];
  filteredDailyData: AggregatedData[];
};
export function PeriodGraphPanel({
  type,
  period,
  setPeriod,
  isLoading,
  filteredData,
  filteredDailyData,
}: PeriodGraphPanelProps) {
  return (
    <div>
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

      <div className="my-8">
        {isLoading && type === "hour" ? (
          <LoadingSpinner />
        ) : (period.startMonth && period.endMonth) ||
          (period.startWeekRange && period.endWeekRange) ||
          (period.startDate && period.endDate) ? (
          <Graph type={type} data={type === "hour" ? filteredDailyData : filteredData} />
        ) : (
          <p>範囲を選択してください。</p>
        )}
      </div>
    </div>
  );
}
