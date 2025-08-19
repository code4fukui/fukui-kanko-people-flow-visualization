import { useState } from "react";
import { Graph, RangeSelector } from "@fukui-kanko/shared/components/parts";
import { AggregatedData } from "@fukui-kanko/shared/types";
import { cn, getMaxDate } from "@fukui-kanko/shared/utils";

export function RainbowLineChartPanel({
  data,
  className,
}: {
  data: AggregatedData[];
  className?: string;
}) {
  const [graphRange, setGraphRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date("2024-12-20"),
    to: getMaxDate(),
  });
  const dataInRange = data.filter((row) => {
    const aggregatedFrom = new Date(row["aggregate from"]);
    return (
      aggregatedFrom >= (graphRange.from || new Date(0)) &&
      aggregatedFrom < (graphRange.to || new Date())
    );
  });

  return (
    <div
      className={cn(
        "flex flex-col items-center grow w-full h-full max-h-full overflow-hidden",
        className,
      )}
    >
      <RangeSelector
        type={"date"}
        start={graphRange.from}
        end={graphRange.to}
        setStart={(d) => setGraphRange({ ...graphRange, from: d })}
        setEnd={(d) => setGraphRange({ ...graphRange, to: d })}
      ></RangeSelector>

      <div className="flex flex-col gap-y-4 w-full min-w-full grow overflow-auto">
        <Graph
          data={dataInRange}
          type="day"
          xKey="aggregate from"
          yKey="total count"
          className="w-full min-h-[calc(100dvh_-_(32px_+_48px_+_200px_+_16px_+_62px_+_16px))]"
        />
        <Graph
          data={dataInRange}
          type="day"
          xKey="aggregate from"
          yKey="total count"
          className="w-full min-h-[calc(100dvh_-_400px)]"
        />
      </div>
    </div>
  );
}
