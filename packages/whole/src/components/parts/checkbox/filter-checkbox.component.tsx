import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  attributeKey: string;
  itemKey: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function FilterCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: Props) {
  const handleFilterCheckboxChange = (isChecked: boolean) =>
    updateSeriesProperty(
      [
        "exclude",
        series.exclude !== undefined
          ? isChecked
            ? // truthyなら表示する→excludeからは外す
              {
                ...series.exclude,
                [attributeKey]: [
                  ...series.exclude[attributeKey].filter((excludeItem) => excludeItem !== itemKey),
                ],
              }
            : // falsyなら表示しない→excludeに含める
              {
                ...series.exclude,
                [attributeKey]: [...(series.exclude[attributeKey] ?? []), itemKey],
              }
          : isChecked
            ? undefined
            : { [attributeKey]: [itemKey] },
      ],
      series,
    );

  return (
    <Checkbox
      onCheckedChange={(v) => notify(handleFilterCheckboxChange(!!v))}
      className="block"
      checked={!series.exclude?.[attributeKey]?.includes(itemKey)}
    />
  );
}
