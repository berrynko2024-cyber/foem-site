import { chromium } from "playwright";

const pages = [
  { url: "http://localhost:3000", name: "home" },
  { url: "http://localhost:3000/shop", name: "shop" },
  { url: "http://localhost:3000/shop/w1", name: "artwork-detail" },
  { url: "http://localhost:3000/artists", name: "artists" },
  { url: "http://localhost:3000/cart", name: "cart" },
  { url: "http://localhost:3000/admin", name: "admin" },
];

const browser = await chromium.launch();
for (const { url, name } of pages) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: `/tmp/foem-${name}.png`, fullPage: false });
  console.log(`✓ ${name}`);
  await page.close();
}
await browser.close();
console.log("Done. Screenshots in /tmp/");
