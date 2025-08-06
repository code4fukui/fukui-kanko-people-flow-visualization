import { Graph } from "@/components/parts/graph";
import { useEffect, useState } from "react";
import { AggregatedData, formatDate, getRawData, TOTAL_COUNT_KEY } from "@fukui-kanko/shared";
import { MonthRangePicker, RangeSelector, TypeSelect } from "@fukui-kanko/shared/components/parts";
import * as holidayJP from "@holiday-jp/holiday_jp";

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
            totalCount: Number(row[TOTAL_COUNT_KEY]),
          });
        } else {
          const prev = monthlyMap.get(monthKey)!;
          monthlyMap.set(monthKey, {
            ...prev,
            totalCount: Number(prev.totalCount) + Number(row[TOTAL_COUNT_KEY]),
          });
        }
      });
      setFilteredData(Array.from(monthlyMap.values()));
      return;
    }

    if (type === "week" && startWeekRange && endWeekRange) {
      // 週の範囲でフィルタ
      filtered = filtered.filter((row) => {
        const date = new Date(row["aggregate from"]);
        return date >= startWeekRange.from && date <= endWeekRange.to;
      });

      const weeklyAggregated: AggregatedData[] = [];
      let i = 0;
      let isFirstWeek = true;
      while (i < filtered.length) {
        let weekRows: AggregatedData[] = [];
        if (isFirstWeek) {
          // 最初の週だけ他の週と範囲が異なる場合があるためfilterで抽出(例：2024/10/17からの週)
          weekRows = filtered.filter((row) => {
            const d = new Date(row["aggregate from"]);
            return d >= startWeekRange.from && d <= startWeekRange.to;
          });
          // 件数分インデックスを進める
          i += weekRows.length;
          isFirstWeek = false;
        } else {
          // 以降は7日ごと
          weekRows = filtered.slice(i, i + 7);
          i += 7;
        }
        const total = weekRows.reduce((sum, row) => sum + Number(row[TOTAL_COUNT_KEY]), 0);
        weeklyAggregated.push({
          ...weekRows[0],
          aggregateFrom: `${formatDate(new Date(weekRows[0]["aggregate from"]), "-")}〜`,
          aggregateTo: `${formatDate(new Date(weekRows[weekRows.length - 1]["aggregate from"]), "-")}`,
          totalCount: total,
        });
      }
      setFilteredData(weeklyAggregated);
      return;
    }
    if (type === "day" && startDate && endDate) {
      // 日付の範囲でフィルタ
      filtered = filtered.filter((row) => {
        const date = new Date(row["aggregate from"]);
        return date >= startDate && date <= endDate;
      });

      // 日ごとに集計
      const dailyMap = new Map<string, AggregatedData>();
      filtered.forEach((row) => {
        const date = new Date(row["aggregate from"]);
        const dayKey = `${formatDate(date, "-")}`;
        if (!dailyMap.has(dayKey)) {
          const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
          const holiday = holidayJP.isHoliday(date);
          let holidayName: string = "";
          if (holiday) {
            // 祝日一覧から該当日を検索
            holidayName = holidayJP.between(date, date)[0].name;
          }
          dailyMap.set(dayKey, {
            ...row,
            aggregateFrom: `${dayKey}`,
            aggregateTo: `${dayKey}`,
            totalCount: Number(row[TOTAL_COUNT_KEY]),
            dayOfWeek,
            holidayName,
          });
        }
      });
      setFilteredData(Array.from(dailyMap.values()));
      return;
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
