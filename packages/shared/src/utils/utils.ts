import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付を指定した区切り文字で "YYYY-MM-DD" または "YYYY/MM/DD" 形式で返す
 */
export function formatDate(date: Date, delimiter: "-" | "/" = "-") {
  return `${date.getFullYear()}${delimiter}${String(date.getMonth() + 1).padStart(2, "0")}${delimiter}${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * アプリケーション内で利用可能なデータの最小日付を返す
 */
export function getMinDate(): Date {
  const date = new Date("2024-10-17");
  date.setHours(0, 0, 0, 0);
  return date;
}
/**
 * アプリケーション内で利用可能なデータの最大日付（今日の前日）を返す
 */
export function getMaxDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * データのある最初の週の終了日
 */
export const FIRST_WEEK_END_DATE = new Date("2024-10-19");

/**
 * グラフ凡例のホバー解除時に適用する遅延時間（ミリ秒）。
 */
export const HOVER_CLEAR_DELAY_MS = 100;
