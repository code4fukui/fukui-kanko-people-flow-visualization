import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAX_DATE, MIN_DATE } from "@/lib/utils";
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
 * 週の開始日から「YYYY/MM/DD〜」の形式で返す
 */
function formatWeekLabel(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}〜`;
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
                    ? formatWeekLabel(props.start.from)
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
                    ? formatWeekLabel(props.end.from)
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
