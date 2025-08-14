type AverageBarProps = {
  color: string;
  label: string;
  value: number;
  max: number;
  valueColor: string;
};

export const AverageBar: React.FC<AverageBarProps> = ({ color, label, value, max, valueColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{
            width: `${(value / max) * 100}%`,
          }}
        ></div>
      </div>
      <p className={`text-sm min-w-[70px] text-right ${valueColor}`}>{value.toLocaleString()}回</p>
    </div>
  </div>
);
