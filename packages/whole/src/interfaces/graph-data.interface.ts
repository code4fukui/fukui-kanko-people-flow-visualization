import { ChartConfig } from "@/components/ui/chart";
import { KEYOF_AGGREGATED_DATA_BASE } from "@/interfaces/aggregated-data.interface";
import { getData } from "@/lib/data/csv";
import { getDateStringRange, WEEK_DAYS } from "@/lib/date";
import { isKeyMatchingAttribute } from "@/lib/utils";
import {
  AGE_RANGES,
  ATTRIBUTES,
  attributeValueText,
  CAR_CATEGORIES,
  GENDERS,
  PREFECTURES,
} from "./aggregated-data.interface";
import { defaultSeriesName, GraphSeries, isSeriesValid } from "./graph-series.interface";

type ChartData = Record<string, string | number>[];
export type ChartGroup = { [ChartId: string]: ChartData };

export const getChartConfig = (
  seriesAll: { [id: string]: GraphSeries },
  data: ChartData,
  chartId: string,
): ChartConfig => {
  if (seriesAll && data && Object.keys(data.at(-1) ?? {}).length > 1) {
    const config: ChartConfig = {};
    if (chartId === "cartesian") {
      Object.keys(data.at(-1) ?? {}).forEach((k) => {
        if (k === "date") return;
        const [id, attributeKey] = k.split("#");
        const series = seriesAll[id];
        if (series === undefined) return;
        let label = series.name ?? defaultSeriesName(series);
        if (attributeKey !== undefined && attributeKey !== "" && series.focusedAttribute)
          label += " " + attributeValueText(series.focusedAttribute, attributeKey);
        config[k] = {
          label,
        };
      });
    } else if (chartId === "ratio") {
      Object.keys(data.at(-1) ?? {}).forEach((k) => {
        if (k === "date") return;
        const [id, attributeKey] = k.split("#");
        const series = seriesAll[id];
        if (series === undefined) return;
        let label = series.name ?? defaultSeriesName(series);
        if (attributeKey !== undefined && attributeKey !== "" && series.focusedAttribute)
          label += " " + attributeValueText(series.focusedAttribute, attributeKey);
        config[k] = {
          label,
        };
      });
    } else {
      data.forEach((v) => {
        const [id, attributeKey] = String(v.name).split("#");
        const series = seriesAll[id];
        if (series === undefined) return;
        let label = series.name ?? defaultSeriesName(series);
        if (attributeKey !== undefined && attributeKey !== "" && series.focusedAttribute)
          label = attributeValueText(series.focusedAttribute, attributeKey);
        config[v.name] = {
          label,
        };
      });
    }
    return config;
  } else return {};
};

export type Count = { count: number };
export const isCount = (v: object): v is Count => {
  return "count" in v && typeof v["count"] === "number";
};

const CARTESIAN_CHART_TYPES = ["simple", "stack"] as const;
type CartesianChartType = (typeof CARTESIAN_CHART_TYPES)[number];
export const isCartesian = (chartType: string): chartType is CartesianChartType => {
  return CARTESIAN_CHART_TYPES.some((v) => v === chartType);
};
const RATIO_CHART_TYPES = ["ratio"] as const;
type RatioChartType = (typeof RATIO_CHART_TYPES)[number];
export const isRatio = (chartType: string): chartType is RatioChartType => {
  return RATIO_CHART_TYPES.some((v) => v === chartType);
};
const POLAR_CHART_TYPES = ["pie"] as const;
type PolarChartType = (typeof POLAR_CHART_TYPES)[number];
export const isPolar = (chartType: string): chartType is PolarChartType => {
  return POLAR_CHART_TYPES.some((v) => v === chartType);
};
export type ChartType = CartesianChartType | PolarChartType;

