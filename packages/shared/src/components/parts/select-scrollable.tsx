import { useState } from "react";
import { cn } from "../../utils";
import { ScrollArea } from "../ui";

export function SelectScrollable({
  items,
  onChange,
  className,
}: {
  items: ArrayLike<{ text: string; value: string | number }>;
  className?: string;
  onChange: (value: string | number) => void;
}) {
  const [selected, setSelected] = useState<string | number | undefined>(undefined);
  return (
    <ScrollArea className={(cn(className), "overflow-auto")}>
      <ul>
        {Array.from(items).map((item, index) => (
          <li
            key={`${index}-${item.value}`}
            className={cn(
              "cursor-pointer px-2 hover:bg-gray-200",
              selected === item.value ? "bg-gray-300" : "",
              item.value === selected ? "bg-cyan-100" : "",
            )}
            onClick={() => {
              setSelected(item.value);
              onChange(item.value);
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
