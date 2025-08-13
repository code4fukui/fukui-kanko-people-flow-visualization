import { useState } from "react";
import { cn } from "../../utils";
import { Button, ScrollArea } from "../ui";

export function SelectScrollable<T = string | number>({
  items,
  onChange,
  className,
}: {
  items: ArrayLike<{ text: string; value: T }>;
  className?: string;
  onChange: (value: T) => void;
}) {
  const [selected, setSelected] = useState<T | undefined>(undefined);
  return (
    <ScrollArea className={cn(className, "overflow-scroll")}>
      <ul>
        {Array.from(items).map((item, index) => (
          <li
            className={cn(
              "cursor-pointer hover:bg-gray-200",
              selected === item.value ? "bg-gray-300" : "",
              item.value === selected ? "bg-cyan-100" : "",
            )}
          >
            <Button
              onClick={() => {
                setSelected(item.value);
                onChange(item.value);
              }}
              variant="ghost"
              className="block rounded-none h-fit py-1 px-4 w-full text-left"
              key={`${index}-${item.value}`}
            >
              {item.text}
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
