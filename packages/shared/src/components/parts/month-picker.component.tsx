import * as React from "react";
import { Button } from "@fukui-kanko/shared/components/ui";
import { cn, getMaxDate, getMinDate } from "../../utils/utils";

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export interface MonthPickerProps {
  onChange?: (date: Date) => void;
  className?: string;
  selected?: Date;
  minDate?: Date;
}

export function MonthPicker({
  onChange,
  className,
  selected,
  minDate = getMinDate(),
}: MonthPickerProps) {
  // 範囲の年を算出
  const MAX_DATE = getMaxDate();
  const minYear = minDate.getFullYear();
  const maxYear = MAX_DATE.getFullYear();

  const [year, setYear] = React.useState(() => {
    const y = selected ? selected.getFullYear() : new Date().getFullYear();
    return Math.min(maxYear, Math.max(minYear, y));
  });

  React.useEffect(() => {
    setYear((prev) => {
      const target = selected ? selected.getFullYear() : prev;
      return Math.min(maxYear, Math.max(minYear, target));
    });
  }, [selected, minYear, maxYear]);

  const selectedMonth =
    selected && selected.getFullYear() === year ? selected.getMonth() : undefined;

  const handleMonthClick = (monthIndex: number) => {
    if (onChange) {
      onChange(new Date(year, monthIndex, 1));
    }
  };

  return (
    <div className={cn("p-4 w-fit", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setYear((y) => Math.max(minYear, y - 1))}
          disabled={year <= minYear}
        >
          &lt;
        </Button>
        <span className="font-semibold">{year}年</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setYear((y) => Math.min(maxYear, y + 1))}
          disabled={year >= maxYear}
        >
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => {
          // 選択できる範囲を制限
          const isDisabled =
            year < minYear ||
            year > maxYear ||
            (year === minYear && i < minDate.getMonth()) ||
            (year === maxYear && i > MAX_DATE.getMonth());
          return (
            <Button
              key={m}
              variant={selectedMonth === i ? "default" : "outline"}
              onClick={() => handleMonthClick(i)}
              className={cn(
                "w-16",
                isDisabled && "disabled:opacity-30",
                selectedMonth === i && "bg-[#6eba2c] text-white",
              )}
              disabled={isDisabled}
            >
              {m}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
