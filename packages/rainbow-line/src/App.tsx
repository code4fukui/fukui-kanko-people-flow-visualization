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
  const [filteredDataLot1, setFilteredDataLot1] = useState<AggregatedData[]>([]);
  const [filteredDataLot2, setFilteredDataLot2] = useState<AggregatedData[]>([]);
  const [filteredDataLot1Compare, setFilteredDataLot1Compare] = useState<AggregatedData[]>([]);
  const [filteredDataLot2Compare, setFilteredDataLot2Compare] = useState<AggregatedData[]>([]);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>(createInitialPeriod());

  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>(createInitialPeriod());

  const lot1Daily = useLotDailyData("rainbow-line-parking-lot-1-gate", type, period, comparePeriod);
  const lot2Daily = useLotDailyData("rainbow-line-parking-lot-2-gate", type, period, comparePeriod);

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
      return prefectures.some((v) => key.includes(v)) && carCategories.some((v) => key.includes(v));
    },
    [filters],
  );

  // 「month」「week」の時のみ利用する統計値用データ
  useEffect(() => {
    let filtered1: AggregatedData[] = [];
    let filtered2: AggregatedData[] = [];

    if (type === "month") {
      const end = period.endMonth
        ? new Date(period.endMonth.getFullYear(), period.endMonth.getMonth() + 1, 0)
        : undefined;
      filtered1 =
        period.startMonth && end ? aggregateMonthly(dataLot1, period.startMonth, end, judge) : [];
      filtered2 =
        period.startMonth && end ? aggregateMonthly(dataLot2, period.startMonth, end, judge) : [];
    } else if (type === "week") {
      filtered1 =
        period.startWeekRange && period.endWeekRange
          ? aggregateWeekly(dataLot1, period.startWeekRange, period.endWeekRange, judge)
          : [];
      filtered2 =
        period.startWeekRange && period.endWeekRange
          ? aggregateWeekly(dataLot2, period.startWeekRange, period.endWeekRange, judge)
          : [];
    }
    setFilteredDataLot1(filtered1);
    setFilteredDataLot2(filtered2);
  }, [dataLot1, dataLot2, period, type, judge]);

  // 比較期間の統計値用データ
  useEffect(() => {
    let filtered1: AggregatedData[] = [];
    let filtered2: AggregatedData[] = [];

    if (type === "month") {
      const end = comparePeriod.endMonth
        ? new Date(comparePeriod.endMonth.getFullYear(), comparePeriod.endMonth.getMonth() + 1, 0)
        : undefined;
      filtered1 =
        comparePeriod.startMonth && end
          ? aggregateMonthly(dataLot1, comparePeriod.startMonth, end, judge)
          : [];
      filtered2 =
        comparePeriod.startMonth && end
          ? aggregateMonthly(dataLot2, comparePeriod.startMonth, end, judge)
          : [];
    } else if (type === "week") {
      filtered1 =
        comparePeriod.startWeekRange && comparePeriod.endWeekRange
          ? aggregateWeekly(
              dataLot1,
              comparePeriod.startWeekRange,
              comparePeriod.endWeekRange,
              judge,
            )
          : [];
      filtered2 =
        comparePeriod.startWeekRange && comparePeriod.endWeekRange
          ? aggregateWeekly(
              dataLot2,
              comparePeriod.startWeekRange,
              comparePeriod.endWeekRange,
              judge,
            )
          : [];
    }
    setFilteredDataLot1Compare(filtered1);
    setFilteredDataLot2Compare(filtered2);
  }, [dataLot1, dataLot2, comparePeriod, type, judge]);

  const aggregatedParkingLotData = useCallback(
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

  const getTargetData = useCallback(() => {
    return aggregatedParkingLotData(processedDataLot1, processedDataLot2);
  }, [aggregatedParkingLotData, processedDataLot1, processedDataLot2]);

  const processedDailyDataLot1 = useMemo(
    () => (type === "hour" ? processRows(lot1Daily.main) : []),
    [type, lot1Daily.main, judge],
  );
  const processedDailyDataLot2 = useMemo(
    () => (type === "hour" ? processRows(lot2Daily.main) : []),
    [type, lot2Daily.main, judge],
  );

  // 比較期間の時間データ（加工済）
  const processedDailyDataLot1Compare = useMemo(
    () => (type === "hour" ? processRows(lot1Daily.compare) : []),
    [type, lot1Daily.compare, judge],
  );
  const processedDailyDataLot2Compare = useMemo(
    () => (type === "hour" ? processRows(lot2Daily.compare) : []),
    [type, lot2Daily.compare, judge],
  );

  const getTargetDailyData = useCallback(
    (isCompare = false) => {
      return aggregatedParkingLotData(
        isCompare ? processedDailyDataLot1Compare : processedDailyDataLot1,
        isCompare ? processedDailyDataLot2Compare : processedDailyDataLot2,
      );
    },
    [
      aggregatedParkingLotData,
      processedDailyDataLot1,
      processedDailyDataLot2,
      processedDailyDataLot1Compare,
      processedDailyDataLot2Compare,
    ],
  );

  const getTargetStatsData = useCallback(() => {
    return aggregatedParkingLotData(filteredDataLot1, filteredDataLot2);
  }, [aggregatedParkingLotData, filteredDataLot1, filteredDataLot2]);

  const getTargetStatsDataCompare = useCallback(() => {
    return aggregatedParkingLotData(filteredDataLot1Compare, filteredDataLot2Compare);
  }, [aggregatedParkingLotData, filteredDataLot1Compare, filteredDataLot2Compare]);

  const targetData = useMemo(() => getTargetData(), [getTargetData]);
  const targetDailyData = useMemo(() => getTargetDailyData(false), [getTargetDailyData]);
  const hasData = useMemo(
    () => targetData.length > 0 && (type !== "hour" || targetDailyData.length > 0),
    [type, targetData, targetDailyData],
  );

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

  function processRows(rows: AggregatedData[]): RainbowLineAggregatedData[] {
    return (rows as AggregatedData[]).map((row) => {
      const filteredRow = {} as RainbowLineAggregatedData;
      // フィルターにマッチするカラムのみを抽出
      Object.entries(row).forEach(([key, value]) => {
        if (judge(key)) filteredRow[key] = value;
      });
      // 他に必要なカラムのデータを反映
      return compansateProcessedData(filteredRow, row as unknown as RainbowLineAggregatedData);
    });
  }

  useEffect(() => {
    const baseRows = dataLot1.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );
    setProcessedDataLot1(processRows(baseRows));
  }, [dataLot1, type, judge]);

  useEffect(() => {
    const baseRows = dataLot2.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );
    setProcessedDataLot2(processRows(baseRows));
  }, [dataLot2, type, judge]);

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
            data={getTargetData() as AggregatedData[]}
            dailyData={getTargetDailyData(false) as AggregatedData[]}
            statsDataMonthWeek={getTargetStatsData() as AggregatedData[]}
          />
        )}
        {compareMode && hasData && (
          <RainbowLineChartPanel
            type={type}
            period={comparePeriod}
            isCompareMode={compareMode}
            setPeriod={setComparePeriod}
            data={getTargetData() as AggregatedData[]}
            dailyData={getTargetDailyData(true) as AggregatedData[]}
            statsDataMonthWeek={getTargetStatsDataCompare() as AggregatedData[]}
          />
        )}
      </div>
    </div>
  );
}

export default App;
