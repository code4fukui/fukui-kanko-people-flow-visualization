import { Placement, PLACEMENTS } from "@fukui-kanko/shared";

export const RAINBOW_LINE_LOTS: Record<
  Exclude<Placement, "fukui-station-east-entrance" | "tojinbo-shotaro">,
  string
> = Object.entries(PLACEMENTS)
  .filter(([k]) => k.includes("rainbow-line"))
  .reduce(
    (result, [k]) => {
      result[k] = `${k} total count`;
      return result;
    },
    {} as Record<string, string>,
  );
