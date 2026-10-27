import { createClient } from "@supabase/supabase-js";
import { type Artwork, type Artist, type Exhibition, type ArtFair } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DB 행 타입 — supabase/schema.sql의 컬럼 정의와 1:1로 맞출 것 (컬럼 추가 시 여기도 같이 추가)
type DbArtworkRow = {
  id: string;
  title: string;
  title_ko: string | null;
  description: string | null;
  description_ko: string | null;
  price: number | string; // NUMERIC은 문자열로 올 수 있음
  currency: Artwork["currency"] | null;
  category: Artwork["category"];
  images: string[] | null;
  artist_id: string;
  artist_name: string;
  stock: number | null;
  is_sold: boolean | null;
  year: number;
  medium: string | null;
  dimensions: string | null;
  orientation: Artwork["orientation"] | null;
  price_display: string | null;
  emotions: string[] | null;
  artist_statement: string | null;
  fill_frame: boolean | null;
  series: string | null;
};

type DbArtistRow = {
  id: string;
  slug: string;
  name: string;
  name_ko: string | null;
  bio: string;
  bio_ko: string;
  photo: string;
  photo_filter: string | null;
  instagram: string | null;
  youtube: string | null;
  statement: string | null;
  statement_ko: string | null;
  artwork_count: number | null;
  works_grid: Artist["worksGrid"] | null;
  works_layout: Artist["worksLayout"] | null;
  medium: string | null;
};

type DbExhibitionRow = {
  id: string;
  title: string;
  title_en: string | null;
  artists: string[] | null;
  venue: string | null;
  location: string;
  start_date: string;
  end_date: string;
  status: Exhibition["status"];
  cover_image: string;
  hero_image: string | null;
  description: string | null;
  description_ko: string | null;
  video_url: string | null;
  orientation: Exhibition["orientation"] | null;
  photos: Exhibition["photos"] | null;
};

type DbArtFairRow = {
  id: string;
  name: string;
  venue: string;
  location: string;
  booth_number: string | null;
  artists: string[] | null;
  preview_date: string | null;
  start_date: string;
  end_date: string;
  status: ArtFair["status"];
  cover_image: string;
  description: string | null;
  artwork_ids: string[] | null;
};

// Database snake_case 필드를 프론트엔드 camelCase Artwork 타입으로 변환하는 매핑 헬퍼
export function mapDbArtworkToArtwork(dbArt: DbArtworkRow | null): Artwork {
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

export function mapDbArtistToArtist(dbArtist: DbArtistRow): Artist {
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

export function mapDbExhibitionToExhibition(dbEx: DbExhibitionRow): Exhibition {
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

export function mapDbArtFairToArtFair(dbFair: DbArtFairRow): ArtFair {
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
