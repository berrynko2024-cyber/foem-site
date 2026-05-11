import type { Metadata } from "next";
import { Inter, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/store/CartContext";

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

export const metadata: Metadata = {
  title: "FOEM — Field of Emotion",
  description: "A multi-artist platform showcasing and selling original artworks — paintings, photographs, and crafts.",
  keywords: ["art", "gallery", "shop", "paintings", "photography", "crafts", "FOEM"],
  openGraph: {
    title: "FOEM — Field of Emotion",
    description: "Original artworks by independent artists",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen flex flex-col bg-foem-cream text-foem-dark">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
