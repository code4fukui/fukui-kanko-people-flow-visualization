import { OBJECT_CLASS_ATTRIBUTES, PLACEMENTS, REGIONS_PREFECTURES } from "@fukui-kanko/shared";
import { SelectScrollable } from "@fukui-kanko/shared/components/parts";
import { cn } from "@fukui-kanko/shared/utils";

const filterAttributes: Array<{ items: { text: string; value: string }[]; name: string }> = [
  {
    name: "駐車場",
    items: [
      { text: "-", value: "reset" },
      ...Object.entries(PLACEMENTS)
        .filter(([key]) => key.includes("rainbow-line"))
        .map(([key, value]) => {
          return { text: value.text, value: key };
        }),
    ],
  },
  {
    name: "地方",
    items: [
      { text: "-", value: "reset" },
      ...Object.entries(REGIONS_PREFECTURES).map(([key, value]) => {
        return { text: value.name, value: key };
      }),
    ],
  },
  {
    name: "都道府県",
    items: [
      { text: "-", value: "reset" },
      ...Object.entries(OBJECT_CLASS_ATTRIBUTES.LicensePlate.prefectures).map(([key, value]) => {
        return { text: value, value: key };
      }),
    ],
  },
  {
    name: "車両分類",
    items: [
      { text: "-", value: "reset" },
      ...Object.entries(OBJECT_CLASS_ATTRIBUTES.LicensePlate.carCategories).map(([key, value]) => {
        return { text: value, value: key };
      }),
    ],
  },
];

export function FiltersSample({ className }: { className?: string }) {
  return (
    <ul className={cn(className, "flex w-full justify-center items-start gap-4")}>
      {filterAttributes.map((attribute, index) => (
        <li className="flex flex-col items-center" key={`${index}-${attribute.name}`}>
          <span className="font-bold text-center">{attribute.name}</span>
          <SelectScrollable
            items={attribute.items}
            onChange={alert}
            className="w-fit h-40 border-2 border-border rounded-lg flex flex-col gap-y-2"
          ></SelectScrollable>
        </li>
      ))}
    </ul>
  );
}
