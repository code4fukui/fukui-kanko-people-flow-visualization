import { AggregatedData, Placement } from "../types";

// データ収集場所が異なるデータが含まれているArrayに対して、
// どちらかの場所を選択されていなければデータの集計開始時点が同じ行を合計する
export const reducePlacement: (
  selected: Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro"> | "all",
  props: Parameters<Parameters<typeof Array.prototype.reduce<AggregatedData[]>>[0]>,
) => ReturnType<typeof Array.prototype.reduce<AggregatedData[]>> = (
  selected,
  [result, current, _, parent],
) => {
  // すでに同じ時点のデータがある場合はスキップ
  if (result.findIndex((row) => row["aggregate from"] === current["aggregate from"]) !== -1)
    return result;

  // 同じ時点のデータを取得
  const sameDayData = parent.filter((row) => row["aggregate from"] === current["aggregate from"]);

  // 同じ時点のデータが1つだけの場合は集計せず追加
  if (sameDayData.length === 1) {
    result.push({
      ...current,
      placement: selected === "all" ? "rainbow-line-all" : current.placement,
    });
  } else {
    // 同じ時点のデータが2つ以上ある場合は合計を計算
    const sum = sameDayData.reduce((sum, row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (
          key === "aggregate from" ||
          key === "aggregate to" ||
          key === "placement" ||
          key === "object class"
        ) {
          // 数値データでないものはそのまま反映
          sum[key as keyof AggregatedData] = value;
        } else {
          // 数値データは合計を計算
          sum[key as keyof AggregatedData] = (
            (key in sum ? Number(`${sum[key]}`) : 0) +
            (typeof value === "number" ? value : !isNaN(Number(value)) ? Number(value) : 0)
          ).toString();
        }
      });
      return sum;
    }, {} as AggregatedData);
    result.push({
      ...sum,
      placement: selected === "all" ? "rainbow-line-all" : current.placement,
    });
  }
  return result;
};
