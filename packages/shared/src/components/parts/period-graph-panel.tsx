import { AggregatedData } from "@fukui-kanko/shared";
import {
  Graph,
  LoadingSpinner,
  MonthRangePicker,
  RangeSelector,
} from "@fukui-kanko/shared/components/parts";

type Props = {
  type: "month" | "week" | "day" | "hour";
  startMonth?: Date;
  endMonth?: Date;
  setStartMonth?: (date?: Date) => void;
  setEndMonth?: (date?: Date) => void;
  startWeekRange?: { from: Date; to: Date };
  endWeekRange?: { from: Date; to: Date };
  setStartWeekRange?: (range?: { from: Date; to: Date }) => void;
  setEndWeekRange?: (range?: { from: Date; to: Date }) => void;
  startDate?: Date;
  endDate?: Date;
  setStartDate?: (date?: Date) => void;
  setEndDate?: (date?: Date) => void;
  isLoading: boolean;
  filteredData: AggregatedData[];
  filteredDailyData: AggregatedData[];
};

export function PeriodGraphPanel(props: Props) {
  const {
    type,
    startMonth,
    endMonth,
    setStartMonth,
    setEndMonth,
    startWeekRange,
    endWeekRange,
    setStartWeekRange,
    setEndWeekRange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isLoading,
    filteredData,
    filteredDailyData,
  } = props;

  return (
    <div>
      {type === "month" && setStartMonth && setEndMonth && (
        <MonthRangePicker
          startMonth={startMonth}
          endMonth={endMonth}
          onChange={(start, end) => {
            setStartMonth(start);
            setEndMonth(end);
          }}
        />
      )}

      {type === "week" && setStartWeekRange && setEndWeekRange && (
        <RangeSelector
          type="week"
          start={startWeekRange}
          end={endWeekRange}
          setStart={setStartWeekRange}
          setEnd={setEndWeekRange}
        />
      )}

      {(type === "day" || type === "hour") && setStartDate && setEndDate && (
        <RangeSelector
          type="date"
          start={startDate}
          end={endDate}
          setStart={setStartDate}
          setEnd={setEndDate}
        />
      )}

      <div className="my-8">
        {isLoading && type === "hour" ? (
          <LoadingSpinner />
        ) : (startMonth && endMonth) ||
          (startWeekRange && endWeekRange) ||
          (startDate && endDate) ? (
          <Graph type={type} data={type === "hour" ? filteredDailyData : filteredData} />
        ) : (
          <p>範囲を選択してください。</p>
        )}
      </div>
    </div>
  );
}
