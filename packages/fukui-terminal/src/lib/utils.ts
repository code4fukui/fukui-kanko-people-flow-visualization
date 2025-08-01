import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
