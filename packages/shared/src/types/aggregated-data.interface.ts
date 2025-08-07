import { Placement } from "./placement.interface";

export const OBJECT_CLASS = {
  Person: "人物",
  Face: "顔",
  LicensePlate: "ナンバープレート",
} as const;
export type ObjectClass = keyof typeof OBJECT_CLASS;

export const TOTAL_COUNT_KEY = "total count";
export type AggregatedDataBase = {
  placement: Placement;
  "object class": ObjectClass;
  "aggregate from": string;
  "aggregate to": string;
  [TOTAL_COUNT_KEY]: number;
};
export const KEYOF_AGGREGATED_DATA_BASE: (keyof AggregatedDataBase)[] = [
  "placement",
  "object class",
  "aggregate from",
  "aggregate to",
  "total count",
] as const;
export type AggregatedData = AggregatedDataBase & Record<string, string | number>;

export const OBJECT_CLASS_ATTRIBUTES = {
  Face: {
    genders: {
      male: "男性",
      female: "女性",
      other: "その他",
    } as const,
    ageRanges: {
      range00to05: "0から5歳",
      range06to12: "6から12歳",
      range13to17: "13から17歳",
      range18to24: "18から24歳",
      range25to34: "25から34歳",
      range35to44: "35から44歳",
      range45to54: "45から54歳",
      range55to64: "55から64歳",
      range65over: "65歳以上",
    } as const,
  } as const,
  LicensePlate: {
    prefectures: {
      Hokkaido: "北海道",
      Aomori: "青森県",
      Iwate: "岩手県",
      Miyagi: "宮城県",
      Akita: "秋田県",
      Yamagata: "山形県",
      Fukushima: "福島県",
      Ibaraki: "茨城県",
      Tochigi: "栃木県",
      Gunma: "群馬県",
      Yamanashi: "山梨県",
      Nagano: "長野県",
      Saitama: "埼玉県",
      Chiba: "千葉県",
      Tokyo: "東京都",
      Kanagawa: "神奈川県",
      Shizuoka: "静岡県",
      Gifu: "岐阜県",
      Aichi: "愛知県",
      Mie: "三重県",
      Niigata: "新潟県",
      Toyama: "富山県",
      Ishikawa: "石川県",
      Fukui: "福井県",
      Shiga: "滋賀県",
      Kyoto: "京都府",
      Nara: "奈良県",
      Wakayama: "和歌山県",
      Osaka: "大阪府",
      Hyogo: "兵庫県",
      Tottori: "鳥取県",
      Shimane: "島根県",
      Okayama: "岡山県",
      Hiroshima: "広島県",
      Yamaguchi: "山口県",
      Tokushima: "徳島県",
      Kagawa: "香川県",
      Ehime: "愛媛県",
      Kochi: "高知県",
      Fukuoka: "福岡県",
      Saga: "佐賀県",
      Nagasaki: "長崎県",
      Oita: "大分県",
      Kumamoto: "熊本県",
      Miyazaki: "宮崎県",
      Kagoshima: "鹿児島県",
      Okinawa: "沖縄県",
      Other: "その他",
    } as const,
    carCategories: {
      PassengerCars: "自家用車",
      CommercialVehicle: "事業用車",
      RentACar: "レンタカー",
      Other: "その他",
    } as const,
  } as const,
} as const;

export type ObjectClassAttribute =
  | keyof (typeof OBJECT_CLASS_ATTRIBUTES)["Face"]
  | keyof (typeof OBJECT_CLASS_ATTRIBUTES)["LicensePlate"];
export const GENDERS = OBJECT_CLASS_ATTRIBUTES.Face.genders;
export const AGE_RANGES = OBJECT_CLASS_ATTRIBUTES.Face.ageRanges;
export const PREFECTURES = OBJECT_CLASS_ATTRIBUTES.LicensePlate.prefectures;
export const CAR_CATEGORIES = OBJECT_CLASS_ATTRIBUTES.LicensePlate.carCategories;
export const JAPANESE_ATTRIBUTE_NAME: Record<ObjectClassAttribute, string> = {
  genders: "性別",
  ageRanges: "年齢",
  prefectures: "都道府県",
  carCategories: "車両分類",
} as const;
export const REGIONS_PREFECTURES: Record<
  string,
  { name: string; prefectures: (keyof typeof PREFECTURES)[] }
