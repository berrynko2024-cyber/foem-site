import type { Metadata } from "next";
import { Inter, Playfair_Display, Bebas_Neue, Oswald, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/store/CartContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.foem.co.kr"),
  title: {
    default: "FOEM — Field of Emotion",
    template: "%s | FOEM",
  },
  description: "FOEM is a curated platform showcasing and selling original artworks — paintings, photographs, and crafts — by independent artists.",
  keywords: ["art gallery", "original artwork", "paintings", "photography", "art shop", "FOEM", "contemporary art", "Korean artists", "art consulting", "아트갤러리", "원화구매", "현대미술", "아트컨설팅", "갤러리", "그림구매", "베티문", "박의영", "박성은", "하린", "서병관", "정재은", "아트페어"],
  authors: [{ name: "FOEM", url: "https://www.foem.co.kr" }],
  openGraph: {
    title: "FOEM — Field of Emotion",
    description: "Original artworks by independent artists. Paintings, photography, and crafts.",
    url: "https://www.foem.co.kr",
    siteName: "FOEM",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "FOEM — Field of Emotion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOEM — Field of Emotion",
    description: "Original artworks by independent artists.",
    images: ["/og-main.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-TZsycMQ-P2vgm3N",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${bebasNeue.variable} ${oswald.variable} ${barlowCondensed.variable}`}>
      <head>
        <meta name="naver-site-verification" content="cbcba41d399c86f33645e8cab8c3c33014d71d54" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FDMPT09PHJ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FDMPT09PHJ');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FOEM",
              alternateName: "Field of Emotion",
              url: "https://www.foem.co.kr",
              logo: "https://www.foem.co.kr/og-main.png",
              description: "FOEM is a curated platform showcasing and selling original artworks by independent artists.",
              sameAs: [
                "https://www.instagram.com/foem_korea",
                "https://www.youtube.com/@foemart",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "berrynko2024@gmail.com",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-foem-cream text-foem-dark">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
