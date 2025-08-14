import { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@fukui-kanko/shared/components/ui";
import { CalendarIcon } from "@primer/octicons-react";
import { FIRST_WEEK_END_DATE, formatDate, getMaxDate, getMinDate } from "../../utils/utils";

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

function getWeekRange(date: Date) {
  const minDate = getMinDate();
  const maxDate = getMaxDate();
  let startDay = new Date(date);
  let endDay: Date;

  startDay.setDate(date.getDate() - startDay.getDay());
  if (startDay < minDate) {
    startDay = new Date(minDate);
  }

  if (startDay.getTime() === minDate.getTime()) {
    // データのある最初の週は7日周期にできないため、特別に終了日を設定
    endDay = new Date(FIRST_WEEK_END_DATE);
  } else {
    endDay = new Date(startDay);
    endDay.setDate(startDay.getDate() + 6);
    // 最新データ日を超えないようにする
    if (endDay > maxDate) {
      endDay = new Date(maxDate);
    }
  }
  return { from: startDay, to: endDay };
}

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
    <div className="flex flex-row gap-6 mb-6">
      <div className="flex flex-col gap-3">
        <Label className="px-1">開始</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {type === "week"
                  ? start
                    ? `${formatDate(start.from, "/")}〜`
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
                mode="range"
                selected={start}
                defaultMonth={start?.from}
                captionLayout="dropdown"
                disabled={(date) => !isValidDate(date)}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, start, setStart, () => setOpenStart(false));
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={start}
                defaultMonth={start}
                captionLayout="dropdown"
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
                    ? `${formatDate(end.from, "/")}〜`
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
                mode="range"
                selected={end}
                defaultMonth={end?.from}
                captionLayout="dropdown"
                disabled={(date) => !isValidDate(date, start?.from)}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, end, setEnd, () => setOpenEnd(false));
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={end}
                defaultMonth={end}
                captionLayout="dropdown"
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
