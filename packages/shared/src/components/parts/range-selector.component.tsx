import { forwardRef, useEffect, useState } from "react";
import { DayButton } from "react-day-picker";
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@fukui-kanko/shared/components/ui";
import { cn, formatDate, getMaxDate, getMinDate, getWeekRange } from "@fukui-kanko/shared/utils";
import { CalendarIcon } from "@primer/octicons-react";
import { ja } from "date-fns/locale";

type WeekRange = { from: Date; to: Date } | undefined;

type RangeSelectorProps =
  | {
      type: "week";
      start: WeekRange;
      end: WeekRange;
      setStart: (range: WeekRange) => void;
      setEnd: (range: WeekRange) => void;
    }
  | {
      type: "date";
      start: Date | undefined;
      end: Date | undefined;
      setStart: (date: Date | undefined) => void;
      setEnd: (date: Date | undefined) => void;
    };

const CustomDayButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof DayButton>>(
  ({ className, day, modifiers, ...props }, ref) => {
    useEffect(() => {
      if (modifiers?.focused && ref && typeof ref !== "function") {
        (ref as React.RefObject<HTMLButtonElement>).current?.focus();
      }
    }, [modifiers?.focused, ref]);

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        data-day={day.date.toLocaleDateString()}
        data-selected-single={
          modifiers?.selected &&
          !modifiers?.range_start &&
          !modifiers?.range_end &&
          !modifiers?.range_middle
        }
        data-range-start={modifiers?.range_start}
        data-range-end={modifiers?.range_end}
        data-range-middle={modifiers?.range_middle}
        className={cn(
          // 選択色の上書き（ここを変更）
          "data-[selected-single=true]:bg-[#6eba2c] data-[selected-single=true]:text-white",
          "data-[range-start=true]:bg-[#6eba2c] data-[range-start=true]:text-white",
          "data-[range-end=true]:bg-[#6eba2c] data-[range-end=true]:text-white",
          // フォーカスやサイズなどの共通スタイル
          "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground",
          "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50",
          "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
          "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
          "data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none",
          "data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md",
          "[&>span]:text-xs [&>span]:opacity-70",
          className,
        )}
        {...props}
      />
    );
  },
);
CustomDayButton.displayName = "CustomDayButton";

/**
 * 日付が選択可能な期間内かどうかを判定する
 */
function isValidDate(date: Date, start?: Date) {
  const minDate = getMinDate();
  const maxDate = getMaxDate();
  return date >= minDate && date <= maxDate && (start ? date >= start : true);
}

export const RangeSelector = ({ type, start, end, setStart, setEnd }: RangeSelectorProps) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  /**
   * 週の範囲選択時の処理関数
   */
  function handleWeekRangeSelect(
    date: { from?: Date; to?: Date } | undefined,
    current: WeekRange,
    setRange: (range: WeekRange) => void,
    close: () => void,
  ) {
    const newWeek = date?.from ? getWeekRange(date.from) : undefined;
    const currentWeek = current?.from ? getWeekRange(current.from) : undefined;

    if (newWeek && currentWeek && newWeek.from < currentWeek.from) {
      setRange(newWeek);
    } else if (date?.to) {
      setRange(getWeekRange(date.to));
    }
    close();
  }

  useEffect(() => {
    if (type === "week") {
      if (start?.from && end?.from && start.from > end.from) {
        setEnd(undefined);
      }
    } else {
      if (start && end && start > end) {
        setEnd(undefined);
      }
    }
  }, [type, start, end, setEnd]);

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-1">
        <Label className="px-1 text-base">開始</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="lg:w-48 justify-between font-normal border-black">
              <span>
                {type === "week"
                  ? start
                    ? `${formatDate(start.from, "/")}週`
                    : "週を選択"
                  : start
                    ? formatDate(start, "/")
                    : "日付を選択"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {type === "week" ? (
              <Calendar
                locale={ja}
                mode="range"
                selected={start}
                defaultMonth={start?.from}
                startMonth={getMinDate()}
                endMonth={getMaxDate()}
                captionLayout="dropdown"
                classNames={{
                  dropdowns:
                    "w-full flex flex-row-reverse items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                  week: "grid grid-cols-7 mt-2",
                }}
                components={{ DayButton: (props) => <CustomDayButton {...props} /> }}
                disabled={(date) => !isValidDate(date)}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, start, setStart, () => setOpenStart(false));
                }}
              />
            ) : (
              <Calendar
                locale={ja}
                mode="single"
                selected={start}
                defaultMonth={start}
                startMonth={getMinDate()}
                endMonth={getMaxDate()}
                captionLayout="dropdown"
                classNames={{
                  dropdowns:
                    "w-full flex flex-row-reverse items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                  week: "grid grid-cols-7 mt-2",
                }}
                components={{ DayButton: (props) => <CustomDayButton {...props} /> }}
                disabled={(date) => !isValidDate(date)}
                onSelect={(date) => {
                  setStart(date);
                  setOpenStart(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-end pb-1 text-xl">〜</div>
      <div className="flex flex-col gap-1">
        <Label className="px-1 text-base">終了</Label>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="lg:w-48 justify-between font-normal border-black"
              disabled={!start}
            >
              <span>
                {type === "week"
                  ? end
                    ? `${formatDate(end.from, "/")}週`
                    : "週を選択"
                  : end
                    ? formatDate(end, "/")
                    : "日付を選択"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {type === "week" ? (
              <Calendar
                locale={ja}
                mode="range"
                selected={end}
                defaultMonth={end?.from}
                startMonth={start?.from ?? getMinDate()}
                endMonth={getMaxDate()}
                captionLayout="dropdown"
                classNames={{
                  dropdowns:
                    "w-full flex flex-row-reverse items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                  week: "grid grid-cols-7 mt-2",
                }}
                components={{ DayButton: (props) => <CustomDayButton {...props} /> }}
                disabled={(date) => !isValidDate(date, start?.from)}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, end, setEnd, () => setOpenEnd(false));
                }}
              />
            ) : (
              <Calendar
                locale={ja}
                mode="single"
                selected={end}
                defaultMonth={end}
                startMonth={start ?? getMinDate()}
                endMonth={getMaxDate()}
                captionLayout="dropdown"
                classNames={{
                  dropdowns:
                    "w-full flex flex-row-reverse items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                  week: "grid grid-cols-7 mt-2",
                }}
                components={{ DayButton: (props) => <CustomDayButton {...props} /> }}
                disabled={(date) => !isValidDate(date, start)}
                onSelect={(date) => {
                  setEnd(date);
                  setOpenEnd(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
