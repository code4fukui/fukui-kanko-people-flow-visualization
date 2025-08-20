import { Period } from "@fukui-kanko/shared/types";
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
  const date = new Date("2024-12-20");
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
export const FIRST_WEEK_END_DATE = new Date("2024-12-21");

/**
 * グラフ凡例のホバー解除時に適用する遅延時間（ミリ秒）。
 */
export const HOVER_CLEAR_DELAY_MS = 100;

/**
 * グラフ凡例用のユニークキーを生成
 */
export function getLegendKey(dataKey: string, instanceSuffix: string) {
  return [dataKey, instanceSuffix].join("::");
}

/**
 * 指定日を含む週の範囲（from/to）を返す。
 */
export function getWeekRange(date: Date) {
  const minDate = getMinDate();
  const maxDate = getMaxDate();
  let startDay = new Date(date);
  let endDay: Date;

  startDay.setDate(date.getDate() - startDay.getDay());
  if (startDay < minDate) {
    startDay = new Date(minDate);
  }

  if (startDay.getTime() === minDate.getTime()) {
    // データのある最初の週は7日周期にできないため、特別に終了日を設定
    endDay = new Date(FIRST_WEEK_END_DATE);
  } else {
    endDay = new Date(startDay);
    endDay.setDate(startDay.getDate() + 6);
    // 最新データ日を超えないようにする
    if (endDay > maxDate) {
      endDay = new Date(maxDate);
    }
  }
  return { from: startDay, to: endDay };
}

/**
 * 画面初期表示用の期間（Period）を生成する。
 */
export function createInitialPeriod(): Period {
  const end = new Date();
  end.setDate(end.getDate() - 1); // 今日の前日を設定
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setMonth(end.getMonth() - 3); // 3ヶ月前を設定
  start.setHours(0, 0, 0, 0);
  return {
    startDate: start,
    endDate: end,
    startMonth: new Date(start.getFullYear(), start.getMonth(), 1),
    endMonth: new Date(end.getFullYear(), end.getMonth(), 1),
    startWeekRange: getWeekRange(start),
    endWeekRange: getWeekRange(end),
  };
}
