import { useEffect, useState } from "react";
import {
  AggregatedData,
  AggregatedDataBase,
  getRawData,
  GRAPH_VIEW_TYPES,
  Placement,
  useInitialization,
} from "@fukui-kanko/shared";
import { TypeSelect } from "@fukui-kanko/shared/components/parts";
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
      .reduce((acc, row, _index, array) => {
        if (acc.some((r) => r["aggregate from"] === row["aggregate from"])) return acc; // すでに同じ時点のデータがある場合はスキップ
        // 集計の開始時点を取得
        const addregatedFrom = row["aggregate from"];

        // 同じ時点のデータを取得
        const sameDayData = array.filter((r) => r["aggregate from"] === addregatedFrom);

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
                sum[k as keyof AggregatedData] = v;
              } else {
                // 数値データは合計を計算
                sum[k as keyof AggregatedData] = (
                  (Object.keys(sum).includes(k) ? parseInt(`${sum[k]}`) : 0) +
                  (typeof v === "number" ? v : parseInt(v))
                ).toString();
              }
            });
            return sum;
          }, {} as AggregatedData);
          acc.push({
            ...sum,
            placement: filters["parkingLot"] === "all" ? "rainbow-line-all" : row.placement,
          });
        }
        return acc;
      }, [] as RainbowLineAggregatedData[]);
    setProcessedData(processed);
  }, [data, filters]);

  return (
    <div className="flex flex-col w-full h-full min-h-[100dvh] p-4">
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
          />
          <Label htmlFor="terms" className="text-base">
            2期間比較
          </Label>
        </div>
      </div>
      <div className="grid place-content-center w-full h-full min-h-full">
        <span>{JSON.stringify(filters)}</span>
        <span>{JSON.stringify(type)}</span>
        <span>{JSON.stringify(compareMode)}</span>
        <span>
          期間の合計:{" "}
          {JSON.stringify(processedData.reduce((sum, v) => (sum += v["total count"]), 0))}
        </span>
      </div>
    </div>
  );
}

export default App;
