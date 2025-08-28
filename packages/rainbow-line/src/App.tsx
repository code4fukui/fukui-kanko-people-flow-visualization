import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AggregatedData,
  AggregatedDataBase,
  aggregateMonthly,
  aggregateWeekly,
  CAR_CATEGORIES,
  createInitialPeriod,
  getRawData,
  GRAPH_VIEW_TYPES,
  Period,
  Placement,
  PREFECTURES,
  reduceAggregateRange,
  reducePlacement,
  REGIONS_PREFECTURES,
  useInitialization,
  useLotDailyData,
} from "@fukui-kanko/shared";
import { TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";
import { FiltersSample } from "./components/parts/filters";
import { Header } from "./components/parts/header";
import { RainbowLineChartPanel } from "./components/parts/rainbow-line-chart-panel";
import { RAINBOW_LINE_LOTS } from "./constants/parking-lots";
import { FILTER_ATTRIBUTES } from "./interfaces/filter-attributes";

type RainbowLineAggregatedData = AggregatedDataBase<Placement | "rainbow-line-all"> &
  Record<string, string | number>;

const compansateProcessedData = (
  filtered: RainbowLineAggregatedData,
  raw: RainbowLineAggregatedData,
): RainbowLineAggregatedData => ({
  ...filtered,
  placement: raw.placement,
  "object class": raw["object class"],
  "aggregate from": raw["aggregate from"],
  "aggregate to": raw["aggregate to"],
  "total count": Object.values(filtered).reduce((sum, v) => Number(sum) + Number(v), 0) as number,
  ...Object.values(RAINBOW_LINE_LOTS).reduce(
    (result, value) => {
      result[value] = Number(raw[`${value}`] ?? 0);
      return result;
    },
    {} as Record<string, number>,
  ),
});

function App() {
  const [filters, setFilters] = useState<
    Record<
      (typeof FILTER_ATTRIBUTES)[number]["id"],
      (typeof FILTER_ATTRIBUTES)[number]["items"][number]["value"]
    >
  >({
    parkingLot: "all",
    region: "all",
    prefecture: "all",
    carCategory: "all",
  });
  const [type, setType] = useState<keyof typeof GRAPH_VIEW_TYPES>("day");
  const [compareMode, setCompareMode] = useState(false);

  const [dataLot1, setDataLot1] = useState<AggregatedData[]>([]);
  const [dataLot2, setDataLot2] = useState<AggregatedData[]>([]);
  const [processedDataLot1, setProcessedDataLot1] = useState<RainbowLineAggregatedData[]>([]);
  const [processedDataLot2, setProcessedDataLot2] = useState<RainbowLineAggregatedData[]>([]);
  const [statsDataLot1, setStatsDataLot1] = useState<AggregatedData[]>([]);
  const [statsDataLot2, setStatsDataLot2] = useState<AggregatedData[]>([]);
  const [statsDataLot1Compare, setStatsDataLot1Compare] = useState<AggregatedData[]>([]);
  const [statsDataLot2Compare, setStatsDataLot2Compare] = useState<AggregatedData[]>([]);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>(createInitialPeriod());
  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>(createInitialPeriod());

  const lot1Daily = useLotDailyData("rainbow-line-parking-lot-1-gate", type, period, comparePeriod);
  const lot2Daily = useLotDailyData("rainbow-line-parking-lot-2-gate", type, period, comparePeriod);

  useInitialization(() => {
    getRawData({
      placement: "rainbow-line-parking-lot-1-gate",
      objectClass: "LicensePlate",
      aggregateRange: "full",
    }).then(setDataLot1);
    getRawData({
      placement: "rainbow-line-parking-lot-2-gate",
      objectClass: "LicensePlate",
      aggregateRange: "full",
    }).then(setDataLot2);
  });

  // フィルター（カラム名からフィルターにマッチするかどうかを判別する関数）
  const judge = useCallback(
    (key: string) => {
      let prefectures =
        filters["region"] === "all"
          ? Object.keys(PREFECTURES)
          : REGIONS_PREFECTURES[filters["region"]].prefectures;
      if (filters["prefecture"] !== "all")
        prefectures = prefectures.filter((v) => v === filters["prefecture"]);
      const carCategories =
        filters["carCategory"] === "all" ? Object.keys(CAR_CATEGORIES) : [filters["carCategory"]];
      return (
        prefectures.some((v) => key.startsWith(v)) && carCategories.some((v) => key.endsWith(v))
      );
    },
    [filters],
  );

  const getStatsDataForPeriod = useCallback(
    (period: Period): [AggregatedData[], AggregatedData[]] => {
      if (type === "month") {
        const end = period.endMonth
          ? new Date(period.endMonth.getFullYear(), period.endMonth.getMonth() + 1, 0)
          : undefined;
        const filtered1 =
          period.startMonth && end ? aggregateMonthly(dataLot1, period.startMonth, end, judge) : [];
        const filtered2 =
          period.startMonth && end ? aggregateMonthly(dataLot2, period.startMonth, end, judge) : [];
        return [filtered1, filtered2];
      }
      if (type === "week") {
        const filtered1 =
          period.startWeekRange && period.endWeekRange
            ? aggregateWeekly(dataLot1, period.startWeekRange, period.endWeekRange, judge)
            : [];
        const filtered2 =
          period.startWeekRange && period.endWeekRange
            ? aggregateWeekly(dataLot2, period.startWeekRange, period.endWeekRange, judge)
            : [];
        return [filtered1, filtered2];
      }
      return [[], []];
    },
    [dataLot1, dataLot2, type, judge],
  );

  // 「month」「week」の統計値用データ
  useEffect(() => {
    const [filtered1, filtered2] = getStatsDataForPeriod(period);
    const [filtered1Compare, filtered2Compare] = getStatsDataForPeriod(comparePeriod);
    setStatsDataLot1(filtered1);
    setStatsDataLot2(filtered2);
    setStatsDataLot1Compare(filtered1Compare);
    setStatsDataLot2Compare(filtered2Compare);
  }, [getStatsDataForPeriod, period, comparePeriod]);

  const aggregateParkingLotData = useCallback(
    (lot1: RainbowLineAggregatedData[], lot2: RainbowLineAggregatedData[]) => {
      const selected = filters["parkingLot"];
      if (selected === "all") {
        const reduced = [...lot1, ...lot2].reduce(
          (result, current, index, parent) =>
            reducePlacement(
              selected as
                | Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro">
                | "all",
              [result as AggregatedData[], current, index, parent],
            ),
          [] as RainbowLineAggregatedData[],
        ) as RainbowLineAggregatedData[];

        // 非加算項目（休日数/平日数/期間情報）を補正
        return reduced.map((row, i) => ({
          ...row,
          weekendDays: lot1[i]?.["weekendDays"] ?? lot2[i]?.["weekendDays"],
          weekdayDays: lot1[i]?.["weekdayDays"] ?? lot2[i]?.["weekdayDays"],
        }));
      }
      if (selected === "rainbow-line-parking-lot-1-gate") {
        return lot1.map((row) => ({
          ...row,
          [`${selected} total count`]: row["total count"],
        }));
      }
      return lot2.map((row) => ({
        ...row,
        [`${selected} total count`]: row["total count"],
      }));
    },
    [filters],
  );

  const processRows = useCallback(
    (rows: AggregatedData[]): RainbowLineAggregatedData[] => {
      return (rows as AggregatedData[]).map((row) => {
        const filteredRow = {} as RainbowLineAggregatedData;
        // フィルターにマッチするカラムのみを抽出
        Object.entries(row).forEach(([key, value]) => {
          if (judge(key)) filteredRow[key] = value;
        });
        // 他に必要なカラムのデータを反映
        return compansateProcessedData(filteredRow, row as unknown as RainbowLineAggregatedData);
      });
    },
    [judge],
  );

  // 時間データの加工
  const processedDailyDataLot1 = useMemo(
    () => (type === "hour" ? processRows(lot1Daily.main) : []),
    [type, lot1Daily.main, processRows],
  );
  const processedDailyDataLot2 = useMemo(
    () => (type === "hour" ? processRows(lot2Daily.main) : []),
    [type, lot2Daily.main, processRows],
  );

  // 比較期間の時間データの加工
  const processedDailyDataLot1Compare = useMemo(
    () => (type === "hour" ? processRows(lot1Daily.compare) : []),
    [type, lot1Daily.compare, processRows],
  );
  const processedDailyDataLot2Compare = useMemo(
    () => (type === "hour" ? processRows(lot2Daily.compare) : []),
    [type, lot2Daily.compare, processRows],
  );

  // 集計結果（メモ化してそのまま渡す）
  const targetData = useMemo(
    () => aggregateParkingLotData(processedDataLot1, processedDataLot2),
    [aggregateParkingLotData, processedDataLot1, processedDataLot2],
  );

  const targetDailyData = useMemo(
    () => aggregateParkingLotData(processedDailyDataLot1, processedDailyDataLot2),
    [aggregateParkingLotData, processedDailyDataLot1, processedDailyDataLot2],
  );

  const targetDailyDataCompare = useMemo(
    () => aggregateParkingLotData(processedDailyDataLot1Compare, processedDailyDataLot2Compare),
    [aggregateParkingLotData, processedDailyDataLot1Compare, processedDailyDataLot2Compare],
  );

  const targetStatsData = useMemo(
    () => aggregateParkingLotData(statsDataLot1, statsDataLot2),
    [aggregateParkingLotData, statsDataLot1, statsDataLot2],
  );
  const targetStatsDenominatorCount = useMemo(() => statsDataLot1.length, [statsDataLot1.length]);

  const targetStatsDataCompare = useMemo(
    () => aggregateParkingLotData(statsDataLot1Compare, statsDataLot2Compare),
    [aggregateParkingLotData, statsDataLot1Compare, statsDataLot2Compare],
  );

  const targetStatsDenominatorCountCompare = useMemo(
    () => statsDataLot1Compare.length,
    [statsDataLot1Compare.length],
  );

  const hasData = useMemo(
    () => targetData.length > 0 && (type !== "hour" || targetDailyData.length > 0),
    [type, targetData, targetDailyData],
  );

  // 元データから期間ごとの加工
  useEffect(() => {
    const baseRows = dataLot1.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );
    setProcessedDataLot1(processRows(baseRows));
  }, [dataLot1, type, processRows]);

  useEffect(() => {
    const baseRows = dataLot2.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );
    setProcessedDataLot2(processRows(baseRows));
  }, [dataLot2, type, processRows]);

  return (
    <div className="flex flex-col w-full h-[100dvh] p-4 overflow-hidden">
      <Header title="レインボーライン駐車場 入込車両データ" />
      <div className="grid grid-cols-[1fr_auto] grid-rows-2 w-fit mx-auto place-content-center gap-4 pt-4">
        <FiltersSample
          className="w-fit row-span-2"
          defaultValues={filters}
          onFilterChange={(k, v) => setFilters({ ...filters, [`${k}`]: v })}
        />
        <TypeSelect className="self-end" type={type} onChange={setType} />
        <div className="flex items-center gap-2 h-fit">
          <Checkbox
            checked={compareMode}
            onCheckedChange={(v) => setCompareMode(!!v)}
            className="bg-white border-black hover:bg-gray-100"
            id="comparemode"
          />
          <Label htmlFor="comparemode" className="text-base">
            2期間比較
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-x-4 grow w-full h-full overflow-hidden py-4">
        {hasData && (
          <RainbowLineChartPanel
            type={type}
            period={period}
            setPeriod={setPeriod}
            isCompareMode={compareMode}
            data={targetData as AggregatedData[]}
            dailyData={targetDailyData as AggregatedData[]}
            statsDataMonthWeek={targetStatsData as AggregatedData[]}
            statsDenominatorCount={targetStatsDenominatorCount}
          />
        )}
        {compareMode && hasData && (
          <RainbowLineChartPanel
            type={type}
            period={comparePeriod}
            isCompareMode={compareMode}
            setPeriod={setComparePeriod}
            data={targetData as AggregatedData[]}
            dailyData={targetDailyDataCompare as AggregatedData[]}
            statsDataMonthWeek={targetStatsDataCompare as AggregatedData[]}
            statsDenominatorCount={targetStatsDenominatorCountCompare}
          />
        )}
      </div>
    </div>
  );
}

export default App;
