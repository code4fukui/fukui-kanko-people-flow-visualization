type DateUnit = "year" | "month" | "day" | "hour" | "minute" | "second";

export const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function floorDate(date: Date, unit: DateUnit = "day") {
  const work = new Date(date);

  work.setMilliseconds(0);
  if (unit === "second") return work;
  work.setSeconds(0);
  if (unit === "minute") return work;
  work.setMinutes(0);
  if (unit === "hour") return work;
  work.setHours(0);
  if (unit === "day") return work;
  work.setDate(0);
  if (unit === "month") return work;
  work.setMonth(0);
  return work;
}

export function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export function getTimeString(date: Date) {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}:${minute}:${second}`;
}

export function getDateTimeString(date: Date) {
  return `${getDateString(date)} ${getTimeString(date)}`;
}

export function getDateStringRange({ from, to }: { from: Date; to: Date }): string[] {
  const result: string[] = [];
  for (let i = new Date(from); i <= to; i.setDate(i.getDate() + 1)) {
    result.push(getDateString(i));
  }
  return result;
}

export function isDateIncludedInRange(date: Date, range: { from: Date; to: Date }) {
  return date >= range.from && date <= range.to;
}
