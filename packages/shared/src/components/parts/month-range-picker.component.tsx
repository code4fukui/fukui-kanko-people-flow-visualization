import { useEffect, useState } from "react";
import { MonthPicker } from "@fukui-kanko/shared/components/parts";
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@fukui-kanko/shared/components/ui";
import { CalendarIcon } from "@primer/octicons-react";
import { cn } from "../../lib/utils";

type MonthRangePickerProps = {
  startMonth: Date | undefined;
  endMonth: Date | undefined;
  onChange: (start: Date | undefined, end: Date | undefined) => void;
};

/**
 * startがendより前の月かどうかを判定するユーティリティ関数
 */
function isMonthBefore(start: Date, end: Date) {
  return (
    end.getFullYear() < start.getFullYear() ||
    (end.getFullYear() === start.getFullYear() && end.getMonth() < start.getMonth())
  );
}

export function MonthRangePicker({ startMonth, endMonth, onChange }: MonthRangePickerProps) {
  const [openStartMonth, setOpenStartMonth] = useState(false);
  const [openEndMonth, setOpenEndMonth] = useState(false);

  // 終了月が開始月より前になったらリセット
  useEffect(() => {
    if (startMonth && endMonth && isMonthBefore(startMonth, endMonth)) {
      onChange(startMonth, undefined);
    }
  }, [startMonth, endMonth, onChange]);

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-1">
        <Label className="px-1 text-base">開始</Label>
        <Popover open={openStartMonth} onOpenChange={setOpenStartMonth}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="lg:w-48 justify-between font-normal border-black">
              <span>
                {startMonth
                  ? `${startMonth.getFullYear()}/${String(startMonth.getMonth() + 1).padStart(2, "0")}`
                  : "月を選択"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <MonthPicker
              selected={startMonth}
              onChange={(date) => {
                onChange(date, endMonth);
                setOpenStartMonth(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-end pb-1 text-xl">〜</div>
      <div className="flex flex-col gap-1">
        <Label className="px-1 text-base">終了</Label>
        <Popover open={openEndMonth} onOpenChange={setOpenEndMonth}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "lg:w-48 justify-between font-normal border-black",
                !startMonth && "opacity-50 pointer-events-none",
              )}
              disabled={!startMonth}
            >
              <span>
                {endMonth
                  ? `${endMonth.getFullYear()}/${String(endMonth.getMonth() + 1).padStart(2, "0")}`
                  : "月を選択"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <MonthPicker
              selected={endMonth}
              onChange={(date) => {
                onChange(startMonth, date);
                setOpenEndMonth(false);
              }}
              minDate={startMonth}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
