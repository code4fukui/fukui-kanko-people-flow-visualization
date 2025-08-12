import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fukui-kanko/shared/components/ui";

type TypeSelectProps = {
  type: "month" | "week" | "day" | "hour";
  onChange: (newType: "month" | "week" | "day" | "hour") => void;
};

export const TypeSelect = ({ type, onChange }: TypeSelectProps) => (
  <div className="flex flex-row items-center gap-2">
    <p>表示単位</p>
    <Select value={type} onValueChange={(v) => onChange(v as "month" | "week" | "day" | "hour")}>
      <SelectTrigger className="w-[120px] bg-white text-black">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">月別</SelectItem>
        <SelectItem value="week">週別</SelectItem>
        <SelectItem value="day">日別</SelectItem>
        <SelectItem value="hour">時間別</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
