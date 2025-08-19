import { AggregatedData, GRAPH_VIEW_TYPES, Period } from "@fukui-kanko/shared";
import { cn } from "@fukui-kanko/shared/utils";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";

type DownloadCSVButtonProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  period: Period;
  isCompareMode: boolean;
  filteredData: AggregatedData[];
  filteredDailyData: AggregatedData[];
  className?: string;
  placement: string;
};

function convertToCSV(data: AggregatedData[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => `"${row[h as keyof AggregatedData] ?? ""}"`).join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function DownloadCSVButton({
  type,
  period,
  isCompareMode,
  filteredData,
  filteredDailyData,
  className,
  placement,
}: DownloadCSVButtonProps) {
  const handleDownloadCSV = (data: AggregatedData[]) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${placement}-data.csv`);
  };

  const disabled = !(
    (period.startMonth && period.endMonth) ||
    (period.startWeekRange && period.endWeekRange) ||
    (period.startDate && period.endDate)
  );

  const dataToDownload = type === "hour" ? filteredDailyData : filteredData;

  return (
    <button
      className={cn(
        "h-9 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        className,
      )}
      onClick={() => handleDownloadCSV(dataToDownload)}
      disabled={disabled}
    >
      <span className="flex items-center gap-1">
        <DownloadIcon size={16} />
        {!isCompareMode && <span className="hidden sm:inline">CSV</span>}
      </span>
    </button>
  );
}
