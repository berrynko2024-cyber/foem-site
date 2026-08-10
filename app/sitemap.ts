import { MetadataRoute } from "next";
import { artists as mockArtists, artworks as mockArtworks } from "@/lib/mockData";
import { supabase, mapDbArtistToArtist, mapDbArtworkToArtwork } from "@/lib/supabase";

const BASE = "https://www.foem.co.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: dbArtists }, { data: dbArtworks }] = await Promise.all([
    supabase.from("artists").select("*"),
    supabase.from("artworks").select("*"),
  ]);

  const mappedDbArtists = dbArtists ? dbArtists.map(mapDbArtistToArtist) : [];
  const artists = mappedDbArtists.length > 0 ? mappedDbArtists : mockArtists;

  const mappedDbArtworks = dbArtworks ? dbArtworks.map(mapDbArtworkToArtwork) : [];
  const artworks = mappedDbArtworks.length > 0 ? mappedDbArtworks : mockArtworks;

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/shop`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/artists`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/art-fair`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/exhibitions`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/video`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/consulting`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "yearly" },
  ];

  const artworkPages: MetadataRoute.Sitemap = artworks
    .filter((a) => a.images[0]?.startsWith("/artworks/"))
    .map((a) => ({
      url: `${BASE}/shop/${a.id}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    }));

  const artistPages: MetadataRoute.Sitemap = artists.map((a) => ({
    url: `${BASE}/artists/${a.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...artworkPages, ...artistPages];
}
