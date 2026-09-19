import { Metadata } from "next";
import { artworks, type Artwork } from "@/lib/mockData";
import { supabase, mapDbArtworkToArtwork } from "@/lib/supabase";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — FOEM",
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
