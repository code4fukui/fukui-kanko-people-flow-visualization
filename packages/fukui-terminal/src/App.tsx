import { Graph } from "@/components/parts/graph";
import { LoadingSpinner } from "@/components/parts/loading-spinner";
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
import {
  aggregateDaily,
  aggregateHourly,
  aggregateMonthly,
  aggregateWeekly,
} from "@/lib/aggregation";
import { getDailyData, getData } from "@/lib/data/csv";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    // bodyとhtmlのマージン・パディングをリセット
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
  }, []);

  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom right, #dbeafe, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box" as const,
  };

  const contentStyle = {
    textAlign: "center" as const,
    padding: "2rem",
    maxWidth: "1600px", // 追加: コンテンツの最大幅を広げる
    width: "70%", // 追加: 幅いっぱいに広げる
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    transition: "background-color 0.2s",
    border: "none",
    cursor: "pointer",
  };

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
  const [csvDailyData, setCsvDailyData] = useState<AggregatedData[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filteredDailyData, setFilteredDailyData] = useState<AggregatedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function getStats(data: AggregatedData[]) {
    if (!data || data.length === 0) return { sum: 0, avg: 0 };
    const sum = data.reduce((acc, cur) => acc + Number(cur["total count"] ?? 0), 0);
    const avg = sum / data.length;
    return { sum, avg };
  }

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getData("Person");
      setCsvData(rawData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (theme !== "hour") {
      setIsLoading(false);
      return;
    }
    let isCurrent = true;
    const fetchData = async () => {
      if (startDate && endDate) {
        setIsLoading(true);
        const rawData = await getDailyData("Person", startDate, endDate);
        if (isCurrent) {
          setCsvDailyData(rawData);
          setIsLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      isCurrent = false;
    };
  }, [theme, startDate, endDate]);

  useEffect(() => {
    const filtered = csvData;
    const filteredDaily = csvDailyData;

    if (theme === "month" && startMonth && endMonth) {
      // 月末を取得
      const end = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
      setFilteredData(aggregateMonthly(csvData, startMonth, end));
      return;
    }

    if (theme === "week" && startWeekRange && endWeekRange) {
      setFilteredData(aggregateWeekly(csvData, startWeekRange, endWeekRange));
      return;
    }

    if (theme === "day" && startDate && endDate) {
      setFilteredData(aggregateDaily(csvData, startDate, endDate));
      return;
    }

    if (theme === "hour" && startDate && endDate) {
      setFilteredDailyData(aggregateHourly(filteredDaily));
      return;
    }

    // 他のthemeの場合はそのまま
    setFilteredData(filtered);
    setFilteredDailyData(filteredDaily);
  }, [
    theme,
    startMonth,
    endMonth,
    startWeekRange,
    endWeekRange,
    startDate,
    endDate,
    csvData,
    csvDailyData,
  ]);

  return (
    <>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>福井駅周辺データ可視化</h1>
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
          <div style={{ margin: "2rem 0" }}>
            {isLoading && theme === "hour" ? (
              <LoadingSpinner />
            ) : (startMonth && endMonth) ||
              (startWeekRange && endWeekRange) ||
              (startDate && endDate) ? (
              <Graph theme={theme} data={theme === "hour" ? filteredDailyData : filteredData} />
            ) : (
              <p>範囲を選択してください。</p>
            )}
          </div>
          <div style={{ margin: "1rem 0", fontSize: "1.1rem", color: "#374151" }}>
            {(theme === "hour" ? filteredDailyData : filteredData).length > 0 &&
              (() => {
                const stats = getStats(theme === "hour" ? filteredDailyData : filteredData);
                return (
                  <div>
                    <div>合計人数: {Math.round(stats.sum).toLocaleString()} 人</div>
                    <div>平均人数: {Math.round(stats.avg).toLocaleString()} 人</div>
                  </div>
                );
              })()}
          </div>
          <a
            href={homeUrl}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
