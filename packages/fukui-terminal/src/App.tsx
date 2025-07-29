import { Graph } from "@/components/parts/graph";
import { MonthRangePicker } from "@/components/parts/month-range-picker";
import { RangeSelector } from "@/components/parts/range-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AggregatedData } from "@/interfaces/aggregated-data.interface";
import { getRawData } from "@/lib/data/csv";
import { useEffect, useState } from "react";

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
  const [theme, setTheme] = useState<"month" | "week" | "day" | "hour">("month");
  const [csvData, setCsvData] = useState<AggregatedData[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getRawData("Person");
      setCsvData(rawData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = csvData;

    if (theme === "month" && startMonth && endMonth) {
      // 月末を取得
      const end = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
      // 範囲でフィルタ
      filtered = filtered.filter((row) => {
        const date = new Date(row["aggregate from"]);
        return date >= startMonth && date <= end;
      });

      // 月ごとに集計
      const monthlyMap = new Map<string, AggregatedData>();
      filtered.forEach((row) => {
        const date = new Date(row["aggregate from"]);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            ...row,
            aggregateFrom: `${monthKey}`,
            aggregateTo: `${monthKey}`,
            totalCount: Number(row["total count"]),
          });
        } else {
          const prev = monthlyMap.get(monthKey)!;
          monthlyMap.set(monthKey, {
            ...prev,
            totalCount: Number(prev.totalCount) + Number(row["total count"]),
          });
        }
      });
      setFilteredData(Array.from(monthlyMap.values()));
      return;
    }

    // 他のthemeの場合はそのまま
    setFilteredData(filtered);
  }, [theme, startMonth, endMonth]);

  return (
    <>
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-sans">
        <div className="text-center w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">福井駅周辺データ可視化</h1>
          <div className="flex flex-col items-center gap-6 my-8">
            <Select
              value={theme}
              onValueChange={(v) => {
                const newTheme = v as "month" | "week" | "day" | "hour";
                setTheme(newTheme);
                // テーマ変更時に値をリセット
                setStartMonth(undefined);
                setEndMonth(undefined);
                setStartDate(undefined);
                setEndDate(undefined);
                setStartWeekRange(undefined);
                setEndWeekRange(undefined);
              }}
            >
              <SelectTrigger className="w-[180px] bg-white text-black">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">月別</SelectItem>
                <SelectItem value="week">週別</SelectItem>
                <SelectItem value="day">日別</SelectItem>
                <SelectItem value="hour">時間別</SelectItem>
              </SelectContent>
            </Select>
            {theme === "month" && (
              <MonthRangePicker
                startMonth={startMonth}
                endMonth={endMonth}
                onChange={(start, end) => {
                  setStartMonth(start);
                  setEndMonth(end);
                }}
              />
            )}

            {theme === "week" && (
              <RangeSelector
                type="week"
                start={startWeekRange}
                end={endWeekRange}
                setStart={setStartWeekRange}
                setEnd={setEndWeekRange}
              />
            )}

            {(theme === "day" || theme === "hour") && (
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
            {startMonth && endMonth ? (
              <Graph theme={theme} data={filteredData} />
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
