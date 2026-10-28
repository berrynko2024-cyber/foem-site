import { Metadata } from "next";
import { artworks, type Artwork } from "@/lib/mockData";
import { supabase, mapDbArtworkToArtwork } from "@/lib/supabase";
import ShopClient from "./ShopClient";

// 공개 페이지는 ISR 캐시(최대 1시간) — 어드민·결제에서 데이터가 바뀌면 lib/revalidate.ts로 즉시 무효화
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore all original artworks and limited editions curated by FOEM.",
  alternates: {
    canonical: "https://www.foem.co.kr/shop",
  },
};

export default async function ShopPage() {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch artworks from Supabase for shop:", error);
  }

  const initialArtworks =
    data && data.length > 0
      ? (data.map(mapDbArtworkToArtwork) as Artwork[])
      : artworks;

  return <ShopClient initialArtworks={initialArtworks} />;
}
