import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/cart",
          "/cart/",
          "/checkout",
          "/checkout/",
          "/order/",
        ],
      },
    ],
    sitemap: "https://www.foem.co.kr/sitemap.xml",
    host: "https://www.foem.co.kr",
  };
}
