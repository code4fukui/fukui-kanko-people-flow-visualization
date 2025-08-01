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
 * アプリケーション内で利用可能なデータの最小日付
 */
export const MIN_DATE = new Date("2024-10-17");
MIN_DATE.setHours(0, 0, 0, 0);
/**
 * アプリケーション内で利用可能なデータの最大日付（今日の前日）
 */
export const MAX_DATE = new Date();
MAX_DATE.setHours(0, 0, 0, 0);
MAX_DATE.setDate(MAX_DATE.getDate() - 1);
