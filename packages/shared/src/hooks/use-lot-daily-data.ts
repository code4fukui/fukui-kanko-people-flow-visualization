import { useState } from "react";
import {
  AggregatedData,
  GRAPH_VIEW_TYPES,
  Period,
  Placement,
  useDailyDataEffect,
} from "@fukui-kanko/shared";

type ContextData<T> = { main: T[]; compare: T[] };

export function useLotDailyData(
  placement: Placement,
  type: keyof typeof GRAPH_VIEW_TYPES,
  mainPeriod: Period,
  comparePeriod: Period,
) {
  const [daily, setDaily] = useState<ContextData<AggregatedData>>({ main: [], compare: [] });

  // 本期間
  useDailyDataEffect("LicensePlate", placement, type, mainPeriod, (rows) =>
    setDaily((s) => ({ ...s, main: rows })),
  );

  // 比較期間
  useDailyDataEffect("LicensePlate", placement, type, comparePeriod, (rows) =>
    setDaily((s) => ({ ...s, compare: rows })),
  );

  return daily;
}
