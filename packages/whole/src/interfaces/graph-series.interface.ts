import { PartiallyRequired } from "@/lib/utils";
import {
  OBJECT_CLASS,
  ObjectClass,
  ObjectClassAttribute,
  Placement,
  PLACEMENTS,
} from "@fukui-kanko/shared";

// keyを変更すると後方互換性が失われるので注意
export const GRAPH_TYPES = {
  simple: "単純棒グラフ",
  stack: "積み上げ棒グラフ",
  ratio: "100%積み上げ棒グラフ",
  pie: "円グラフ",
} as const;
export type GraphType = keyof typeof GRAPH_TYPES;

export interface GraphSeries {
  id?: string;
  name?: string;
  show?: boolean;
  graphType: GraphType;
  focusedAttribute?: ObjectClassAttribute;
  placement?: Placement;
  objectClass?: ObjectClass;
  exclude?: Record<string, string[]>;
}

export const isCartesian = (series: GraphSeries) =>
  ["simpleBar", "stackBar", "ratioBar"].includes(series.graphType);
export const isProportional = (series: GraphSeries) => ["simplePie"].includes(series.graphType);

export const SERIES_PROPERTY_EFFECT_TO: Record<
  keyof GraphSeries,
  (keyof GraphSeries)[] | undefined
> = {
  id: undefined,
  name: undefined,
  show: undefined,
  placement: ["objectClass", "graphType", "exclude", "focusedAttribute"],
  objectClass: ["graphType", "exclude", "focusedAttribute"],
  graphType: ["focusedAttribute"],
  focusedAttribute: undefined,
  exclude: undefined,
};

export function defaultSeriesName(series: GraphSeries): string {
  return `${series.placement ? PLACEMENTS[series.placement].text : ""}${
    series.objectClass !== undefined
      ? "の" + OBJECT_CLASS[series.objectClass]
      : series.placement
        ? "での"
        : ""
  }検出回数`;
}

export function isSeriesValid(
  series: GraphSeries,
): series is PartiallyRequired<GraphSeries, "placement" | "objectClass"> {
  return (
    series.placement !== undefined &&
    series.objectClass !== undefined &&
    (series.graphType === "simple" ? true : series.focusedAttribute !== undefined)
  );
}
