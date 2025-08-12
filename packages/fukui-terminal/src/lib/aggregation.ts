import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import * as holidayJP from "@holiday-jp/holiday_jp";

function filterByRange(data: AggregatedData[], from: Date, to: Date) {
  return data.filter((row) => {
    const date = new Date(row["aggregate from"]);
    return date >= from && date <= to;
  });
}

/**
 * 指定した期間内のデータを月単位で集計
 */
export function aggregateMonthly(data: AggregatedData[], start: Date, end: Date): AggregatedData[] {
  const filtered = filterByRange(data, start, end);
  const monthlyMap = new Map<string, AggregatedData>();
  filtered.forEach((row) => {
    const date = new Date(row["aggregate from"]);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        ...row,
        ["aggregate from"]: `${monthKey}`,
        ["aggregate to"]: `${monthKey}`,
        ["total count"]: Number(row["total count"]),
      });
    } else {
      const prev = monthlyMap.get(monthKey)!;
      monthlyMap.set(monthKey, {
        ...prev,
        ["total count"]: Number(prev["total count"]) + Number(row["total count"]),
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
  while (i < filtered.length) {
    let weekRows;
    if (i === 0) {
      // 最初の週はstartWeekRange.from〜startWeekRange.toまで
      weekRows = filtered.filter((row) => {
        const d = new Date(row["aggregate from"]);
        return d >= startWeekRange.from && d <= startWeekRange.to;
      });
      i += weekRows.length;
    } else {
      // 以降は7日ごと
      weekRows = filtered.slice(i, i + 7);
      i += 7;
    }
    if (weekRows.length === 0) continue;
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const total = weekRows.reduce((sum, row) => sum + Number(row["total count"]), 0);
    weeklyAggregated.push({
      ...weekRows[0],
      ["aggregate from"]: `${formatDate(new Date(weekRows[0]["aggregate from"]))}〜`,
      ["aggregate to"]: `${formatDate(new Date(weekRows[weekRows.length - 1]["aggregate from"]))}`,
      ["total count"]: total,
    });
  }
  return weeklyAggregated;
}

/**
 * 指定した期間内のデータを日単位で集計
 */
export function aggregateDaily(data: AggregatedData[], start: Date, end: Date): AggregatedData[] {
  const filtered = filterByRange(data, start, end);
  const dailyMap = new Map<string, AggregatedData>();
  filtered.forEach((row) => {
    const date = new Date(row["aggregate from"]);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!dailyMap.has(dayKey)) {
      const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
      const holiday = holidayJP.isHoliday(date);
      let holidayName: string = "";
      if (holiday) {
        holidayName = holidayJP.between(date, date)[0].name;
      }
      dailyMap.set(dayKey, {
        ...row,
        ["aggregate from"]: `${dayKey}`,
        ["aggregate to"]: `${dayKey}`,
        ["total count"]: Number(row["total count"]),
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
    const date = new Date(row["aggregate from"]);
    const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:00`;

    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
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
        ["aggregate from"]: hourKey,
        ["aggregate to"]: hourKey,
        ["total count"]: Number(row["total count"]),
        dayOfWeek,
        holidayName,
      });
    } else {
      const prev = hourlyMap.get(hourKey)!;
      hourlyMap.set(hourKey, {
        ...prev,
        ["total count"]: Number(prev["total count"]) + Number(row["total count"]),
      });
    }
  });
  return Array.from(hourlyMap.values());
}
