import { Period } from "@fukui-kanko/shared";
import * as holidayJP from "@holiday-jp/holiday_jp";
import { AGGREGATE_FROM_KEY, AggregatedData, GRAPH_VIEW_TYPES, TOTAL_COUNT_KEY } from "../types";
import { WEEK_DAYS } from "./date";
import { formatDate } from "./utils";

function filterByRange(data: AggregatedData[], from: Date, to: Date) {
  return data.filter((row) => {
    const date = new Date(row[AGGREGATE_FROM_KEY]);
    return date >= from && date <= to;
  });
}

/**
 * 指定した期間内のデータを月単位で集計
 */
export function aggregateMonthly(data: AggregatedData[], start: Date, end: Date): AggregatedData[] {
  const filtered = filterByRange(data, start, end);
  const monthlyMap = new Map<
    string,
    AggregatedData & {
      weekdayTotal?: number;
      weekendTotal?: number;
    }
  >();
  filtered.forEach((row) => {
    const date = new Date(row[AGGREGATE_FROM_KEY]);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidayJP.isHoliday(date);
    const isWeekendOrHoliday = isWeekend || isHoliday;
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        ...row,
        aggregateFrom: monthKey,
        aggregateTo: monthKey,
        totalCount: Number(row[TOTAL_COUNT_KEY]),
        weekdayTotal: !isWeekendOrHoliday ? Number(row[TOTAL_COUNT_KEY]) : 0,
        weekendTotal: isWeekendOrHoliday ? Number(row[TOTAL_COUNT_KEY]) : 0,
      });
    } else {
      const prev = monthlyMap.get(monthKey)!;
      monthlyMap.set(monthKey, {
        ...prev,
        totalCount: Number(prev.totalCount) + Number(row[TOTAL_COUNT_KEY]),
        weekdayTotal:
          (prev.weekdayTotal ?? 0) + (!isWeekendOrHoliday ? Number(row[TOTAL_COUNT_KEY]) : 0),
        weekendTotal:
          (prev.weekendTotal ?? 0) + (isWeekendOrHoliday ? Number(row[TOTAL_COUNT_KEY]) : 0),
      });
    }
  });
  return Array.from(monthlyMap.values());
}

/**
 * 指定した期間内のデータを週単位で集計
 */
export function aggregateWeekly(
  data: AggregatedData[],
  startWeekRange: { from: Date; to: Date },
  endWeekRange: { from: Date; to: Date },
): AggregatedData[] {
  const filtered = filterByRange(data, startWeekRange.from, endWeekRange.to);

  const weeklyAggregated: AggregatedData[] = [];
  let i = 0;
  let isFirstWeek = true;
  while (i < filtered.length) {
    let weekRows: AggregatedData[] = [];
    if (isFirstWeek) {
      // 最初の週だけ他の週と範囲が異なる場合があるためfilterで抽出(例：2024/10/17からの週)
      weekRows = filtered.filter((row) => {
        const d = new Date(row[AGGREGATE_FROM_KEY]);
        return d >= startWeekRange.from && d <= startWeekRange.to;
      });
      // 件数分インデックスを進める
      i += weekRows.length;
      isFirstWeek = false;
    } else {
      // 以降は7日ごと
      weekRows = filtered.slice(i, i + 7);
      i += 7;
    }
    if (weekRows.length === 0) continue;
    const total = weekRows.reduce((sum, row) => sum + Number(row[TOTAL_COUNT_KEY]), 0);
    let weekdayTotal = 0;
    let weekendTotal = 0;
    weekRows.forEach((row) => {
      const date = new Date(row[AGGREGATE_FROM_KEY]);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidayJP.isHoliday(date);
      const isWeekendOrHoliday = isWeekend || isHoliday;
      if (isWeekendOrHoliday) {
        weekendTotal += Number(row[TOTAL_COUNT_KEY]);
      } else {
        weekdayTotal += Number(row[TOTAL_COUNT_KEY]);
      }
    });

    weeklyAggregated.push({
      ...weekRows[0],
      aggregateFrom: `${formatDate(new Date(weekRows[0][AGGREGATE_FROM_KEY]), "-")}週`,
      aggregateTo: `${formatDate(new Date(weekRows[weekRows.length - 1][AGGREGATE_FROM_KEY]), "-")}`,
      totalCount: total,
      weekdayTotal,
      weekendTotal,
    });
  }
  return weeklyAggregated;
}

