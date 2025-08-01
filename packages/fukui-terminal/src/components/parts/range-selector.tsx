import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAX_DATE, MIN_DATE } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CalendarIcon } from "@primer/octicons-react";

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

function isOutOfRange(date: Date) {
  return date < MIN_DATE || date > MAX_DATE;
}

/**
 * 日付を "YYYY/MM/DD" 形式で返す
 */
function formatDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function getWeekRange(date: Date) {
  let startDay = new Date(date);
  let endDay: Date;

  startDay.setDate(date.getDate() - startDay.getDay());
  if (startDay < MIN_DATE) {
    startDay = new Date(MIN_DATE);
  }

  if (startDay.getTime() === MIN_DATE.getTime()) {
    endDay = new Date(2024, 9, 19);
  } else {
    endDay = new Date(startDay);
    endDay.setDate(startDay.getDate() + 6);
    // 最新データ日を超えないようにする
    if (endDay > MAX_DATE) {
      endDay = new Date(MAX_DATE);
    }
  }
  return { from: startDay, to: endDay };
}

/**
 * 終了日が開始日より前の日付を選択できないようにする
 */
function isBeforeStart(start: Date | undefined) {
  return start ? (date: Date) => date < start : undefined;
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
    <div className="flex flex-row gap-6 mb-6">
      <div className="flex flex-col gap-3">
        <Label className="px-1">開始</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {type === "week"
                  ? start
                    ? `${formatDate(start.from)}〜`
                    : "Select week"
                  : start
                    ? formatDate(start)
                    : "Select date"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {type === "week" ? (
              <Calendar
                mode="range"
                selected={start}
                captionLayout="dropdown"
                disabled={isOutOfRange}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, start, setStart, () => setOpenStart(false));
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={start}
                captionLayout="dropdown"
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
      <div className="flex flex-col gap-3">
        <Label className="px-1">終了</Label>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal"
              disabled={!start}
            >
              <span>
                {type === "week"
                  ? end
                    ? `${formatDate(end.from)}〜`
                    : "Select week"
                  : end
                    ? formatDate(end)
                    : "Select date"}
              </span>
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {type === "week" ? (
              <Calendar
                mode="range"
                selected={end}
                captionLayout="dropdown"
                disabled={(date) => isOutOfRange(date) || (start?.from ? date < start.from : false)}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, end, setEnd, () => setOpenEnd(false));
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={end}
                captionLayout="dropdown"
                disabled={isBeforeStart(start)}
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
