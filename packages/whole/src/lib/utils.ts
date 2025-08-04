import { ObjectClassAttribute } from "@/interfaces/aggregated-data.interface";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * グラフを表示するためのデータ項目数がこの値を超えた場合のみグラフを表示する。
 */
export const CARTESIAN_RENDER_THRESHOLD = 3;

/**
 * スクロール位置が下部に近づいたらアイコンを非表示にするための閾値。
 */
export const SCROLL_BOTTOM_THRESHOLD = 20;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PartiallyRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

// https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/digest#%E3%83%80%E3%82%A4%E3%82%B8%E3%82%A7%E3%82%B9%E3%83%88%E5%80%A4%E3%82%92_16_%E9%80%B2%E6%96%87%E5%AD%97%E5%88%97%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B
export async function digest(value: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(value); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // バイト列を 16 進文字列に変換する
  return hashHex;
}

export function linkPath(path: string) {
  return location.host.endsWith("github.io")
    ? `/${location.pathname.slice(1).split("/").at(0)}/whole/${path.at(0) === "/" ? path.slice(1) : path}`
    : path;
}

export function isKeyMatchingAttribute(
  attributeType: ObjectClassAttribute | string,
  value: string,
  key: string,
): boolean {
  switch (attributeType) {
    case "genders":
    case "prefectures":
      // 先頭で始まる属性のチェック
      return new RegExp(`^${value} `).test(key);

    case "ageRanges":
    case "carCategories":
      // 末尾で終わる属性のチェック
      return new RegExp(` ${value}$`).test(key);

    default:
      return false;
  }
}
