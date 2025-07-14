import { GraphSeries } from "@/interfaces/graph-series.interface";
import { useEffect, useState } from "react";
import { getDateTimeString } from "../date";

export const STAR_KEY = "stars";

export function useLocalStars() {
  const [stars, setStars] = useState<{ [title: string]: string }>(
    JSON.parse(localStorage.getItem(STAR_KEY) ?? "{}"),
  );

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem(STAR_KEY) ?? "{}");
    setStars(res);
  }, []);

  const appendStar = (title: string | undefined, seriesAll: { [key: string]: GraphSeries }) => {
    const nextStars = { ...stars };
    nextStars[title === undefined || title === "" ? getDateTimeString(new Date()) : title] =
      JSON.stringify(Object.values(seriesAll));
    window.localStorage.setItem(STAR_KEY, JSON.stringify(nextStars));
    setStars(nextStars);
  };

  const removeStar = (title: string) => {
    const nextStars = { ...stars };
    delete nextStars[title];
    window.localStorage.setItem(STAR_KEY, JSON.stringify(nextStars));
    setStars(nextStars);
  };

  return { stars, appendStar, removeStar };
}
