import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse and purchase original artworks — paintings, photography, and crafts by independent artists at FOEM. 원화 구매, 그림 구매, 현대미술 작품.",
  keywords: ["원화구매", "그림구매", "원화", "현대미술 작품", "그림 판매", "art shop", "paintings for sale", "FOEM"],
  openGraph: {
    title: "Shop — FOEM",
    description: "Browse and purchase original artworks — paintings, photography, and crafts.",
    url: "https://www.foem.co.kr/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
