import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  attributeKey: string;
  itemKey: string[];
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function AllCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: Props) {
  const handleAllCheckboxChange = (isChecked: boolean) =>
    updateSeriesProperty(
      [
        "exclude",
        isChecked
          ? { ...series.exclude, [attributeKey]: [] } // 全チェックON
          : {
              ...series.exclude,
              [attributeKey]: itemKey,
            }, // 全チェックOFF
      ],
      series,
    );

  return (
    <Checkbox
      onCheckedChange={(v) => notify(handleAllCheckboxChange(!!v))}
      className="block"
      checked={!series.exclude?.[attributeKey]?.length}
    />
  );
}
