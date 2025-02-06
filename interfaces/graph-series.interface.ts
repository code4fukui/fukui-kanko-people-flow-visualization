import { OBJECT_CLASS, ObjectClass, ObjectClassAttribute } from "./aggregated-data.interface";
import { Placement, PLACEMENTS } from "./placement.interface";

export const GRAPH_TYPES = { simple: "単純", stack: "積み上げ", ratio: "100%積み上げ" } as const;
export type GraphType = keyof typeof GRAPH_TYPES;

export interface GraphSeries {
  id: string;
  name?: string;
  show?: boolean;
  graphType: GraphType;
  focusedAttribute?: ObjectClassAttribute;
  placement?: Placement;
  objectClass?: ObjectClass;
  exclude?: Record<string, string[]>;
}

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
