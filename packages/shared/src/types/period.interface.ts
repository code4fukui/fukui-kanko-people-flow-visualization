export type Period = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startMonth: Date | undefined;
  endMonth: Date | undefined;
  startWeekRange: { from: Date; to: Date } | undefined;
  endWeekRange: { from: Date; to: Date } | undefined;
};
