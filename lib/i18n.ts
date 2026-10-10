export type Lang = "bn" | "en";
export const LANG_COOKIE = "lang";

export const EN_CATEGORIES: Record<string, string> = {
  চাল: "Rice", ডাল: "Pulses", তেল: "Oil", সবজি: "Vegetables", মাছ: "Fish",
  মাংস: "Meat", "ডিম-দুধ": "Eggs & Milk", মসলা: "Spices",
};

export const EN_PRODUCTS: Record<string, string> = {
  "স্বর্ণমাছি চাল": "Swarnamachhi Rice", "মিনিকেট চাল": "Miniket Rice", "নাজির চাল": "Nazir Rice",
  "বাটাম সাইজ চাল": "Batam Size Rice", "মসুর ডাল": "Masoor Dal (Red Lentil)", "মুগ ডাল": "Mung Dal",
  ছোলা: "Chickpea (Chhola)", "আমন ডাল (খোসাসিলা)": "Aman Dal (Unhulled)", "সরিষার তেল": "Mustard Oil",
  "পাম তেল": "Palm Oil", "ঘানি ভাঙা সরিষার তেল": "Cold-pressed Mustard Oil", আলু: "Potato",
  পেঁয়াজ: "Onion", কাঁচামরিচ: "Green Chili", বেগুন: "Eggplant", ঢেঁড়স: "Okra",
  "রুই মাছ": "Rui Fish", তেলাপিয়া: "Tilapia", "ইলিশ মাছ": "Hilsa Fish", "কাতলা মাছ": "Catla Fish",
  "চিংড়ি মাছ (খোলা)": "Shrimp (Peeled)", "মুরগির মাংস": "Chicken", "গরুর মাংস": "Beef",
  "খাসির মাংস": "Mutton", "হাঁসের মাংস": "Duck Meat", ডিম: "Eggs", দুধ: "Milk", দই: "Yogurt",
  "মাখন (১০০ গ্রাম)": "Butter (100 g)", আদা: "Ginger", রসুন: "Garlic", "মরিচ গুঁড়া": "Chili Powder",
  "ধনেপাতা গুঁড়া": "Coriander Powder",
};

const EN_UNIT_WORDS: Record<string, string> = { কেজি: "kg", লিটার: "litre", ডজন: "dozen", পিস: "piece", গ্রাম: "g" };

export function catLabel(name: string, lang: Lang) {
  return lang === "en" ? EN_CATEGORIES[name] ?? name : name;
}
export function productLabel(p: { name: string; nameEn?: string }, lang: Lang) {
  return lang === "en" ? p.nameEn || EN_PRODUCTS[p.name] || p.name : p.name;
}
/** "প্রতি কেজি" -> "per kg" (en) */
export function unitLabel(unit: string, lang: Lang) {
  if (lang === "bn") return unit;
  return `per ${unitShort(unit, lang)}`;
}
/** "প্রতি কেজি" -> "কেজি" / "kg" */
export function unitShort(unit: string, lang: Lang) {
  const w = unit.replace(/^প্রতি\s*/, "").trim();
  return lang === "en" ? EN_UNIT_WORDS[w] ?? w : w;
}

const EN_PLACES: Record<string, string> = {
  ঢাকা: "Dhaka", চট্টগ্রাম: "Chattogram", রাজশাহী: "Rajshahi", খুলনা: "Khulna", সিলেট: "Sylhet",
  বরিশাল: "Barishal", রংপুর: "Rangpur", ময়মনসিংহ: "Mymensingh",
  "মাঠ বাজার": "Math Bazar", "সদর বাজার": "Sadar Bazar", বাজারহাট: "Bazarhat", "বাসারহাট বাজার": "Basarhat Bazar",
  "চৌর বাজার": "Chour Bazar", "আমতলী বাজার": "Amtali Bazar", "ডবলগেট বাজার": "Double Gate Bazar",
  "চৌরাস্তা বাজার": "Chourasta Bazar", "গ্রীন মার্কেট, মিরপুর": "Green Market, Mirpur",
  "চৌদগ্রাম বাজার": "Chauddagram Bazar", আমবাজার: "Am Bazar", "কারওয়ান বাজার": "Karwan Bazar",
};
export function placeLabel(name: string, lang: Lang) {
  return lang === "en" ? EN_PLACES[name] ?? name : name;
}
