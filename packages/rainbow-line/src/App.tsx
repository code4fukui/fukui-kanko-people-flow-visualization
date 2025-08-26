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
  const [dailyDataLot1, setDailyDataLot1] = useState<AggregatedData[]>([]);
  const [dataLot2, setDataLot2] = useState<AggregatedData[]>([]);
  const [dailyDataLot2, setDailyDataLot2] = useState<AggregatedData[]>([]);
  const [processedDataLot1, setProcessedDataLot1] = useState<RainbowLineAggregatedData[]>([]);
  const [processedDataLot2, setProcessedDataLot2] = useState<RainbowLineAggregatedData[]>([]);

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

  const processedDailyDataLot1Memo = useMemo(() => {
    if (type !== "hour") return [];
    return dailyDataLot1.map((row) => {
      const filteredRow = {} as RainbowLineAggregatedData;
      Object.entries(row).forEach(([key, value]) => {
        if (judge(key)) filteredRow[key] = value;
      });
      return compansateProcessedData(filteredRow, row as unknown as RainbowLineAggregatedData);
    });
  }, [type, dailyDataLot1, judge]);

  const processedDailyDataLot2Memo = useMemo(() => {
    if (type !== "hour") return [];
    return dailyDataLot2.map((row) => {
      const filteredRow = {} as RainbowLineAggregatedData;
      Object.entries(row).forEach(([key, value]) => {
        if (judge(key)) filteredRow[key] = value;
      });
      return compansateProcessedData(filteredRow, row as unknown as RainbowLineAggregatedData);
    });
  }, [type, dailyDataLot2, judge]);

  const getTargetData = useCallback(() => {
    if (filters["parkingLot"] === "all") {
      return [...processedDataLot1, ...processedDataLot2].reduce(
        (result, current, index, parent) =>
          reducePlacement(
            filters["parkingLot"] as
              | Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro">
              | "all",
            [result as AggregatedData[], current, index, parent],
          ),
        [] as RainbowLineAggregatedData[],
      );
    } else if (filters["parkingLot"] === "rainbow-line-parking-lot-1-gate") {
      return processedDataLot1.map((row) => ({
        ...row,
        [`${filters["parkingLot"]} total count`]: row["total count"],
      }));
    } else {
      return processedDataLot2.map((row) => ({
        ...row,
        [`${filters["parkingLot"]} total count`]: row["total count"],
      }));
    }
  }, [filters, processedDataLot1, processedDataLot2]);

  const getTargetDailyData = useCallback(() => {
    if (filters["parkingLot"] === "all") {
      return [...processedDailyDataLot1Memo, ...processedDailyDataLot2Memo].reduce(
        (result, current, index, parent) =>
          reducePlacement(
            filters["parkingLot"] as
              | Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro">
              | "all",
            [result as AggregatedData[], current, index, parent],
          ),
        [] as RainbowLineAggregatedData[],
      );
    } else if (filters["parkingLot"] === "rainbow-line-parking-lot-1-gate") {
      return processedDailyDataLot1Memo.map((row) => ({
        ...row,
        [`${filters["parkingLot"]} total count`]: row["total count"],
      }));
    } else {
      return processedDailyDataLot2Memo.map((row) => ({
        ...row,
        [`${filters["parkingLot"]} total count`]: row["total count"],
      }));
    }
  }, [filters, processedDailyDataLot1Memo, processedDailyDataLot2Memo]);

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

  useEffect(() => {
    const processed =
      type === "hour"
        ? dailyDataLot1
        : dataLot1
            .reduce(
              (result, current, index, parent) =>
                reduceAggregateRange(type, [result as AggregatedData[], current, index, parent]),
              [] as RainbowLineAggregatedData[],
            )
            .map((row) => {
              let filteredRow = {} as RainbowLineAggregatedData;
              // フィルターにマッチするカラムのみを抽出
              Object.entries(row).forEach(([key, value]) => {
                if (judge(key)) filteredRow[key] = value;
              });
              // 他に必要なカラムのデータを反映
              filteredRow = compansateProcessedData(filteredRow, row);
              return filteredRow;
            });
    if (type !== "hour") {
      setProcessedDataLot1(processed);
    }
  }, [dataLot1, dailyDataLot1, filters, type, judge]);

  useEffect(() => {
    const processed = dataLot2
      .reduce(
        (result, current, index, parent) =>
          reduceAggregateRange(type, [result as AggregatedData[], current, index, parent]),
        [] as RainbowLineAggregatedData[],
      )
      .map((row) => {
        let filteredRow = {} as RainbowLineAggregatedData;
        // フィルターにマッチするカラムのみを抽出
        Object.entries(row).forEach(([key, value]) => {
          if (judge(key)) filteredRow[key] = value;
        });
        // 他に必要なカラムのデータを反映
        filteredRow = compansateProcessedData(filteredRow, row);
        return filteredRow;
      });
    setProcessedDataLot2(processed);
  }, [dataLot2, filters, type, judge]);

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
        {(type !== "hour" || processedDailyDataLot1Memo.length > 0) && (
          <RainbowLineChartPanel
            type={type}
            period={period}
            setPeriod={setPeriod}
            isCompareMode={compareMode}
            data={getTargetData() as AggregatedData[]}
            dailyData={getTargetDailyData() as AggregatedData[]}
          />
        )}
        {compareMode && (type !== "hour" || processedDailyDataLot1Memo.length > 0) && (
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
