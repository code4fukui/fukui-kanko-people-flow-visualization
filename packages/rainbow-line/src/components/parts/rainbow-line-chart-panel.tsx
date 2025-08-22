import { useEffect, useState } from "react";
import { RangeSelector } from "@fukui-kanko/shared/components/parts";
import { ChartConfig, ChartContainer } from "@fukui-kanko/shared/components/ui";
import { AggregatedData } from "@fukui-kanko/shared/types";
import { cn, getMaxDate } from "@fukui-kanko/shared/utils";
import { CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";

export function RainbowLineChartPanel({
  data,
  className,
}: {
  data: AggregatedData[];
  className?: string;
}) {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    "total count": {
      label: "ナンバープレート検出回数",
    },
  });

  const [graphRange, setGraphRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date("2024-12-20"),
    to: getMaxDate(),
  });
  const [dataInRange, setDataInRange] = useState<AggregatedData[]>([]);

  useEffect(
    () =>
      setDataInRange(
        data.filter((row) => {
          const aggregatedFrom = new Date(row["aggregate from"]);
          return (
            aggregatedFrom >= (graphRange.from || new Date(0)) &&
            aggregatedFrom < (graphRange.to || new Date())
          );
        }),
      ),
    [data, graphRange],
  );

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
        <ChartContainer config={chartConfig}>
          <ComposedChart>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="aggregate from"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              tick={{ fontSize: 12 }}
              height={50}
              interval={0}
              tickCount={dataInRange.length > 10 ? 10 : dataInRange.length}
            />
            <YAxis dataKey={"total count"} tickLine={true} allowDecimals={false} />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
}
