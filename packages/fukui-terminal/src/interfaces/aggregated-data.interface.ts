export const OBJECT_CLASS = {
  Person: "人物",
} as const;
export type ObjectClass = keyof typeof OBJECT_CLASS;

export type AggregatedDataBase = {
  placement: "fukui-station-east-entrance";
  "object class": ObjectClass;
  "aggregate from": string;
  "aggregate to": string;
  "total count": number;
};
export type AggregatedData = AggregatedDataBase & Record<string, string | number>;
