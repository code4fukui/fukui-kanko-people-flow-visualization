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
    <ScrollArea className={cn(className)}>
      <div className="flex flex-col">
        {Array.from(items).map((item) => (
          <Button
            key={String(item.value)}
            onClick={() => {
              setSelected(item.value);
              onChange(item.value);
            }}
            variant="ghost"
            className={cn(
              "block rounded-none h-fit py-1 px-4 w-full text-left cursor-pointer hover:bg-gray-200",
              item.value === selected ? "bg-cyan-100" : "",
            )}
          >
            {item.text}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