export type Data = {
  [id: string]: {
    [chartType in
      | CartesianChartType
      | RatioChartType
      | PolarChartType]?: chartType extends CartesianChartType
      ? {
          [crossAxisValue: string]: {
            [attribute in
              | "total"
              | keyof typeof GENDERS
              | keyof typeof AGE_RANGES
              | keyof typeof PREFECTURES
              | keyof typeof CAR_CATEGORIES]?: Count;
          };
        }
      : {
          [attribute in
            | keyof typeof GENDERS
            | keyof typeof AGE_RANGES
            | keyof typeof PREFECTURES
            | keyof typeof CAR_CATEGORIES]?: Count;
        };
  };
};

const flatData = <T extends Record<string, unknown>>(
  obj: T,
  prefix = "",
): Record<string, unknown> => {
  return Object.keys(obj).reduce((prev, key) => {
    const pre = prefix.length ? prefix + (key !== "count" ? "#" : "") : "";
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(prev, flatData(obj[key] as Record<string, unknown>, pre + key));
    } else {
      Object.assign(prev, { [pre + (key !== "count" ? key : "")]: obj[key] });
    }

    return prev;
  }, {});
};

// データを一度だけ走査して、属性ごとの合計を計算
const computeAttributeCounts = (
  rawDataRow: Record<string, string | number>,
  focusedAttribute: string,
  attributeValues: Record<string, string>,
) => {
  const attributeCounts: Record<string, number> = {};

  for (const key in rawDataRow) {
    // 基本データフィールドはスキップ
    if ((KEYOF_AGGREGATED_DATA_BASE as string[]).includes(key)) continue;

    // 各属性値についてマッチングをチェック
    Object.keys(attributeValues).forEach((attributeValue) => {
      if (isKeyMatchingAttribute(focusedAttribute, attributeValue, key)) {
        if (attributeCounts[attributeValue] === undefined) attributeCounts[attributeValue] = 0;
        const value = Number(rawDataRow[key]);
        attributeCounts[attributeValue] += value;
      }
    });
  }
  return attributeCounts;
};

