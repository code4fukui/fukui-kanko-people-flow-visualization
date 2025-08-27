import { AggregatedData, GRAPH_VIEW_TYPES, KEYOF_AGGREGATED_DATA_BASE, Placement } from "../types";
import { getDateTimeString } from "../utils";

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
      [`${current.placement} total count`]: Number(current["total count"]),
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
          // total countは元データも別で保存しておく
          if (key === "total count") {
            sum[`${row.placement} total count`] = Number(value ?? 0).toString();
          }
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

export const reduceAggregateRange: (
  graphViewType: keyof typeof GRAPH_VIEW_TYPES,
  props: Parameters<Parameters<typeof Array.prototype.reduce<AggregatedData[]>>[0]>,
) => ReturnType<typeof Array.prototype.reduce<AggregatedData[]>> = (
  graphViewType,
  [result, current, _index, _parent],
) => {
  const aggregateRange = {
    from: new Date(current["aggregate from"]),
    to: new Date(current["aggregate to"]),
  };
  if (graphViewType === "hour") {
    aggregateRange.from.setHours(aggregateRange.from.getHours(), 0, 0, 0);
    aggregateRange.to = new Date(aggregateRange.from);
    aggregateRange.to.setHours(aggregateRange.from.getHours() + 1);
  } else if (graphViewType === "day") {
    aggregateRange.from.setHours(0, 0, 0, 0);
    aggregateRange.to = new Date(aggregateRange.from);
    aggregateRange.to.setHours(0, 0, 0, 0);
    aggregateRange.to.setDate(aggregateRange.from.getDate() + 1);
  } else if (graphViewType === "week") {
    const dayOfWeek = aggregateRange.from.getDay();
    aggregateRange.from.setDate(aggregateRange.from.getDate() - dayOfWeek);
    aggregateRange.from.setHours(0, 0, 0, 0);
    aggregateRange.to = new Date(aggregateRange.from);
    aggregateRange.to.setDate(aggregateRange.from.getDate() + 7);
    aggregateRange.to.setHours(0, 0, 0, 0);
  } else if (graphViewType === "month") {
    aggregateRange.from.setDate(1);
    aggregateRange.from.setHours(0, 0, 0, 0);
    aggregateRange.to = new Date(aggregateRange.from);
    aggregateRange.to.setMonth(aggregateRange.from.getMonth() + 1);
  }

  // すでに同じ集計期間のデータがある場合は合計を計算
  const index = result.findIndex(
    (row) =>
      row["aggregate from"] === getDateTimeString(aggregateRange.from) &&
      row["placement"] === current.placement,
  );
  if (index !== -1) {
    result[index] = Object.keys(result[index]).reduce((newData, key) => {
      if (key === "placement" || key === "object class") {
        // 数値データでないものはそのまま反映
        newData[key as keyof AggregatedData] = current[key as keyof AggregatedData];
      } else if (key === "aggregate from") {
        newData[key as keyof AggregatedData] = getDateTimeString(aggregateRange.from);
      } else if (key === "aggregate to") {
        newData[key as keyof AggregatedData] = getDateTimeString(aggregateRange.to);
      } else {
        // 数値データは合計を計算
        newData[key] = Number(result[index][key] ?? 0) + Number(current[key] ?? 0);
      }
      return newData;
    }, {} as AggregatedData);
  } else {
    result.push({
      ...Object.entries(current).reduce((newData, [key, value]) => {
        if (key in KEYOF_AGGREGATED_DATA_BASE) return newData;
        newData[key] = Number(value ?? 0);
        return newData;
      }, {} as AggregatedData),
      "aggregate from": getDateTimeString(aggregateRange.from),
      "aggregate to": getDateTimeString(aggregateRange.to),
      placement: current.placement,
      "object class": current["object class"],
      "total count": Number(current["total count"]),
    });
  }
  return result;
};
