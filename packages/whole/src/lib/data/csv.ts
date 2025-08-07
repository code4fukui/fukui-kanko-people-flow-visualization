import { GraphSeries } from "@/interfaces/graph-series.interface";
import { isKeyMatchingAttribute } from "@/lib/utils";
import {
  AggregatedData,
  KEYOF_AGGREGATED_DATA_BASE,
  ObjectClass,
  Placement,
  PREFECTURES,
} from "@fukui-kanko/shared";
import Papa from "papaparse";
import { isDateIncludedInRange } from "../date";

const getUrlPrefix = () => `${location.origin}${location.pathname}`;

async function getRawData(
  placement: Placement,
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const csvResponse = await fetch(getUrlPrefix() + `${placement}/${objectClass}.csv`);
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}

function removeColumnFromRawData(
  rawData: AggregatedData[],
  exclude: Record<string, string[]>,
): AggregatedData[] {
  /** 作業用配列 */
  const work = [...rawData];

  const result = work.map((row) => {
    const workRow = { ...row };
    for (const /** `first second` の形になる */ key in workRow) {
      // 基本データの列は何もしない
      if ((KEYOF_AGGREGATED_DATA_BASE as string[]).includes(key)) continue;
      const isKeyMatchesExclude = Object.entries(exclude).some(
        ([category, excludedValues]) =>
          excludedValues.some((value) => isKeyMatchingAttribute(category, value, key)),
      );
      if (isKeyMatchesExclude) delete workRow[key];
    }

    // フィルタ後のデータで合計を計算して更新する
    workRow["total count"] = Object.entries(workRow)
      .filter(([key]) => !(KEYOF_AGGREGATED_DATA_BASE as string[]).includes(key))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .reduce((sum, [_, current]) => (sum += Number(current)), 0);
    return workRow;
  });

  return result;
}

function reorderDataColumns(data: AggregatedData[]): AggregatedData[] {
  return data.map(row => {
    const reorderedRow: Record<string, string | number> = {};

    // まず基本項目をコピー
    KEYOF_AGGREGATED_DATA_BASE.forEach(key => {
      reorderedRow[key] = row[key];
    });

    // 都道府県データをPREFECTURESの順序で追加
    Object.keys(PREFECTURES).forEach(prefecture => {
      Object.entries(row).forEach(([key, value]) => {
        if (isKeyMatchingAttribute('prefectures', prefecture, key)) {
          reorderedRow[key] = value;
        }
      });
    });

    return reorderedRow as AggregatedData;
  });
}

export async function getData(
  placement: Placement,
  objectClass: ObjectClass,
  date: { from: Date; to: Date },
  exclude?: GraphSeries["exclude"],
): Promise<AggregatedData[]> {
  const rawData = await getRawData(placement, objectClass);

  let filteredData = [...rawData].filter((rawDataRow) =>
    isDateIncludedInRange(new Date(rawDataRow["aggregate from"]), date),
  );

  // 都道府県の順番をPREFECTURESに従って並べ替える
  if (objectClass === 'LicensePlate') {
    filteredData = reorderDataColumns(filteredData);
  }

  if (exclude) filteredData = removeColumnFromRawData(filteredData, exclude);
  return filteredData;
}
