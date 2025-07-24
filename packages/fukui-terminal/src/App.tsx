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
import { getData } from "@/lib/data/csv";
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
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getData("Person");
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
            ["aggregate from"]: `${monthKey}`,
            ["aggregate to"]: `${monthKey}`,
            ["total count"]: Number(row["total count"]),
          });
        } else {
          const prev = monthlyMap.get(monthKey)!;
          monthlyMap.set(monthKey, {
            ...prev,
            ["total count"]: Number(prev["total count"]) + Number(row["total count"]),
          });
        }
      });
      setFilteredData(Array.from(monthlyMap.values()));
      return;
    }

    if (theme === "week" && startWeekRange && endWeekRange) {
      // 週の範囲でフィルタ
      filtered = filtered.filter((row) => {
        const date = new Date(row["aggregate from"]);
        return date >= startWeekRange.from && date <= endWeekRange.to;
      });

      const weeklyAggregated: AggregatedData[] = [];
      let i = 0;
      while (i < filtered.length) {
        let weekRows;
        if (i === 0) {
          // 最初の週はstartWeekRange.from〜startWeekRange.toまで
          weekRows = filtered.filter((row) => {
            const d = new Date(row["aggregate from"]);
            return d >= startWeekRange.from && d <= startWeekRange.to;
          });
          i += weekRows.length;
        } else {
          // 以降は7日ごと
          weekRows = filtered.slice(i, i + 7);
          i += 7;
        }
        const formatDate = (date: Date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const total = weekRows.reduce((sum, row) => sum + Number(row["total count"]), 0);
        weeklyAggregated.push({
          ...weekRows[0],
          ["aggregate from"]: `${formatDate(new Date(weekRows[0]["aggregate from"]))}〜`,
          ["aggregate to"]: `${formatDate(new Date(weekRows[weekRows.length - 1]["aggregate from"]))}`,
          ["total count"]: total,
        });
      }
      setFilteredData(weeklyAggregated);
      return;
    }

    if (theme === "day" && startDate && endDate) {
      // 日付の範囲でフィルタ
      filtered = filtered.filter((row) => {
        const date = new Date(row["aggregate from"]);
        return date >= startDate && date <= endDate;
      });

      // 日ごとに集計
      const dailyMap = new Map<string, AggregatedData>();
      filtered.forEach((row) => {
        const date = new Date(row["aggregate from"]);
        const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (!dailyMap.has(dayKey)) {
          const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
          dailyMap.set(dayKey, {
            ...row,
            ["aggregate from"]: `${dayKey}`,
            ["aggregate to"]: `${dayKey}`,
            ["total count"]: Number(row["total count"]),
            dayOfWeek,
          });
        }
      });
      setFilteredData(Array.from(dailyMap.values()));
      return;
    }

    // 他のthemeの場合はそのまま
    setFilteredData(filtered);
  }, [theme, startMonth, endMonth, startWeekRange, endWeekRange, startDate, endDate]);

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
            {(startMonth && endMonth) ||
            (startWeekRange && endWeekRange) ||
            (startDate && endDate) ? (
              <Graph theme={theme} data={filteredData} />
            ) : (
              <p>範囲を選択してください。</p>
            )}
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
