import { Metadata } from "next";
import { buildSeoMetadata, ARTISTS_SEO } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({ ...ARTISTS_SEO, path: "/artists" });

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
