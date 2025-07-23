import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MIN_DATE = new Date(2024, 9, 17);
export const MAX_DATE = new Date();
MAX_DATE.setDate(MAX_DATE.getDate() - 1);
