import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import React from "react";

type StatsSummaryProps = {
  theme: "month" | "week" | "day" | "hour";
  data?: AggregatedData[];
};

function getStats(data: AggregatedData[]) {
  if (!data || data.length === 0) return { sum: 0, avg: 0 };
  const sum = data.reduce((acc, cur) => acc + Number(cur["total count"] ?? 0), 0);
  const avg = sum / data.length;
  return { sum, avg };
}

function getWeekdayAverages(data: AggregatedData[]) {
  if (!data) return { weekdayAvg: 0, weekendAvg: 0 };
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

export const StatsSummary: React.FC<StatsSummaryProps> = ({ theme, data }) => {
  const { sum, avg } = getStats(data ?? []);
  let weekdayAvg = 0;
  let weekendAvg = 0;
  if (theme === "day" && data) {
    const result = getWeekdayAverages(data);
    weekdayAvg = result.weekdayAvg;
    weekendAvg = result.weekendAvg;
  }

  return (
    <div style={{ margin: "1rem 0", fontSize: "1.1rem", color: "#374151" }}>
      <div>合計人数: {Math.round(sum).toLocaleString()} 人</div>
      <div>平均人数: {Math.round(avg).toLocaleString()} 人</div>
      {theme === "day" && (
        <>
          <div>平日平均: {Math.round(weekdayAvg).toLocaleString()} 人</div>
          <div>土日祝平均: {Math.round(weekendAvg).toLocaleString()} 人</div>
        </>
      )}
    </div>
  );
};
