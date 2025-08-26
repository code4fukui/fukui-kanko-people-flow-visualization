import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AggregatedData,
  AggregatedDataBase,
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

  const [dailyDataLot1, setDailyDataLot1] = useState<AggregatedData[]>([]);
  const [dailyDataLot2, setDailyDataLot2] = useState<AggregatedData[]>([]);
  const [processedDailyDataLot1, setProcessedDailyDataLot1] = useState<RainbowLineAggregatedData[]>(
    [],
  );
  const [processedDailyDataLot2, setProcessedDailyDataLot2] = useState<RainbowLineAggregatedData[]>(
    [],
  );

  // 本期間の状態
  const [period, setPeriod] = useState<Period>(createInitialPeriod());

  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>(createInitialPeriod());

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

  const aggregatedParkingLotData = useCallback(
    (lot1: RainbowLineAggregatedData[], lot2: RainbowLineAggregatedData[]) => {
      const selected = filters["parkingLot"];
      if (selected === "all") {
        return [...lot1, ...lot2].reduce(
          (result, current, index, parent) =>
            reducePlacement(
              selected as
                | Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro">
                | "all",
              [result as AggregatedData[], current, index, parent],
            ),
          [] as RainbowLineAggregatedData[],
        );
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

  const getTargetDailyData = useCallback(() => {
    return aggregatedParkingLotData(processedDailyDataLot1, processedDailyDataLot2);
  }, [aggregatedParkingLotData, processedDailyDataLot1, processedDailyDataLot2]);

  const targetData = useMemo(() => getTargetData(), [getTargetData]);
  const targetDailyData = useMemo(() => getTargetDailyData(), [getTargetDailyData]);
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

  useEffect(() => {
    if (type !== "hour") {
      return;
    }
    let isCurrent = true;
    const fetchData = async () => {
      if (period.startDate && period.endDate) {
        const resultsLot1: AggregatedData[] = [];
        const resultsLot2: AggregatedData[] = [];
        const current = new Date(period.startDate);
        const end = new Date(period.endDate);

        while (current <= end) {
          // 1時間ごとに取得
          const [rawLot1, rawLot2] = await Promise.all([
            getRawData({
              placement: "rainbow-line-parking-lot-1-gate",
              objectClass: "LicensePlate",
              aggregateRange: "daily", // 1時間毎のデータはdailyに含まれています
              date: new Date(current),
            }),
            getRawData({
              placement: "rainbow-line-parking-lot-2-gate",
              objectClass: "LicensePlate",
              aggregateRange: "daily",
              date: new Date(current),
            }),
          ]);
          resultsLot1.push(...rawLot1);
          resultsLot2.push(...rawLot2);
          current.setDate(current.getDate() + 1);
        }

        if (isCurrent) {
          setDailyDataLot1(resultsLot1);
          setDailyDataLot2(resultsLot2);
        }
      }
    };
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [type, period.startDate, period.endDate]);

  const processRows = (rows: AggregatedData[]): RainbowLineAggregatedData[] => {
    return (rows as AggregatedData[]).map((row) => {
      const filteredRow = {} as RainbowLineAggregatedData;
      // フィルターにマッチするカラムのみを抽出
      Object.entries(row).forEach(([key, value]) => {
        if (judge(key)) filteredRow[key] = value;
      });
      // 他に必要なカラムのデータを反映
      return compansateProcessedData(filteredRow, row as unknown as RainbowLineAggregatedData);
    });
  };

  useEffect(() => {
    const baseRows = dataLot1.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );

    if (type === "hour") {
      setProcessedDataLot1(processRows(baseRows));
      setProcessedDailyDataLot1(processRows(dailyDataLot1));
    } else {
      setProcessedDataLot1(processRows(baseRows));
    }
  }, [dataLot1, dailyDataLot1, type, judge]);

  useEffect(() => {
    const baseRows = dataLot2.reduce<AggregatedData[]>(
      (result, current, index, parent) =>
        reduceAggregateRange(type, [result, current, index, parent]),
      [],
    );

    if (type === "hour") {
      setProcessedDataLot2(processRows(baseRows));
      setProcessedDailyDataLot2(processRows(dailyDataLot2));
    } else {
      setProcessedDataLot2(processRows(baseRows));
    }
  }, [dataLot2, dailyDataLot2, type, judge]);

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
            dailyData={getTargetDailyData() as AggregatedData[]}
          />
        )}
        {compareMode && hasData && (
          <RainbowLineChartPanel
            type={type}
            period={comparePeriod}
            isCompareMode={compareMode}
            setPeriod={setComparePeriod}
            data={getTargetData() as AggregatedData[]}
            dailyData={getTargetDailyData() as AggregatedData[]}
          />
        )}
      </div>
    </div>
  );
}

export default App;
