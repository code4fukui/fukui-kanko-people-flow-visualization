import { AllCheckbox } from "@/components/parts/checkbox/all-checkbox.component";
import { FilterCheckbox } from "@/components/parts/checkbox/filter-checkbox.component";
import { RegionCheckbox } from "@/components/parts/checkbox/region-checkbox.component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraphSeries } from "@/interfaces/graph-series.interface";
import { REGIONS_PREFECTURES } from "@fukui-kanko/shared";

interface Props {
  objectClassAttribute: string;
  allPrefectureKeys: string[];
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
  attributeValues: Record<string, string>;
}

export function PrefectureFilter({
  objectClassAttribute,
  allPrefectureKeys,
  series,
  notify,
  updateSeriesProperty,
  attributeValues,
}: Props) {
  return (
    <>
      {/* 全選択 */}
      <div className="flex">
        <label className="flex flex-row items-center gap-x-2">
          <AllCheckbox
            attributeKey={objectClassAttribute}
            itemKey={allPrefectureKeys}
            series={series}
            notify={notify}
            updateSeriesProperty={updateSeriesProperty}
          />
          <span>全選択</span>
        </label>
      </div>
      <Accordion type="multiple">
        {Object.entries(REGIONS_PREFECTURES).map(([regionKey, region]) => {
          return (
            // 地方
            <AccordionItem value={regionKey} key={regionKey} className="border-none">
              <div className="flex">
                <label className="flex flex-row items-center">
                  <RegionCheckbox
                    region={region}
                    objectClassAttribute={objectClassAttribute}
                    series={series}
                    notify={notify}
                    updateSeriesProperty={updateSeriesProperty}
                  />
                  <span className="pl-2 pr-1">{region.name}</span>
                  <AccordionTrigger className="text-base py-0"></AccordionTrigger>
                </label>
              </div>
              {/* その地方に属した都道府県 */}
              <AccordionContent className="text-base pb-2">
                {region.prefectures.map((prefectureKey) => (
                  <div key={prefectureKey} className="flex">
                    <label className="flex flex-row items-center gap-x-2 ml-5 mt-0">
                      <FilterCheckbox
                        attributeKey={objectClassAttribute}
                        itemKey={prefectureKey}
                        series={series}
                        notify={notify}
                        updateSeriesProperty={updateSeriesProperty}
                      />
                      <span>{attributeValues[prefectureKey]}</span>
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {/* その他 */}
      <div className="flex">
        <label className="flex flex-row items-center gap-x-2">
          <FilterCheckbox
            attributeKey={objectClassAttribute}
            itemKey={"Other"}
            series={series}
            notify={notify}
            updateSeriesProperty={updateSeriesProperty}
          />
          <span>{attributeValues["Other"]}</span>
        </label>
      </div>
    </>
  );
}
