import { useEffect } from "react";
import {
  AggregatedData,
  getFilteredData,
  getRawData,
  GRAPH_VIEW_TYPES,
  ObjectClass,
  Period,
  Placement,
} from "@fukui-kanko/shared";

/**
 * テーマ・期間ごとに適切な集計データを返すカスタムフック
 */
export function useFilteredData(
  type: keyof typeof GRAPH_VIEW_TYPES,
  period: Period,
  csvData: AggregatedData[],
  csvDailyData: AggregatedData[],
  setFilteredData: (data: AggregatedData[]) => void,
  setFilteredDailyData: (data: AggregatedData[]) => void,
) {
  useEffect(() => {
    const { data, daily } = getFilteredData(type, period, csvData, csvDailyData);
    if (data !== undefined) setFilteredData(data);
    if (daily !== undefined) setFilteredDailyData(daily);
  }, [
    type,
    period.startMonth,
    period.endMonth,
    period.startWeekRange,
    period.endWeekRange,
    period.startDate,
    period.endDate,
    csvData,
    csvDailyData,
  ]);
}

/**
 * 時間別データを取得・更新するフック
 */
export function useDailyDataEffect(
  objectClass: ObjectClass,
  placement: Placement,
  type: keyof typeof GRAPH_VIEW_TYPES,
  period: Period,
  setDailyData: (data: AggregatedData[]) => void,
  setIsLoading?: (loading: boolean) => void,
) {
  useEffect(() => {
    if (type !== "hour") {
      setIsLoading?.(false);
      return;
    }
    let isCurrent = true;
    const fetchData = async () => {
      if (period.startDate && period.endDate) {
        setIsLoading?.(true);

        const start = new Date(period.startDate);
        const end = new Date(period.endDate);

        // 取得対象日の配列を作成
        const dates: Date[] = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }

        try {
          // 各日を並列で取得（順序は dates の順に維持されます）
          const all = await Promise.all(
            dates.map((date) =>
              getRawData({
                objectClass,
                placement,
                aggregateRange: "daily", // 1時間毎のデータはdailyに含まれています
                date,
              }),
            ),
          );
          const results = all.flat();

          if (isCurrent) {
            setDailyData(results);
          }
        } catch (e) {
          if (isCurrent) {
            // eslint-disable-next-line no-console
            console.error("データの取得に失敗しました:", e);
            setDailyData([]);
          }
        } finally {
          if (isCurrent) setIsLoading?.(false);
        }
      }
    };
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [type, period.startDate, period.endDate, objectClass, placement]);
}
