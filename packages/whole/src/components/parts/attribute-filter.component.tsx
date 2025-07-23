import { AllCheckbox } from "@/components/parts/checkbox/all-checkbox.component";
import { FilterCheckbox } from "@/components/parts/checkbox/filter-checkbox.component";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  objectClassAttribute: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
  attributeValues: Record<string, string>;
}

export function AttributeFilter({
  objectClassAttribute,
  series,
  notify,
  updateSeriesProperty,
  attributeValues,
}: Props) {
  return (
    <>
      <div className="flex">
        <label className="flex flex-row items-center gap-x-2">
          <AllCheckbox
            attributeKey={objectClassAttribute}
            itemKey={Object.keys(attributeValues)}
            series={series}
            notify={notify}
            updateSeriesProperty={updateSeriesProperty}
          />
          <span>全選択</span>
        </label>
      </div>
      {Object.entries(attributeValues).map(([attributeValue, attributeValueText]) => (
        <div key={attributeValue} className="flex">
          <label className="flex flex-row items-center gap-x-2">
            <FilterCheckbox
              attributeKey={objectClassAttribute}
              itemKey={attributeValue}
              series={series}
              notify={notify}
              updateSeriesProperty={updateSeriesProperty}
            />
            <span>{attributeValueText}</span>
          </label>
        </div>
      ))}
    </>
  );
}
