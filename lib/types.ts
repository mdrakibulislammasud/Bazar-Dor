export type Trend = "up" | "down" | "flat";

export interface Category {
  slug: string;
  name: string;
  nameEn?: string;
  icon: string;
}

export interface MarketPrice {
  market: string;
  region: string;
  min: number;
  max: number;
  avg: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  emoji: string;
  unit: string; // e.g. "প্রতি কেজি"
  categorySlug: string;
  categoryName: string;
  price: number;
  changePct: number; // signed
  trend: Trend;
  description: string;
  min: number;
  max: number;
  avg: number;
  markets: MarketPrice[];
}
