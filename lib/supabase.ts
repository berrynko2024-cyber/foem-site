import { createClient } from "@supabase/supabase-js";
import { type Artwork, type Artist, type Exhibition, type ArtFair } from "./mockData";

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

export function mapDbArtistToArtist(dbArtist: any): Artist {
  return {
    id: dbArtist.id,
    slug: dbArtist.slug,
    name: dbArtist.name,
    name_ko: dbArtist.name_ko || undefined,
    bio: dbArtist.bio,
    bio_ko: dbArtist.bio_ko,
    photo: dbArtist.photo,
    photoFilter: dbArtist.photo_filter || undefined,
    instagram: dbArtist.instagram || undefined,
    youtube: dbArtist.youtube || undefined,
    statement: dbArtist.statement || undefined,
    statement_ko: dbArtist.statement_ko || undefined,
    artworkCount: dbArtist.artwork_count ?? 0,
    worksGrid: dbArtist.works_grid || undefined,
    worksLayout: dbArtist.works_layout || undefined,
    medium: dbArtist.medium || undefined,
  };
}

export function mapDbExhibitionToExhibition(dbEx: any): Exhibition {
  return {
    id: dbEx.id,
    title: dbEx.title,
    titleEn: dbEx.title_en || undefined,
    artists: dbEx.artists || [],
    venue: dbEx.venue || undefined,
    location: dbEx.location,
    startDate: dbEx.start_date,
    endDate: dbEx.end_date,
    status: dbEx.status,
    coverImage: dbEx.cover_image,
    heroImage: dbEx.hero_image || undefined,
    description: dbEx.description || undefined,
    descriptionKo: dbEx.description_ko || undefined,
    videoUrl: dbEx.video_url || undefined,
    orientation: dbEx.orientation || undefined,
    photos: dbEx.photos && dbEx.photos.length > 0 ? dbEx.photos : undefined,
  };
}

export function mapDbArtFairToArtFair(dbFair: any): ArtFair {
  return {
    id: dbFair.id,
    name: dbFair.name,
    venue: dbFair.venue,
    location: dbFair.location,
    boothNumber: dbFair.booth_number || undefined,
    artists: dbFair.artists || [],
    previewDate: dbFair.preview_date || undefined,
    startDate: dbFair.start_date,
    endDate: dbFair.end_date,
    status: dbFair.status,
    coverImage: dbFair.cover_image,
    description: dbFair.description || undefined,
    artworkIds: dbFair.artwork_ids || undefined,
  };
}
