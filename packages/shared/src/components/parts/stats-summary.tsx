import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import React from "react";

type StatsSummaryProps = {
  theme: "month" | "week" | "day" | "hour";
  data?: AggregatedData[];
};

/**
 * 集計データ配列から合計値と平均値を計算
 */
function getStats(data: AggregatedData[]) {
  if (!data || data.length === 0) return { sum: 0, avg: 0 };
  const sum = data.reduce((acc, cur) => acc + Number(cur["total count"] ?? 0), 0);
  const avg = sum / data.length;
  return { sum, avg };
}

/**
 * 集計データ配列から平日・土日祝の平均値を計算
 */
function getWeekdayAverages(data: AggregatedData[], theme: string) {
  if (!data) return { weekdayAvg: 0, weekendAvg: 0 };

  if (theme === "month" || theme === "week") {
    // 月・週集計はweekdayTotal, weekendTotalを使う
    const weekdaySum = data.reduce((acc, cur) => acc + Number(cur["weekdayTotal"] ?? 0), 0);
    const weekendSum = data.reduce((acc, cur) => acc + Number(cur["weekendTotal"] ?? 0), 0);
    const count = data.length;
    return {
      weekdayAvg: count > 0 ? weekdaySum / count : 0,
      weekendAvg: count > 0 ? weekendSum / count : 0,
    };
  }
  if (theme === "day") {
    const weekdays = data.filter(
      (d) => d.dayOfWeek && !["土", "日"].includes(d.dayOfWeek) && !d.holidayName,
    );
    const weekends = data.filter(
      (d) => (d.dayOfWeek && ["土", "日"].includes(d.dayOfWeek)) || d.holidayName,
    );
    const weekdayAvg =
      weekdays.length > 0
        ? weekdays.reduce((acc, cur) => acc + Number(cur["total count"] ?? 0), 0) / weekdays.length
        : 0;
    const weekendAvg =
      weekends.length > 0
        ? weekends.reduce((acc, cur) => acc + Number(cur["total count"] ?? 0), 0) / weekends.length
        : 0;
    return { weekdayAvg, weekendAvg };
  }
  return { weekdayAvg: 0, weekendAvg: 0 };
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ theme, data }) => {
  const { sum, avg } = getStats(data ?? []);
  const { weekdayAvg, weekendAvg } = getWeekdayAverages(data ?? [], theme);

  return (
    <div className="flex justify-center">
      <div className="my-4">
        <div className="flex justify-end">
          <p>
            合計人数: {Math.round(sum).toLocaleString()}人 / 平均人数:{" "}
            {Math.round(avg).toLocaleString()}人
          </p>
        </div>
        {theme !== "hour" && (
          <div>
            <div className="flex justify-end">
              <p>平日平均: {Math.round(weekdayAvg).toLocaleString()}人</p>
            </div>
            <div className="flex justify-end">
              <p>土日祝平均: {Math.round(weekendAvg).toLocaleString()}人</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