export async function dataFromSeriesAll(
  seriesAll: { [id: string]: GraphSeries },
  dateRange: { from: Date; to: Date },
  holidays: { date: Date; name: string }[],
): Promise<ChartGroup> {
  let data: Data = {};
  const dateStrings = getDateStringRange(dateRange);
  const holidayMap = new Map(holidays.map((h) => [h.date.toISOString().slice(0, 10), h.name]));

  for (const [id, series] of Object.entries(seriesAll)) {
    if (!series.show) continue;
    if (!isSeriesValid(series)) continue;

    const rawData = await getData(series.placement, series.objectClass, dateRange, series.exclude);

    if (isCartesian(series.graphType)) {
      let orientedData: { [date: string]: { [attribute: string]: Count } } = {};
      if (series.graphType === "simple") {
        for (const dateString of dateStrings) {
          const rawDataRowTheDay = rawData.find((rawDataRow) => {
            return String(rawDataRow["aggregate from"].slice(0, 10)) === dateString;
          });
          const totalCount = Number(rawDataRowTheDay?.["total count"]);
          orientedData = {
            ...orientedData,
            [dateString]: {
              ...orientedData[dateString],
              total: { count: isNaN(totalCount) ? 0 : totalCount },
            },
          };
        }
      } else if (series.graphType === "stack") {
        if (series.focusedAttribute === undefined)
          throw new Error("invalid focused attribute value");
        for (const dateString of dateStrings) {
          const rawDataRowTheDay = rawData.find((rawDataRow) => {
            return String(rawDataRow["aggregate from"].slice(0, 10)) === dateString;
          });
          if (rawDataRowTheDay === undefined) continue;
          const dateData = orientedData[dateString] || {};
          const dateTotal = Number(rawDataRowTheDay["total count"]);
          const list = ATTRIBUTES[series.focusedAttribute];
          const attributeCounts = computeAttributeCounts(
            rawDataRowTheDay,
            series.focusedAttribute,
            list,
          );

          Object.entries(attributeCounts).forEach(([listitem, itemCount]) => {
            dateData[listitem] = { count: itemCount };
          });
          dateData.categoryTotal = { count: dateTotal };
          orientedData = {
            ...orientedData,
            [dateString]: dateData,
          };
        }
      }

      data = {
        ...data,
        [id]: {
          [series.graphType]: {
            ...orientedData,
          },
        },
      };
    } else if (isRatio(series.graphType)) {
      let orientedData: { [date: string]: { [attribute: string]: Count } } = {};
      if (series.graphType === "ratio") {
        if (series.focusedAttribute === undefined)
          throw new Error("invalid focused attribute value");
        for (const dateString of dateStrings) {
          const rawDataRowTheDay = rawData.find((rawDataRow) => {
            return String(rawDataRow["aggregate from"].slice(0, 10)) === dateString;
          });
          if (rawDataRowTheDay === undefined) continue;
          const dateData = orientedData[dateString] || {};
          const dateTotal = Number(rawDataRowTheDay["total count"]);
          const list = ATTRIBUTES[series.focusedAttribute];
          const attributeCounts = computeAttributeCounts(
            rawDataRowTheDay,
            series.focusedAttribute,
            list,
          );

          Object.entries(attributeCounts).forEach(([listitem, itemCount]) => {
            dateData[listitem] = { count: itemCount };
          });
          dateData.categoryTotal = { count: dateTotal };
          orientedData = {
            ...orientedData,
            [dateString]: dateData,
          };
        }
      }

      data = {
        ...data,
        [id]: {
          [series.graphType]: {
            ...orientedData,
          },
        },
      };
    } else if (isPolar(series.graphType)) {
      let orientedData: { [attribute: string]: Count } = {};

      if (series.graphType === "pie") {
        if (series.focusedAttribute === undefined) throw new Error("invalid focused attribute");
        const list = ATTRIBUTES[series.focusedAttribute];
        Object.keys(list)
          .filter((listitem) => {
            if (
              series.exclude === undefined ||
              series.focusedAttribute === undefined ||
              series.exclude[series.focusedAttribute] === undefined
            )
              return true;
            return !series.exclude[series.focusedAttribute].includes(listitem);
          })
          .forEach((listitem) => {
            orientedData = {
              ...orientedData,
              [listitem]: {
                count: rawData.reduce(
                  (sum, rawDataRow) =>
                    (sum += Object.keys(rawDataRow)
                      .filter((key) =>
                        series.focusedAttribute
                          ? isKeyMatchingAttribute(series.focusedAttribute, listitem, key)
                          : false,
                      )
                      .map((key) => Number(rawDataRow[key]))
                      .reduce((rowSum, rowCurrent) => (rowSum += rowCurrent), 0)),
                  0,
                ),
              },
            };
          });
      }

      data = {
        ...data,
        [id]: {
          [series.graphType]: {
            ...orientedData,
          },
        },
      };
    } else continue;
  }

  const flatten = flatData(data);
  const result: ChartGroup = {
    cartesian: dateStrings.map((v) => ({
      date: v,
      dayOfWeek: WEEK_DAYS[new Date(v).getDay()],
      holidayName: holidayMap.get(v) ?? "",
    })),
    ratio: dateStrings.map((v) => ({
      date: v,
      dayOfWeek: WEEK_DAYS[new Date(v).getDay()],
      holidayName: holidayMap.get(v) ?? "",
    })),
  };

  for (const [key, value] of Object.entries(flatten)) {
    const [id, chartType, x, y] = key.split("#");
    if (isCartesian(chartType)) {
      const index = result["cartesian"].findIndex((obj) => obj.date === x);
      result["cartesian"][index < 0 ? result["cartesian"].length : index] = {
        ...result["cartesian"][index],
        [`${id}#${y}`]: Number(value),
      };
    } else if (isRatio(chartType)) {
      const index = result["ratio"].findIndex((obj) => obj.date === x);

      result["ratio"][index < 0 ? result["ratio"].length : index] = {
        ...result["ratio"][index],
        [`${id}#${y}`]: Number(value),
      };
    } else if (isPolar(chartType)) {
      result[id] = [
        ...(result[id] ?? []),
        {
          name: `${id}#${x}`,
          value: Number(value),
        },
      ];
    }
  }
  return result;
}
