export type Currency = "KRW" | "USD" | "EUR";

export const SYMBOLS: Record<Currency, string> = {
  KRW: "원",
  USD: "$",
  EUR: "€",
};

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === "KRW") return `${Math.round(amount).toLocaleString("ko-KR")}원`;
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol}${Math.round(amount).toLocaleString("en-US")}`;
}

// Rates are "units of currency per 1 KRW" (KRW is the pivot since every
// artwork is natively priced in KRW or USD).
export type FxRates = { USD: number; EUR: number };

export function convertPrice(amount: number, from: Currency, to: Currency, rates: FxRates): number {
  if (from === to) return amount;
  let amountInKrw = amount;
  if (from !== "KRW") amountInKrw = amount / rates[from];
  if (to === "KRW") return amountInKrw;
  return amountInKrw * rates[to];
}
