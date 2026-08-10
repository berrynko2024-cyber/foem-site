import { createClient } from "@supabase/supabase-js";
import { type Artwork } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database snake_case 필드를 프론트엔드 camelCase Artwork 타입으로 변환하는 매핑 헬퍼
export function mapDbArtworkToArtwork(dbArt: any): Artwork {
  if (!dbArt) return {} as Artwork;
  return {
    id: dbArt.id,
    title: dbArt.title,
    title_ko: dbArt.title_ko || "",
    description: dbArt.description || "",
    description_ko: dbArt.description_ko || "",
    price: Number(dbArt.price),
    currency: dbArt.currency || "KRW",
    category: dbArt.category,
    images: dbArt.images || [],
    artistId: dbArt.artist_id,
    artistName: dbArt.artist_name,
    stock: dbArt.stock ?? 1,
    isSold: dbArt.is_sold ?? false,
    year: dbArt.year,
    medium: dbArt.medium || undefined,
    dimensions: dbArt.dimensions || undefined,
    orientation: dbArt.orientation || "portrait",
    priceDisplay: dbArt.price_display || undefined,
    emotions: dbArt.emotions || [],
    artistStatement: dbArt.artist_statement || undefined,
    fillFrame: dbArt.fill_frame ?? undefined,
    series: dbArt.series || undefined,
  };
}
