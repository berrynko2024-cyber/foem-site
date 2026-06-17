import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the independent artists behind FOEM — painters, photographers, and craft artists from Korea and beyond.",
  keywords: ["FOEM artists", "Korean artists", "contemporary artists", "painter", "photographer", "아티스트", "작가"],
  openGraph: {
    title: "Artists — FOEM",
    description: "Meet the independent artists behind FOEM.",
    url: "https://www.foem.co.kr/artists",
  },
  alternates: {
    canonical: "https://www.foem.co.kr/artists",
  },
};

export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
