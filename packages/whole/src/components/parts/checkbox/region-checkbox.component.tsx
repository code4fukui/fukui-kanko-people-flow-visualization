import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  region: { name: string; prefectures: string[] };
  objectClassAttribute: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function RegionCheckbox({
  region,
  objectClassAttribute,
  series,
  notify,
  updateSeriesProperty,
}: Props) {
  // 地方に属する都道府県が全て表示されているかチェック
  const allChecked = region.prefectures.every(
    (prefectureKey) => !series.exclude?.[objectClassAttribute]?.includes(prefectureKey),
  );

  // 地方に属する都道府県が一つでも表示されているかチェック
  const anyChecked = region.prefectures.some(
    (prefectureKey) => !series.exclude?.[objectClassAttribute]?.includes(prefectureKey),
  );

  // チェックボックスの状態を決定
  const checkState = allChecked ? true : anyChecked ? "indeterminate" : false;

  const handleRegionCheckboxChange = (isChecked: boolean) =>
    updateSeriesProperty(
      [
        "exclude",
        {
          ...series.exclude,
          [objectClassAttribute]: isChecked
            ? (series.exclude?.[objectClassAttribute] ?? []).filter(
                (prefectureKey) => !region.prefectures.includes(prefectureKey),
              )
            : [
                ...(series.exclude?.[objectClassAttribute] ?? []),
                ...region.prefectures.filter(
                  (prefectureKey) =>
                    !series.exclude?.[objectClassAttribute]?.includes(prefectureKey),
                ),
              ],
        },
      ],
      series,
    );

  return (
    <Checkbox
      checked={checkState}
      onCheckedChange={(v) => notify(handleRegionCheckboxChange(!!v))}
    />
  );
}