> = {
  HokkaidoTohokuRegion: {
    name: "北海道・東北地方",
    prefectures: ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  },
  KantoRegion: {
    name: "関東地方",
    prefectures: [
      "Ibaraki",
      "Tochigi",
      "Gunma",
      "Yamanashi",
      "Nagano",
      "Saitama",
      "Chiba",
      "Tokyo",
      "Kanagawa",
    ],
  },
  TokaiRegion: {
    name: "東海地方",
    prefectures: ["Shizuoka", "Gifu", "Aichi", "Mie"],
  },
  HokurikuRegion: {
    name: "北陸地方",
    prefectures: ["Niigata", "Toyama", "Ishikawa", "Fukui"],
  },
  KinkiRegion: {
    name: "近畿地方",
    prefectures: ["Shiga", "Kyoto", "Nara", "Wakayama", "Osaka", "Hyogo"],
  },
  ChugokuRegion: {
    name: "中国地方",
    prefectures: ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
  },
  ShikokuRegion: {
    name: "四国地方",
    prefectures: ["Tokushima", "Kagawa", "Ehime", "Kochi"],
  },
  KyushuOkinawaRegion: {
    name: "九州・沖縄地方",
    prefectures: [
      "Fukuoka",
      "Saga",
      "Nagasaki",
      "Oita",
      "Kumamoto",
      "Miyazaki",
      "Kagoshima",
      "Okinawa",
    ],
  },
};

type AttributeValue<Attribute extends ObjectClassAttribute> = Attribute extends "genders"
  ? keyof (typeof OBJECT_CLASS_ATTRIBUTES)["Face"][Attribute]
  : Attribute extends "ageRanges"
    ? keyof (typeof OBJECT_CLASS_ATTRIBUTES)["Face"][Attribute]
    : Attribute extends "prefectures"
      ? keyof (typeof OBJECT_CLASS_ATTRIBUTES)["LicensePlate"][Attribute]
      : Attribute extends "carCategories"
        ? keyof (typeof OBJECT_CLASS_ATTRIBUTES)["LicensePlate"][Attribute]
        : never;

export const ATTRIBUTES = {
  ageRanges: AGE_RANGES,
  genders: GENDERS,
  prefectures: PREFECTURES,
  carCategories: CAR_CATEGORIES,
} as const;

function isValueOf<Attribute extends ObjectClassAttribute>(
  attribute: Attribute,
  value: string,
): value is AttributeValue<Attribute> {
  if (attribute === "genders" || attribute === "ageRanges") {
    return Object.keys(
      OBJECT_CLASS_ATTRIBUTES["Face"][attribute as "genders" | "ageRanges"],
    ).includes(value);
  } else if (attribute === "prefectures" || attribute === "carCategories") {
    return Object.keys(
      OBJECT_CLASS_ATTRIBUTES["LicensePlate"][attribute as "prefectures" | "carCategories"],
    ).includes(value);
  } else {
    return false;
  }
}

export function attributeValueText(
  objectClassAttribute: ObjectClassAttribute,
  attributeValue: string,
): string {
  if (objectClassAttribute === "genders" && isValueOf(objectClassAttribute, attributeValue))
    return OBJECT_CLASS_ATTRIBUTES["Face"][objectClassAttribute][attributeValue];
  if (objectClassAttribute === "ageRanges" && isValueOf(objectClassAttribute, attributeValue))
    return OBJECT_CLASS_ATTRIBUTES["Face"][objectClassAttribute][attributeValue];
  if (objectClassAttribute === "prefectures" && isValueOf(objectClassAttribute, attributeValue))
    return OBJECT_CLASS_ATTRIBUTES["LicensePlate"][objectClassAttribute][attributeValue];
  if (objectClassAttribute === "carCategories" && isValueOf(objectClassAttribute, attributeValue))
    return OBJECT_CLASS_ATTRIBUTES["LicensePlate"][objectClassAttribute][attributeValue];
  return "";
}
