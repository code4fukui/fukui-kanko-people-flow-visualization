import Papa from "papaparse";
import { AggregatedData, AggregatedRange, DateNumbers, ObjectClass, Placement } from "../types";

/**
 * 環境変数に応じてviteのdefineで設定されるCSVのベースURL
 *
 * vite.config.tsで設定される`__CSV_ORIGIN__`を参照する。
 * ローカルと開発者用確認環境、Pages環境で異なる値になる。
 */
declare const __CSV_ORIGIN__: string;

type getRawDataProps<T extends AggregatedRange> = T extends "full"
  ? {
      placement: Placement;
      objectClass: ObjectClass;
      aggregateRange: T;
      kind?: "people-flow-data";
    }
  : {
      placement: Placement;
      objectClass: ObjectClass;
      aggregateRange: T;
      kind?: "people-flow-data";
      date: Date | DateNumbers<T>;
    };

/**
 * 集計範囲、設置場所、オブジェクトクラス、日付に基づいて生CSVデータを取得する関数
 *
 * @template T - 集約範囲の型（"full"、"monthly"、"daily"、またはその他のサポートされた範囲）。
 * @param {getRawDataProps<T>} params - データ取得のパラメータ:
 *   - placement: データを要求する場所やエリア。
 *   - objectClass: カウントされるオブジェクトのクラス（例: "person"）。
 *   - aggregateRange: 集約範囲（"full"、"monthly"、"daily"など）。
 *   - kind: （オプション）データの種類、デフォルトは "people-flow-data"。
 *   - date: （"full"以外の範囲では必須）データの日付または日付コンポーネント。
 * @returns {Promise<AggregatedData[]>} 解析されたデータオブジェクトの配列に解決されるPromise。
 * @throws {Error} 以下の場合にエラーをスローします:
 *   - ネットワークリクエストが失敗した場合（URL到達不可、サーバーエラーなど）。
 *   - CSVが取得できない場合、またはCSVの解析が失敗した場合。
 *   - 不正な形式のCSVデータまたは予期しない形式の場合。
 */
export async function getRawData<T extends AggregatedRange>(params: getRawDataProps<T>) {
  const { placement, objectClass, aggregateRange, kind = "people-flow-data" } = params;
  let url = `${__CSV_ORIGIN__}${kind}/${aggregateRange}/${placement}/${objectClass}`;

  if (aggregateRange === "full") {
    url += ".csv";
  } else if (aggregateRange === "monthly") {
    const { year, month } =
      params.date instanceof Date
        ? {
            year: params.date.getFullYear().toString(),
            month: (params.date.getMonth() + 1).toString().padStart(2, "0"),
          }
        : params.date;
    url += `/${year}/${year}-${month}.csv`;
  } else if (aggregateRange === "daily") {
    const { year, month, day } =
      params.date instanceof Date
        ? {
            year: params.date.getFullYear().toString(),
            month: (params.date.getMonth() + 1).toString().padStart(2, "0"),
            day: params.date.getDate().toString().padStart(2, "0"),
          }
        : params.date;
    url += `/${year}/${month}/${year}-${month}-${day}.csv`;
  } else {
    const { year, month, day, hour } =
      params.date instanceof Date
        ? {
            year: params.date.getFullYear().toString(),
            month: (params.date.getMonth() + 1).toString().padStart(2, "0"),
            day: params.date.getDate().toString().padStart(2, "0"),
            hour: params.date.getHours().toString().padStart(2, "0"),
          }
        : params.date;
    url += `/${year}/${month}/${day}/${year}-${month}-${day}-${hour}.csv`;
  }

  const csvResponse = await fetch(url);
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}
