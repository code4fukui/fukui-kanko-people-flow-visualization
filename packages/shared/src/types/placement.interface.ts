import { ObjectClass } from "./aggregated-data.interface";

export const PLACEMENTS = {
  "fukui-station-east-entrance": {
    text: "福井駅",
    targetObjects: ["Person", "Face"] as const as ObjectClass[],
  },
  "tojinbo-shotaro": {
    text: "東尋坊",
    targetObjects: ["Person", "Face"] as const as ObjectClass[],
  },
  "rainbow-line-parking-lot-1-gate": {
    text: "レインボーライン 第一駐車場",
    targetObjects: ["Face", "LicensePlate"] as const as ObjectClass[],
  },
  "rainbow-line-parking-lot-2-gate": {
    text: "レインボーライン 第二駐車場",
    targetObjects: ["Face", "LicensePlate"] as const as ObjectClass[],
  },
} as const;
export type Placement = keyof typeof PLACEMENTS;
