export const aRegions = [
  "北海道",
  "東北",
  "北関東",
  "南関東",
  "東海",
  "北陸",
  "近畿",
  "中国",
  "四国",
  "九州",
  "沖縄",
] as const;
export type ARegion = (typeof aRegions)[number];

export const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "秋田県",
  "宮城県",
  "山形県",
  "福島県",
  "新潟県",
  "茨城県",
  "栃木県",
  "群馬県",
  "山梨県",
  "長野県",
  "千葉県",
  "埼玉県",
  "東京都",
  "神奈川県",
  "愛知県",
  "静岡県",
  "岐阜県",
  "三重県",
  "富山県",
  "石川県",
  "福井県",
  "大阪府",
  "京都府",
  "奈良県",
  "滋賀県",
  "和歌山県",
  "兵庫県",
  "広島県",
  "鳥取県",
  "島根県",
  "岡山県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;
export type Prefecture = (typeof prefectures)[number];

export const licensePlateRegions: { region: string; prefecture: Prefecture; aRegion: ARegion }[] = [
  { region: "札幌", prefecture: "北海道", aRegion: "北海道" },
  { region: "函館", prefecture: "北海道", aRegion: "北海道" },
  { region: "旭川", prefecture: "北海道", aRegion: "北海道" },
  { region: "室蘭", prefecture: "北海道", aRegion: "北海道" },
  { region: "苫小牧", prefecture: "北海道", aRegion: "北海道" },
  { region: "北見", prefecture: "北海道", aRegion: "北海道" },
  { region: "釧路", prefecture: "北海道", aRegion: "北海道" },
  { region: "知床", prefecture: "北海道", aRegion: "北海道" },
  { region: "帯広", prefecture: "北海道", aRegion: "北海道" },
  { region: "青森", prefecture: "青森県", aRegion: "東北" },
  { region: "弘前", prefecture: "青森県", aRegion: "東北" },
  { region: "八戸", prefecture: "青森県", aRegion: "東北" },
  { region: "岩手", prefecture: "岩手県", aRegion: "東北" },
  { region: "盛岡", prefecture: "岩手県", aRegion: "東北" },
  { region: "平泉", prefecture: "岩手県", aRegion: "東北" },
  { region: "宮城", prefecture: "宮城県", aRegion: "東北" },
  { region: "仙台", prefecture: "宮城県", aRegion: "東北" },
  { region: "秋田", prefecture: "秋田県", aRegion: "東北" },
  { region: "山形", prefecture: "山形県", aRegion: "東北" },
  { region: "庄内", prefecture: "山形県", aRegion: "東北" },
  { region: "福島", prefecture: "福島県", aRegion: "東北" },
  { region: "会津", prefecture: "福島県", aRegion: "東北" },
  { region: "郡山", prefecture: "福島県", aRegion: "東北" },
  { region: "白河", prefecture: "福島県", aRegion: "東北" },
  { region: "いわき", prefecture: "福島県", aRegion: "東北" },
  { region: "新潟", prefecture: "新潟県", aRegion: "東北" },
  { region: "長岡", prefecture: "新潟県", aRegion: "東北" },
  { region: "上越", prefecture: "新潟県", aRegion: "東北" },
  { region: "水戸", prefecture: "茨城県", aRegion: "北関東" },
  { region: "土浦", prefecture: "茨城県", aRegion: "北関東" },
  { region: "つくば", prefecture: "茨城県", aRegion: "北関東" },
  { region: "宇都宮", prefecture: "栃木県", aRegion: "北関東" },
  { region: "那須", prefecture: "栃木県", aRegion: "北関東" },
  { region: "とちぎ", prefecture: "栃木県", aRegion: "北関東" },
  { region: "群馬", prefecture: "群馬県", aRegion: "北関東" },
  { region: "高崎", prefecture: "群馬県", aRegion: "北関東" },
  { region: "前橋", prefecture: "群馬県", aRegion: "北関東" },
  { region: "山梨", prefecture: "山梨県", aRegion: "北関東" },
  { region: "長野", prefecture: "長野県", aRegion: "北関東" },
  { region: "松本", prefecture: "長野県", aRegion: "北関東" },
  { region: "諏訪", prefecture: "長野県", aRegion: "北関東" },
  { region: "千葉", prefecture: "千葉県", aRegion: "南関東" },
  { region: "成田", prefecture: "千葉県", aRegion: "南関東" },
  { region: "野田", prefecture: "千葉県", aRegion: "南関東" },
  { region: "柏", prefecture: "千葉県", aRegion: "南関東" },
  { region: "松戸", prefecture: "千葉県", aRegion: "南関東" },
  { region: "習志野", prefecture: "千葉県", aRegion: "南関東" },
  { region: "船橋", prefecture: "千葉県", aRegion: "南関東" },
  { region: "市川", prefecture: "千葉県", aRegion: "南関東" },
  { region: "袖ヶ浦", prefecture: "千葉県", aRegion: "南関東" },
  { region: "市原", prefecture: "千葉県", aRegion: "南関東" },
  { region: "大宮", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "川口", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "熊谷", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "春日部", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "越谷", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "所沢", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "川越", prefecture: "埼玉県", aRegion: "南関東" },
  { region: "品川", prefecture: "東京都", aRegion: "南関東" },
  { region: "世田谷", prefecture: "東京都", aRegion: "南関東" },
  { region: "足立", prefecture: "東京都", aRegion: "南関東" },
  { region: "江東", prefecture: "東京都", aRegion: "南関東" },
  { region: "葛飾", prefecture: "東京都", aRegion: "南関東" },
  { region: "練馬", prefecture: "東京都", aRegion: "南関東" },
  { region: "杉並", prefecture: "東京都", aRegion: "南関東" },
  { region: "板橋", prefecture: "東京都", aRegion: "南関東" },
  { region: "多摩", prefecture: "東京都", aRegion: "南関東" },
  { region: "八王子", prefecture: "東京都", aRegion: "南関東" },
  { region: "横浜", prefecture: "神奈川県", aRegion: "南関東" },
  { region: "川崎", prefecture: "神奈川県", aRegion: "南関東" },
  { region: "相模", prefecture: "神奈川県", aRegion: "南関東" },
  { region: "湘南", prefecture: "神奈川県", aRegion: "南関東" },
  { region: "名古屋", prefecture: "愛知県", aRegion: "東海" },
  { region: "三河", prefecture: "愛知県", aRegion: "東海" },
  { region: "岡崎", prefecture: "愛知県", aRegion: "東海" },
  { region: "豊田", prefecture: "愛知県", aRegion: "東海" },
  { region: "尾張小牧", prefecture: "愛知県", aRegion: "東海" },
  { region: "一宮", prefecture: "愛知県", aRegion: "東海" },
  { region: "春日井", prefecture: "愛知県", aRegion: "東海" },
  { region: "豊橋", prefecture: "愛知県", aRegion: "東海" },
  { region: "静岡", prefecture: "静岡県", aRegion: "東海" },
  { region: "沼津", prefecture: "静岡県", aRegion: "東海" },
  { region: "伊豆", prefecture: "静岡県", aRegion: "東海" },
  { region: "富士山", prefecture: "静岡県", aRegion: "東海" },
  { region: "浜松", prefecture: "静岡県", aRegion: "東海" },
  { region: "岐阜", prefecture: "岐阜県", aRegion: "東海" },
  { region: "飛騨", prefecture: "岐阜県", aRegion: "東海" },
  { region: "三重", prefecture: "三重県", aRegion: "東海" },
  { region: "鈴鹿", prefecture: "三重県", aRegion: "東海" },
  { region: "四日市", prefecture: "三重県", aRegion: "東海" },
  { region: "伊勢志摩", prefecture: "三重県", aRegion: "東海" },
  { region: "富山", prefecture: "富山県", aRegion: "北陸" },
  { region: "石川", prefecture: "石川県", aRegion: "北陸" },
  { region: "金沢", prefecture: "石川県", aRegion: "北陸" },
  { region: "福井", prefecture: "福井県", aRegion: "北陸" },
  { region: "大阪", prefecture: "大阪府", aRegion: "近畿" },
  { region: "なにわ", prefecture: "大阪府", aRegion: "近畿" },
  { region: "和泉", prefecture: "大阪府", aRegion: "近畿" },
  { region: "堺", prefecture: "大阪府", aRegion: "近畿" },
  { region: "京都", prefecture: "京都府", aRegion: "近畿" },
  { region: "奈良", prefecture: "奈良県", aRegion: "近畿" },
  { region: "飛鳥", prefecture: "奈良県", aRegion: "近畿" },
  { region: "滋賀", prefecture: "滋賀県", aRegion: "近畿" },
  { region: "和歌山", prefecture: "和歌山県", aRegion: "近畿" },
  { region: "神戸", prefecture: "兵庫県", aRegion: "近畿" },
  { region: "姫路", prefecture: "兵庫県", aRegion: "近畿" },
  { region: "広島", prefecture: "広島県", aRegion: "中国" },
  { region: "福山", prefecture: "広島県", aRegion: "中国" },
  { region: "鳥取", prefecture: "鳥取県", aRegion: "中国" },
  { region: "島根", prefecture: "島根県", aRegion: "中国" },
  { region: "出雲", prefecture: "島根県", aRegion: "中国" },
  { region: "岡山", prefecture: "岡山県", aRegion: "中国" },
  { region: "倉敷", prefecture: "岡山県", aRegion: "中国" },
  { region: "山口", prefecture: "山口県", aRegion: "中国" },
  { region: "下関", prefecture: "山口県", aRegion: "中国" },
  { region: "徳島", prefecture: "徳島県", aRegion: "四国" },
  { region: "香川", prefecture: "香川県", aRegion: "四国" },
  { region: "高松", prefecture: "香川県", aRegion: "四国" },
  { region: "愛媛", prefecture: "愛媛県", aRegion: "四国" },
  { region: "高知", prefecture: "高知県", aRegion: "四国" },
  { region: "福岡", prefecture: "福岡県", aRegion: "九州" },
  { region: "北九州", prefecture: "福岡県", aRegion: "九州" },
  { region: "筑豊", prefecture: "福岡県", aRegion: "九州" },
  { region: "久留米", prefecture: "福岡県", aRegion: "九州" },
  { region: "佐賀", prefecture: "佐賀県", aRegion: "九州" },
  { region: "長崎", prefecture: "長崎県", aRegion: "九州" },
  { region: "佐世保", prefecture: "長崎県", aRegion: "九州" },
  { region: "熊本", prefecture: "熊本県", aRegion: "九州" },
  { region: "大分", prefecture: "大分県", aRegion: "九州" },
  { region: "宮崎", prefecture: "宮崎県", aRegion: "九州" },
  { region: "鹿児島", prefecture: "鹿児島県", aRegion: "九州" },
  { region: "奄美", prefecture: "鹿児島県", aRegion: "九州" },
  { region: "沖縄", prefecture: "沖縄県", aRegion: "沖縄" },
] as const;
export const prefFromRegion = (region: string): Prefecture | "不明" => {
  if (licensePlateRegions.map((v) => v.region).includes(region)) {
    return licensePlateRegions.find((v) => v.region === region)?.prefecture ?? "不明";
  } else return "不明";
};
export const aRegionFromRegion = (region: string): ARegion | "不明" => {
  if (licensePlateRegions.map((v) => v.region).includes(region)) {
    return licensePlateRegions.find((v) => v.region === region)?.aRegion ?? "不明";
  } else return "不明";
};
