import { useEffect, useState } from "react";
import {
  AggregatedData,
  AggregatedDataBase,
  CAR_CATEGORIES,
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
  const [type, setType] = useState<keyof typeof GRAPH_VIEW_TYPES>("month");
  const [compareMode, setCompareMode] = useState(false);

  const [data, setData] = useState<AggregatedData[]>([]);
  const [processedData, setProcessedData] = useState<RainbowLineAggregatedData[]>([]);

  // 本期間の状態
  const [period, setPeriod] = useState<Period>({
    startDate: undefined,
    endDate: undefined,
    startMonth: undefined,
    endMonth: undefined,
    startWeekRange: undefined,
    endWeekRange: undefined,
  });
  // const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  // const [filteredDailyData, setFilteredDailyData] = useState<AggregatedData[]>([]);

  // 比較期間の状態
  const [comparePeriod, setComparePeriod] = useState<Period>({
    startDate: undefined,
    endDate: undefined,
    startMonth: undefined,
    endMonth: undefined,
    startWeekRange: undefined,
    endWeekRange: undefined,
  });

  useInitialization(() => {
    Promise.all([
      getRawData({
        placement: "rainbow-line-parking-lot-1-gate",
        objectClass: "LicensePlate",
        aggregateRange: "full",
      }),
      getRawData({
        placement: "rainbow-line-parking-lot-2-gate",
        objectClass: "LicensePlate",
        aggregateRange: "full",
      }),
    ]).then(([firstLot, secondLot]) => {
      setData([...firstLot, ...secondLot]);
    });
  });

  useEffect(() => {
    const processed = data
      // 駐車場のフィルタが設定されていれば適用
      .filter((row) => {
        if (filters["parkingLot"] === "all") return true;
        else {
          return row.placement === filters["parkingLot"];
        }
      })
      // 同じ時点から集計している行が第一駐車場と第二駐車場で2つある場合があるので、これを合計値に変更する
      .reduce(
        (result, current, index, parent) =>
          reducePlacement(
            filters["parkingLot"] as
              | "rainbow-line-parking-lot-1-gate"
              | "rainbow-line-parking-lot-2-gate"
              | "all",
            [result as AggregatedData[], current, index, parent],
          ),
        [] as RainbowLineAggregatedData[],
      )
      .reduce(
        (result, current, index, parent) =>
          reduceAggregateRange(type, [result as AggregatedData[], current, index, parent]),
        [] as RainbowLineAggregatedData[],
      )
      .map((row) => {
        let filteredRow = {} as RainbowLineAggregatedData;
        // フィルター（カラム名からフィルターにマッチするかどうかを判別する関数）
        const judge = (key: string) => {
          let prefectures =
            filters["region"] === "all"
              ? Object.keys(PREFECTURES)
              : REGIONS_PREFECTURES[filters["region"]].prefectures;
          if (filters["prefecture"] !== "all")
            prefectures = prefectures.filter((v) => v === filters["prefecture"]);
          const carCategories =
            filters["carCategory"] === "all"
              ? Object.keys(CAR_CATEGORIES)
              : [filters["carCategory"]];
          return (
            prefectures.some((v) => key.includes(v)) && carCategories.some((v) => key.includes(v))
          );
        };
        // フィルターにマッチするカラムのみを抽出
        Object.entries(row).forEach(([key, value]) => {
          if (judge(key)) filteredRow[key] = value;
        });
        // 他に必要なカラムのデータを反映
        filteredRow = {
          ...filteredRow,
          placement: row.placement,
          "object class": row["object class"],
          "aggregate from": row["aggregate from"],
          "aggregate to": row["aggregate to"],
          "total count": Number(
            Object.values(filteredRow).reduce((sum, v) => Number(sum) + Number(v), 0),
          ),
          ...Object.values(RAINBOW_LINE_LOTS).reduce(
            (result, value) => {
              result[value] = Number(row[`${value}`]);
              return result;
            },
            {} as Record<string, number>,
          ),
        };
        return filteredRow;
      });
    setProcessedData(processed);
  }, [data, filters, type]);

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
        <RainbowLineChartPanel
          type={type}
          period={period}
          setPeriod={setPeriod}
          data={processedData as AggregatedData[]}
        />
        {compareMode && (
          <RainbowLineChartPanel
            type={type}
            period={comparePeriod}
            setPeriod={setComparePeriod}
            data={processedData as AggregatedData[]}
          />
        )}
      </div>
    </div>
  );
}

export default App;
