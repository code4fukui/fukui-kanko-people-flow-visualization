import { MonthPicker } from "@/components/parts/month-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CalendarIcon } from "@primer/octicons-react";

type MonthRangePickerProps = {
  startMonth: Date | undefined;
  endMonth: Date | undefined;
  onChange: (start: Date | undefined, end: Date | undefined) => void;
};

export function MonthRangePicker({ startMonth, endMonth, onChange }: MonthRangePickerProps) {
  const [openStartMonth, setOpenStartMonth] = useState(false);
  const [openEndMonth, setOpenEndMonth] = useState(false);

  // 終了月が開始月より前になったらリセット
  useEffect(() => {
    if (
      startMonth &&
      endMonth &&
      (endMonth.getFullYear() < startMonth.getFullYear() ||
        (endMonth.getFullYear() === startMonth.getFullYear() &&
          endMonth.getMonth() < startMonth.getMonth()))
    ) {
      onChange(startMonth, undefined);
    }
  }, [startMonth, endMonth, onChange]);

  return (
    <div className="flex flex-row gap-6 mb-6">
      <div className="flex flex-col gap-3">
        <Label className="px-1">開始</Label>
        <Popover open={openStartMonth} onOpenChange={setOpenStartMonth}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {startMonth
                  ? `${startMonth.getFullYear()}/${String(startMonth.getMonth() + 1).padStart(2, "0")}`
                  : "Select month"}
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
      <div className="flex flex-col gap-3">
        <Label className="px-1">終了</Label>
        <Popover open={openEndMonth} onOpenChange={setOpenEndMonth}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-48 justify-between font-normal",
                !startMonth && "opacity-50 pointer-events-none",
              )}
              disabled={!startMonth}
            >
              <span>
                {endMonth
                  ? `${endMonth.getFullYear()}/${String(endMonth.getMonth() + 1).padStart(2, "0")}`
                  : "Select month"}
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
