import { useEffect, useState } from "react";
import { AggregatedData, getRawData } from "@fukui-kanko/shared";
import {
  Graph,
  MonthRangePicker,
  RangeSelector,
  TypeSelect,
} from "@fukui-kanko/shared/components/parts";
import { aggregateDaily, aggregateMonthly, aggregateWeekly } from "@fukui-kanko/shared/utils";

function App() {
  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);
  const [startWeekRange, setStartWeekRange] = useState<{ from: Date; to: Date } | undefined>(
    undefined,
  );
  const [endWeekRange, setEndWeekRange] = useState<{ from: Date; to: Date } | undefined>(undefined);
  const [type, setType] = useState<"month" | "week" | "day" | "hour">("month");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getRawData({
          objectClass: "Person",
          placement: "fukui-station-east-entrance",
          aggregateRange: "full",
        });
        setCsvData(rawData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("データの取得に失敗しました:", error);
        setCsvData([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = csvData;

    if (type === "month" && startMonth && endMonth) {
      // 月末を取得
      const end = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
      filtered = aggregateMonthly(filtered, startMonth, end);
    }

    if (type === "week" && startWeekRange && endWeekRange) {
      filtered = aggregateWeekly(filtered, startWeekRange, endWeekRange);
    }
    if (type === "day" && startDate && endDate) {
      filtered = aggregateDaily(filtered, startDate, endDate);
    }

    // TODO:他の期間の処理を実装する
    setFilteredData(filtered);
  }, [type, startMonth, endMonth, startWeekRange, endWeekRange, startDate, endDate, csvData]);

  return (
    <>
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-sans">
        <div className="text-center w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">福井駅周辺データ可視化</h1>
          <div className="flex flex-col items-center gap-6 my-8">
            <TypeSelect
              type={type}
              onChange={(newType) => {
                setType(newType);
                // タイプ変更時に値をリセット
                setStartMonth(undefined);
                setEndMonth(undefined);
                setStartDate(undefined);
                setEndDate(undefined);
                setStartWeekRange(undefined);
                setEndWeekRange(undefined);
              }}
            />
            {type === "month" && (
              <MonthRangePicker
                startMonth={startMonth}
                endMonth={endMonth}
                onChange={(start, end) => {
                  setStartMonth(start);
                  setEndMonth(end);
                }}
              />
            )}

            {type === "week" && (
              <RangeSelector
                type="week"
                start={startWeekRange}
                end={endWeekRange}
                setStart={setStartWeekRange}
                setEnd={setEndWeekRange}
              />
            )}

            {(type === "day" || type === "hour") && (
              <RangeSelector
                type="date"
                start={startDate}
                end={endDate}
                setStart={setStartDate}
                setEnd={setEndDate}
              />
            )}
          </div>
          <div className="my-8">
            {(startMonth && endMonth) ||
            (startWeekRange && endWeekRange) ||
            (startDate && endDate) ? (
              <Graph type={type} data={filteredData} />
            ) : (
              <p>範囲を選択してください。</p>
            )}
          </div>
          <a
            href={homeUrl}
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-md transition-colors cursor-pointer"
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
