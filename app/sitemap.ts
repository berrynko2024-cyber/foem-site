import { MetadataRoute } from "next";
import {
  artists as mockArtists,
  artworks as mockArtworks,
  artFairs as mockArtFairs,
  exhibitions as mockExhibitions,
} from "@/lib/mockData";
import {
  supabase,
  mapDbArtistToArtist,
  mapDbArtworkToArtwork,
  mapDbArtFairToArtFair,
  mapDbExhibitionToExhibition,
} from "@/lib/supabase";
import { artFairPath } from "@/lib/artFairStatus";
import { artworkPath } from "@/lib/artworkPath";

const BASE = "https://www.foem.co.kr";

// 사이트맵은 기본적으로 빌드 시점에 고정된다. 어드민에서 작품을 추가해도 재배포 없이 1시간 안에 반영되도록 주기적으로 다시 만든다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: dbArtists }, { data: dbArtworks }, { data: dbArtFairs }, { data: dbExhibitions }] =
    await Promise.all([
      supabase.from("artists").select("*"),
      supabase.from("artworks").select("*"),
      supabase.from("art_fairs").select("*"),
      supabase.from("exhibitions").select("*"),
    ]);

  const mappedDbArtFairs = dbArtFairs ? dbArtFairs.map(mapDbArtFairToArtFair) : [];
  const artFairs = mappedDbArtFairs.length > 0 ? mappedDbArtFairs : mockArtFairs;

  const mappedDbExhibitions = dbExhibitions ? dbExhibitions.map(mapDbExhibitionToExhibition) : [];
  const exhibitions = mappedDbExhibitions.length > 0 ? mappedDbExhibitions : mockExhibitions;

  const mappedDbArtists = dbArtists ? dbArtists.map(mapDbArtistToArtist) : [];
  const artists = mappedDbArtists.length > 0 ? mappedDbArtists : mockArtists;

  const mappedDbArtworks = dbArtworks ? dbArtworks.map(mapDbArtworkToArtwork) : [];
  const artworks = mappedDbArtworks.length > 0 ? mappedDbArtworks : mockArtworks;

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/shop`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/artists`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/art-fair`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/exhibitions`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/video`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/consulting`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/about`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    { url: `${BASE}/join`, lastModified: now, priority: 0.5, changeFrequency: "monthly" },
  ];

  const toAbsoluteUrl = (pathOrUrl?: string) => {
    if (!pathOrUrl) return undefined;
    if (pathOrUrl.startsWith("http")) return pathOrUrl;
    return `${BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  };

  // 이미지가 있는 작품은 로컬(/artworks/)이든 Supabase Storage든 모두 포함
  const artworkPages: MetadataRoute.Sitemap = artworks
    .filter((a) => a.images[0])
    .map((a) => {
      const img = toAbsoluteUrl(a.images[0]);
      return {
        url: `${BASE}${artworkPath(a)}`,
        lastModified: now,
        priority: 0.8,
        changeFrequency: "monthly" as const,
        images: img ? [img] : undefined,
      };
    });

  const artistPages: MetadataRoute.Sitemap = artists.map((a) => {
    const photo = toAbsoluteUrl(a.photo);
    return {
      url: `${BASE}/artists/${a.slug}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      images: photo ? [photo] : undefined,
    };
  });

  const artFairPages: MetadataRoute.Sitemap = artFairs.map((f) => {
    const cover = toAbsoluteUrl(f.coverImage);
    return {
      url: `${BASE}${artFairPath(f)}`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      images: cover ? [cover] : undefined,
    };
  });

  const exhibitionPages: MetadataRoute.Sitemap = exhibitions.map((e) => {
    const cover = toAbsoluteUrl(e.coverImage);
    return {
      url: `${BASE}/exhibitions/${e.id}`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: "monthly" as const,
      images: cover ? [cover] : undefined,
    };
  });

  return [...staticPages, ...artworkPages, ...artistPages, ...artFairPages, ...exhibitionPages];
}
