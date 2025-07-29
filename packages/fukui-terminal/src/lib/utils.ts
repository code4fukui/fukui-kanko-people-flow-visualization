import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * アプリケーション内で利用可能なデータの最小日付
 */
export const DEFAULT_MIN_DATE = new Date("2024-10-01");
