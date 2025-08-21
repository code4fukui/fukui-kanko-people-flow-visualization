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
  const [year, setYear] = React.useState(
    selected ? selected.getFullYear() : new Date().getFullYear(),
  );

  React.useEffect(() => {
    if (selected) {
      setYear(selected.getFullYear());
    }
  }, [selected]);

  const selectedMonth =
    selected && selected.getFullYear() === year ? selected.getMonth() : undefined;

  const handleMonthClick = (monthIndex: number) => {
    if (onChange) {
      onChange(new Date(year, monthIndex, 1));
    }
  };

  const MAX_DATE = getMaxDate();

  return (
    <div className={cn("p-4 w-fit", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y - 1)}>
          &lt;
        </Button>
        <span className="font-semibold">{year}年</span>
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y + 1)}>
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => {
          // 選択できる範囲を制限
          const isDisabled =
            year < minDate.getFullYear() ||
            year > MAX_DATE.getFullYear() ||
            (year === minDate.getFullYear() && i < minDate.getMonth()) ||
            (year === MAX_DATE.getFullYear() && i > MAX_DATE.getMonth());
          return (
            <Button
              key={m}
              variant={selectedMonth === i ? "default" : "outline"}
              onClick={() => handleMonthClick(i)}
              className={cn("w-16")}
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
