import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fukui-kanko/shared/components/ui";
import { GRAPH_VIEW_TYPES } from "@fukui-kanko/shared/types";
import { cn } from "../../utils";

type TypeSelectProps = {
  type: keyof typeof GRAPH_VIEW_TYPES;
  onChange: (newType: keyof typeof GRAPH_VIEW_TYPES) => void;
  className?: string;
};

export const TypeSelect = ({ type, onChange, className }: TypeSelectProps) => (
  <div className={cn("flex flex-row items-center gap-2", className)}>
    <p>表示単位</p>
    <Select value={type} onValueChange={(v) => onChange(v as keyof typeof GRAPH_VIEW_TYPES)}>
      <SelectTrigger className="w-[120px] bg-white text-black border-black hover:bg-gray-100 ">
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