/**
 * 指定した期間内のデータを日単位で集計（曜日・祝日名付き）
 */
export function aggregateDaily(data: AggregatedData[], start: Date, end: Date): AggregatedData[] {
  const filtered = filterByRange(data, start, end);

  // 祝日を事前に取得しMap化
  const holidays = holidayJP.between(start, end);
  const holidayMap = new Map<string, string>();
  holidays.forEach((h) => {
    holidayMap.set(formatDate(h.date, "-"), h.name);
  });

  // 日ごとに集計
  const dailyMap = new Map<string, AggregatedData>();
  filtered.forEach((row) => {
    const date = new Date(row[AGGREGATE_FROM_KEY]);
    const dayKey = formatDate(date, "-");
    const dayOfWeek = WEEK_DAYS[date.getDay()];
    const holidayName = holidayMap.get(dayKey) ?? "";

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        ...row,
        aggregateFrom: dayKey,
        aggregateTo: dayKey,
        totalCount: Number(row[TOTAL_COUNT_KEY]),
        dayOfWeek,
        holidayName,
      });
    }
  });

  return Array.from(dailyMap.values());
}

/**
 * 指定した期間内のデータを時間単位で集計
 */
export function aggregateHourly(data: AggregatedData[]): AggregatedData[] {
  const hourlyMap = new Map<string, AggregatedData>();
  data.forEach((row) => {
    if (!row[AGGREGATE_FROM_KEY]) return;
    const date = new Date(row[AGGREGATE_FROM_KEY]);
    const hourKey = `${formatDate(date, "-")} ${String(date.getHours()).padStart(2, "0")}:00`;
    const dayOfWeek = WEEK_DAYS[date.getDay()];
    const isHoliday = holidayJP.isHoliday(date);
    let holidayName = "";
    if (isHoliday) {
      const holidays = holidayJP.between(date, date);
      if (holidays.length > 0) {
        holidayName = holidays[0].name;
      }
    }
    if (!hourlyMap.has(hourKey)) {
      hourlyMap.set(hourKey, {
        ...row,
        aggregateFrom: hourKey,
        aggregateTo: hourKey,
        totalCount: Number(row[TOTAL_COUNT_KEY]),
        dayOfWeek,
        holidayName,
      });
    }
  });
  return Array.from(hourlyMap.values());
}

/**
 * テーマ・期間ごとに適切な集計データを返す共通関数
 */
export function getFilteredData(
  type: keyof typeof GRAPH_VIEW_TYPES,
  period: Period,
  csvData: AggregatedData[],
  csvDailyData: AggregatedData[],
) {
  if (type === "month" && period.startMonth && period.endMonth) {
    const end = new Date(period.endMonth.getFullYear(), period.endMonth.getMonth() + 1, 0);
    return { data: aggregateMonthly(csvData, period.startMonth, end), daily: undefined };
  }
  if (type === "week" && period.startWeekRange && period.endWeekRange) {
    return {
      data: aggregateWeekly(csvData, period.startWeekRange, period.endWeekRange),
      daily: undefined,
    };
  }
  if (type === "day" && period.startDate && period.endDate) {
    return { data: aggregateDaily(csvData, period.startDate, period.endDate), daily: undefined };
  }
  if (type === "hour" && period.startDate && period.endDate) {
    return { data: undefined, daily: aggregateHourly(csvDailyData) };
  }
  return { data: csvData, daily: csvDailyData };
}
