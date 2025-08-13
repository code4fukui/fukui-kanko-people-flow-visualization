import { FILTER_ATTRIBUTES } from "@/interfaces/filter-attributes";
import { SelectScrollable } from "@fukui-kanko/shared/components/parts";
import { cn } from "@fukui-kanko/shared/utils";

export function FiltersSample({
  className,
  onFilterChange = () => {},
  defaultValues,
}: {
  className?: string;
  onFilterChange?: (
    attribute: (typeof FILTER_ATTRIBUTES)[number]["id"],
    value: (typeof FILTER_ATTRIBUTES)[number]["items"][number]["value"],
  ) => void;
  defaultValues?: Record<
    (typeof FILTER_ATTRIBUTES)[number]["id"],
    (typeof FILTER_ATTRIBUTES)[number]["items"][number]["value"]
  >;
}) {
  return (
    <ul className={cn(className, "flex w-full justify-center items-start gap-4")}>
      {FILTER_ATTRIBUTES.map((attribute) => (
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
