import { OBJECT_CLASS_ATTRIBUTES, PLACEMENTS, REGIONS_PREFECTURES } from "@fukui-kanko/shared";
import { SelectScrollable } from "@fukui-kanko/shared/components/parts";
import { cn } from "@fukui-kanko/shared/utils";

const selectAllOption = { text: "すべて", value: "all" } as const;

const filterAttributes: Array<{
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

export function FiltersSample({
  className,
  onFilterChange = () => {},
  defaultValues,
}: {
  className?: string;
  onFilterChange?: (
    attribute: (typeof filterAttributes)[number]["id"],
    value: (typeof filterAttributes)[number]["items"][number]["value"],
  ) => void;
  defaultValues?: Record<
    (typeof filterAttributes)[number]["id"],
    (typeof filterAttributes)[number]["items"][number]["value"]
  >;
}) {
  return (
    <ul className={cn(className, "flex w-full justify-center items-start gap-4")}>
      {filterAttributes.map((attribute) => (
        <li className="flex flex-col items-center" key={attribute.name}>
          <span className="font-bold text-center">{attribute.name}</span>
          <SelectScrollable
            items={attribute.items}
            onChange={(v) => onFilterChange(attribute.id, v)}
            defaultValue={defaultValues?.[attribute.id] || "all"}
            className="w-fit h-40 border-2 border-border rounded-lg flex flex-col gap-y-2"
          ></SelectScrollable>
        </li>
      ))}
    </ul>
  );
}
