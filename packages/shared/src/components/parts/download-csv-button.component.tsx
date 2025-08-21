import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared";
import { Button } from "@fukui-kanko/shared/components/ui";
import { cn } from "@fukui-kanko/shared/utils";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";

type DownloadCSVButtonProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  period: Period;
  isCompareMode: boolean;
  data: AggregatedData[];
  className?: string;
  placement: string;
};

function convertToCSV(data: AggregatedData[], viewType: keyof typeof GRAPH_VIEW_TYPES): string {
  const isDailyOrHourly = viewType === "day" || viewType === "hour";

  const dailyHeaders: readonly (keyof AggregatedData)[] = [
    "aggregateFrom",
    "totalCount",
    "dayOfWeek",
    "holidayName",
  ];
  const periodHeaders: readonly (keyof AggregatedData)[] = [
    "aggregateFrom",
    "totalCount",
    "weekdayTotal",
    "weekendTotal",
  ];

  const headers = isDailyOrHourly ? dailyHeaders : periodHeaders;
  if (data.length === 0) return headers.join(",") + "\n";
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const value = row[h];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function DownloadCSVButton({
  type,
  period,
  isCompareMode,
  data,
  className,
  placement,
}: DownloadCSVButtonProps) {
  const handleDownloadCSV = (data: AggregatedData[]) => {
    const csv = convertToCSV(data, type);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    saveAs(blob, `${placement}-data-${dateStr}.csv`);
  };

  const hasSelectedRange =
    (period.startMonth && period.endMonth) ||
    (period.startWeekRange && period.endWeekRange) ||
    (period.startDate && period.endDate);
  const hasData = Array.isArray(data) && data.length > 0;

  const disabled = !(hasSelectedRange && hasData);

  return (
    <Button
      className={cn(
        "h-9 px-3  text-black rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        className,
      )}
      variant="outline"
      onClick={() => handleDownloadCSV(data)}
      disabled={disabled}
    >
      <span className="flex items-center gap-1">
        <DownloadIcon size={16} />
        {!isCompareMode && <span className="hidden sm:inline">CSV</span>}
      </span>
    </Button>
  );
}
