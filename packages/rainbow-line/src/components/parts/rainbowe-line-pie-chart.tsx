import {
  type AggregatedData,
  ATTRIBUTES,
  attributeValueText,
  cn,
  type ObjectClassAttribute,
} from "@fukui-kanko/shared";
import { ChartConfig, ChartContainer } from "@fukui-kanko/shared/components/ui";
import { Cell, Pie, PieChart } from "recharts";

export function RainbowLinePieChart({
  data,
  focusedAttribute,
  className,
}: {
  data: AggregatedData[];
  focusedAttribute: ObjectClassAttribute;
  className?: string;
}) {
  const aggregbatedData = data.map((row) => {
    const list = ATTRIBUTES[focusedAttribute];
    const newData: Record<string, string | number> = {
      "aggregate from": row["aggregate from"],
    };
    Object.keys(list)
      .map((listitem) => ({
        [`${listitem}`]: Object.keys(row)
          .filter((key) => key.startsWith(listitem) || key.endsWith(listitem))
          .map((key) => Number(row[key]))
          .reduce((sum, current) => sum + current, 0),
      }))
      .forEach((item) => {
        newData[Object.keys(item)[0]] = item[Object.keys(item)[0]];
      });
    return {
      ...newData,
    };
  });
  const chartData = aggregbatedData.reduce(
    (acc, row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (key === "aggregate from") return; // Skip the date key
        if (key in acc) {
          acc[key].value += Number(value);
        } else {
          acc[key] = {
            value: Number(value),
          };
        }
      });
      return acc;
    },
    {} as Record<string, { value: number }>,
  );
  const chartConfig: ChartConfig = {};
  Object.keys(chartData).forEach((key) => {
    chartConfig[key] = {
      label: attributeValueText(focusedAttribute, key),
    };
  });

  console.log(chartData, chartConfig);

  return (
    <div
      className={cn(
        "flex flex-col items-center grow w-full h-full max-h-full overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col gap-y-4 w-full min-w-full grow overflow-auto">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-0">
          <PieChart>
            <Pie dataKey="value" data={Object.entries(chartData)}>
              {Object.entries(chartData).map(([k, v]) => (
                <Cell key={k} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
