import { useState } from "react";
import { cn } from "../../utils";
import { Button, ScrollArea } from "../ui";

export function SelectScrollable<T = string | number>({
  defaultValue,
  items,
  onChange,
  className,
}: {
  defaultValue?: Array<T>;
  items: ArrayLike<{ text: string; value: T }>;
  className?: string;
  onChange: (value: T) => void;
}) {
  const [selected, setSelected] = useState<T[] | undefined>(defaultValue || undefined);
  return (
    <ScrollArea className={cn(className)}>
      <div className="flex flex-col">
        {Array.from(items).map((item) => (
          <Button
            key={String(item.value)}
            onClick={() => {
              if (item.value === "all") {
                setSelected([]);
              } else if (selected?.includes(item.value)) {
                setSelected(selected.filter((v) => v !== item.value));
              } else {
                if (selected && selected.length > 0) {
                  setSelected([...selected, item.value]);
                } else {
                  setSelected([item.value]);
                }
              }
              onChange(item.value);
            }}
            variant="ghost"
            className={cn(
              "block rounded-none h-fit py-1 px-4 w-full text-left cursor-pointer hover:bg-gray-200",
              selected?.includes(item.value) || (selected?.length === 0 && item.value === "all")
                ? "bg-cyan-100"
                : "",
            )}
          >
            {item.text}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
