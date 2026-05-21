import { MetadataRoute } from "next";
import { artists, artworks } from "@/lib/mockData";

const BASE = "https://www.foem.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
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
