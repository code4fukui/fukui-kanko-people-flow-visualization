import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type WeekRange = { from: Date; to: Date } | undefined;

type Props =
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

const MIN_DATE = new Date(2024, 9, 17);
const MAX_DATE = new Date();
MAX_DATE.setDate(MAX_DATE.getDate() - 1);

function isOutOfRange(date: Date) {
  return date < MIN_DATE || date > MAX_DATE;
}

/**
 * 週の範囲選択時の処理関数
 */
function handleWeekRangeSelect(
  date: { from?: Date; to?: Date } | undefined,
  current: WeekRange,
  setRange: (range: WeekRange) => void,
  close: () => void,
) {
  if (date?.from && current?.from && date.from < current.from) {
    setRange(getWeekRange(date.from));
  } else if (date?.to) {
    setRange(getWeekRange(date.to));
  }
  close();
}

/**
 * 日付を "YYYY/MM/DD" 形式で返す
 */
function formatDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * 週の開始日から「YYYY年M月第N週」の形式で返す
 */
function formatWeekLabel(date: Date, mode: "start" | "end" = "start") {
  const weekBaseDate = new Date(date);
  // 基準を水曜日に設定
  if (mode === "start") {
    weekBaseDate.setDate(weekBaseDate.getDate() + 3);
  } else {
    weekBaseDate.setDate(weekBaseDate.getDate() - 3);
  }
  const year = weekBaseDate.getFullYear();
  const month = weekBaseDate.getMonth() + 1;
  const firstDay = new Date(year, weekBaseDate.getMonth(), 1);
  const firstDayWeekDay = firstDay.getDay();
  const weekNumber = Math.floor((weekBaseDate.getDate() + firstDayWeekDay - 1) / 7) + 1;
  return `${year}年${month}月第${weekNumber}週`;
}

function getWeekRange(date: Date) {
  const startDay = new Date(date);
  startDay.setDate(date.getDate() - startDay.getDay());
  const endDay = new Date(startDay);
  endDay.setDate(startDay.getDate() + 6);
  return { from: startDay, to: endDay };
}

/**
 * 終了日が開始日より前の日付を選択できないようにする
 */
function isBeforeStart(start: Date | undefined) {
  return start ? (date: Date) => date < start : undefined;
}

export const RangeSelector = (props: Props) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  useEffect(() => {
    if (props.type === "week") {
      if (props.start?.from && props.end?.from && props.start.from > props.end.from) {
        props.setEnd(undefined);
      }
    } else {
      if (props.start && props.end && props.start > props.end) {
        props.setEnd(undefined);
      }
    }
  }, [props.start]);

  return (
    <div className="flex flex-row gap-6 mb-6">
      <div className="flex flex-col gap-3">
        <Label className="px-1">開始</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {props.type === "week"
                  ? props.start
                    ? formatWeekLabel(props.start.from, "start")
                    : "Select week"
                  : props.start
                    ? formatDate(props.start)
                    : "Select date"}
              </span>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {props.type === "week" ? (
              <Calendar
                mode="range"
                selected={props.start}
                captionLayout="dropdown"
                disabled={isOutOfRange}
                onSelect={(date) => {
                  handleWeekRangeSelect(date, props.start, props.setStart, () =>
                    setOpenStart(false),
                  );
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={props.start}
                captionLayout="dropdown"
                onSelect={(date) => {
                  props.setStart(date);
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
              disabled={!props.start}
            >
              <span>
                {props.type === "week"
                  ? props.end
                    ? formatWeekLabel(props.end.to, "end")
                    : "Select week"
                  : props.end
                    ? formatDate(props.end)
                    : "Select date"}
              </span>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {props.type === "week" ? (
              <Calendar
                mode="range"
                selected={props.end}
                captionLayout="dropdown"
                disabled={(date) =>
                  isOutOfRange(date) || (props.start?.from ? date < props.start.from : false)
                }
                onSelect={(date) => {
                  handleWeekRangeSelect(date, props.end, props.setEnd, () => setOpenEnd(false));
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={props.end}
                captionLayout="dropdown"
                disabled={isBeforeStart(props.start)}
                onSelect={(date) => {
                  props.setEnd(date);
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
