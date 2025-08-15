import { useEffect, useState } from "react";
import {
  AggregatedData,
  AggregatedDataBase,
  CAR_CATEGORIES,
  getMaxDate,
  getRawData,
  GRAPH_VIEW_TYPES,
  Placement,
  PREFECTURES,
  REGIONS_PREFECTURES,
  useInitialization,
} from "@fukui-kanko/shared";
import { Graph, RangeSelector, TypeSelect } from "@fukui-kanko/shared/components/parts";
import { Checkbox, Label } from "@fukui-kanko/shared/components/ui";
import { FiltersSample } from "./components/parts/filters";
import { HeaderPlaceHolder } from "./components/parts/ph-header";
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

  const [graphRange, setGraghRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    // 重複処理が行えている期間のみを表示
    from: new Date("2024-12-20"),
    to: getMaxDate(),
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
    const processedAggregatedFrom = new Set<string>();
    const processed = data
      .filter((row) => {
        const aggregatedFrom = new Date(row["aggregate from"]);
        return (
          aggregatedFrom >= (graphRange.from || new Date(0)) &&
          aggregatedFrom < (graphRange.to || new Date())
        );
      })
      // 駐車場のフィルタが設定されていれば適用
      .filter((row) => {
        if (filters["parkingLot"] === "all") return true;
        else {
          return row.placement === filters["parkingLot"];
        }
      })
      // 同じ時点から集計している行が第一駐車場と第二駐車場で2つある場合があるので、これを合計値に変更する
      .reduce((acc, row, _index, array) => {
        if (processedAggregatedFrom.has(row["aggregate from"])) return acc; // すでに同じ時点のデータがある場合はスキップ
        processedAggregatedFrom.add(row["aggregate from"]);
        // 集計の開始時点を取得
        const aggregatedFrom = row["aggregate from"];

        // 同じ時点のデータを取得
        const sameDayData = array.filter((r) => r["aggregate from"] === aggregatedFrom);

        // 同じ時点のデータが1つだけの場合は集計せず追加
        if (sameDayData.length === 1)
          acc.push({
            ...row,
            placement: filters["parkingLot"] === "all" ? "rainbow-line-all" : row.placement,
          });
        // 同じ時点のデータが2つ以上ある場合は合計を計算
        else {
          const sum = sameDayData.reduce((sum, r) => {
            Object.entries(r).forEach(([k, v]) => {
              if (
                k === "aggregate from" ||
                k === "aggregate to" ||
                k === "placement" ||
                k === "object class"
              ) {
                // 数値データでないものはそのまま反映
                sum[k as keyof RainbowLineAggregatedData] = v;
              } else {
                // 数値データは合計を計算
                sum[k as keyof RainbowLineAggregatedData] = (
                  (k in sum ? Number(`${sum[k]}`) : 0) +
                  (typeof v === "number" ? v : !isNaN(Number(v)) ? Number(v) : 0)
                ).toString();
              }
            });
            return sum;
          }, {} as RainbowLineAggregatedData);
          acc.push({
            ...sum,
            placement: filters["parkingLot"] === "all" ? "rainbow-line-all" : row.placement,
          });
        }
        return acc;
      }, [] as RainbowLineAggregatedData[])
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
        };
        return filteredRow;
      });
    setProcessedData(processed);
  }, [data, filters, graphRange]);

  return (
    <div className="flex flex-col w-full h-[100dvh] p-4 overflow-hidden">
      <HeaderPlaceHolder title="レインボーライン" />
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
      <div className="flex flex-col items-center w-full h-full max-h-full py-4 overflow-hidden">
        <RangeSelector
          type={"date"}
          start={graphRange.from}
          end={graphRange.to}
          setStart={(d) => setGraghRange({ ...graphRange, from: d })}
          setEnd={(d) => setGraghRange({ ...graphRange, to: d })}
        ></RangeSelector>

        <div className="flex flex-col gap-y-4 w-full max-h-full h-full overflow-auto">
          <Graph
            data={processedData as AggregatedData[]}
            type="day"
            xKey="aggregate from"
            yKey="total count"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
