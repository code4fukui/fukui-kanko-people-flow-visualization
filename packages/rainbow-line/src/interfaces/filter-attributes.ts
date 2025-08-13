import { OBJECT_CLASS_ATTRIBUTES, PLACEMENTS, REGIONS_PREFECTURES } from "@fukui-kanko/shared";

const selectAllOption = { text: "すべて", value: "all" } as const;

export const FILTER_ATTRIBUTES: Array<{
  items: { text: string; value: string }[];
  name: string;
  id: string;
}> = [
  {
    name: "駐車場",
    id: "parkingLot",
    items: [
      selectAllOption,
      ...Object.entries(PLACEMENTS)
        .filter(([key]) => key.includes("rainbow-line"))
        .map(([key, value]) => {
          return { text: value.text, value: key };
        }),
    ] as const,
  } as const,
  {
    name: "地方",
    id: "region",
    items: [
      selectAllOption,
      ...Object.entries(REGIONS_PREFECTURES).map(([key, value]) => {
        return { text: value.name, value: key };
      }),
    ] as const,
  } as const,
  {
    name: "都道府県",
    id: "prefecture",
    items: [
      selectAllOption,
      ...Object.entries(OBJECT_CLASS_ATTRIBUTES.LicensePlate.prefectures).map(([key, value]) => {
        return { text: value, value: key };
      }),
    ] as const,
  } as const,
  {
    name: "車両分類",
    id: "carCategory",
    items: [
      selectAllOption,
      ...Object.entries(OBJECT_CLASS_ATTRIBUTES.LicensePlate.carCategories).map(([key, value]) => {
        return { text: value, value: key };
      }),
    ] as const,
  } as const,
] as const;
