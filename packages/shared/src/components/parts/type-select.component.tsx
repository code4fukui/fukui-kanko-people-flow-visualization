import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fukui-kanko/shared/components/ui";
import { GRAPH_VIEW_TYPES } from "@fukui-kanko/shared/types";

type TypeSelectProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  onChange: (newType: keyof typeof GRAPH_VIEW_TYPES) => void;
};

export const TypeSelect = ({ type, onChange }: TypeSelectProps) => (
  <div className="flex flex-row items-center gap-2">
    <p>表示単位</p>
    <Select value={type} onValueChange={(v) => onChange(v as keyof typeof GRAPH_VIEW_TYPES)}>
      <SelectTrigger className="w-[120px] bg-white text-black">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(GRAPH_VIEW_TYPES).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
