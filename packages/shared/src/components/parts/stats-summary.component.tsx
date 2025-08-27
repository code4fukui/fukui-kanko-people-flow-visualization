import React from "react";
import { AggregatedData, GRAPH_VIEW_TYPES } from "@fukui-kanko/shared";
import { AverageBar } from "@fukui-kanko/shared/components/parts";
import { cn } from "@fukui-kanko/shared/utils";
import { PeopleIcon } from "@primer/octicons-react";

type StatsSummaryProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  data?: AggregatedData[];
  placement?: string;
  className?: string;
};

/**
 * 集計データ配列から合計値と平均値を計算
 */
function getStats(data: AggregatedData[], placement?: string) {
  if (!data || data.length === 0) return { sum: 0, avg: 0 };
  const sum = data.reduce((acc, cur) => {
    if (placement === "rainbow-line-parking-lot") {
      return acc + Number(cur["total count"] ?? 0);
    }
    return acc + Number(cur["totalCount"] ?? 0);
  }, 0);
  const avg = sum / data.length;
  return { sum, avg };
}

/**
 * 集計データ配列から平日・土日祝の平均値を計算
 */
function getWeekdayAverages(data: AggregatedData[], type: keyof typeof GRAPH_VIEW_TYPES) {
  if (!data) return { weekdayAvg: 0, weekendAvg: 0 };

  if (type === "month" || type === "week") {
    // 月・週集計はweekdayTotal, weekendTotalを使う
    const weekdaySum = data.reduce((acc, cur) => acc + Number(cur["weekdayTotal"] ?? 0), 0);
    const weekendSum = data.reduce((acc, cur) => acc + Number(cur["weekendTotal"] ?? 0), 0);
    const weekdayDays = data.reduce((acc, cur) => acc + Number(cur["weekdayDays"] ?? 0), 0);
    const weekendDays = data.reduce((acc, cur) => acc + Number(cur["weekendDays"] ?? 0), 0);
    return {
      weekdayAvg: weekdayDays > 0 ? weekdaySum / weekdayDays : 0,
      weekendAvg: weekendDays > 0 ? weekendSum / weekendDays : 0,
    };
  }
  if (type === "day") {
    const weekdays = data.filter(
      (d) => d.dayOfWeek && !["土", "日"].includes(String(d.dayOfWeek)) && !d.holidayName,
    );
    const weekends = data.filter(
      (d) => (d.dayOfWeek && ["土", "日"].includes(String(d.dayOfWeek))) || d.holidayName,
    );
    const weekdayAvg =
      weekdays.length > 0
        ? weekdays.reduce((acc, cur) => acc + Number(cur["totalCount"] ?? 0), 0) / weekdays.length
        : 0;
    const weekendAvg =
      weekends.length > 0
        ? weekends.reduce((acc, cur) => acc + Number(cur["totalCount"] ?? 0), 0) / weekends.length
        : 0;
    return { weekdayAvg, weekendAvg };
  }
  return { weekdayAvg: 0, weekendAvg: 0 };
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ type, data, className, placement }) => {
  const { sum, avg } = getStats(data ?? [], placement);
  const { weekdayAvg, weekendAvg } = getWeekdayAverages(data ?? [], type);
  const statsData = {
    sum: Math.round(sum),
    avg: Math.round(avg),
    weekdayAvg: Math.round(weekdayAvg),
    weekendAvg: Math.round(weekendAvg),
  };

  // 最大値（グラフ幅用）
  const maxAvg =
    type === "month" || type === "week"
      ? Math.max(statsData.weekdayAvg, statsData.weekendAvg, 1)
      : Math.max(statsData.avg, statsData.weekdayAvg, statsData.weekendAvg, 1);

  return (
    <div className={cn("flex justify-center", className)}>
      <div
        className={cn(
          "grid gap-3 mt-2 mb-4 w-full max-w-md",
          type === "hour" ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[1fr_1.5fr]",
        )}
      >
        {/* 合計検出回数 */}
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <PeopleIcon size={16} className="w-4 h-4 text-blue-600" />
            <p className="text-blue-600">合計検出回数</p>
          </div>
          <p className="text-lg font-medium text-blue-800">{statsData.sum.toLocaleString()}回</p>
        </div>
        {/* 平均検出回数 */}
        <div className="bg-green-50 rounded-lg p-2 text-center">
          {type !== "hour" ? (
            <>
              <AverageBar
                color="bg-blue-500"
                label="全体平均"
                value={statsData.avg}
                max={maxAvg}
                valueColor="text-blue-700"
                type={type}
              />
              <AverageBar
                color="bg-green-500"
                label="平日平均"
                value={statsData.weekdayAvg}
                max={maxAvg}
                valueColor="text-green-700"
                type={type}
              />
              <AverageBar
                color="bg-orange-500"
                label="土日祝平均"
                value={statsData.weekendAvg}
                max={maxAvg}
                valueColor="text-orange-700"
                type={type}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1 mb-1">
                <PeopleIcon size={16} className="w-4 h-4 text-green-600" />
                <p className="text-green-600">1時間平均検出回数</p>
              </div>
              <p className="text-lg font-medium text-green-800">
                {statsData.avg.toLocaleString()}回
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
