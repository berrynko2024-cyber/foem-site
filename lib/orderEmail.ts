import "server-only";
import { Resend } from "resend";

type OrderItem = {
  id: string;
  title: string;
  artist?: string;
  price: number;
  quantity: number;
};

type OrderEmailInput = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: { address?: string; city?: string; country?: string } | null;
  items: OrderItem[];
  amount: number;
  currency: string;
  paymentMethod: string;
};

function formatAmount(amount: number, currency: string) {
  if (currency === "USD") return `$${amount.toLocaleString("en-US")}`;
  return `${amount.toLocaleString("ko-KR")}원`;
}

function itemsRows(items: OrderItem[]) {
  return items
    .map(
      (i) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${i.title}${i.artist ? ` <span style="color:#9A9A9A;">— ${i.artist}</span>` : ""}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        </tr>`
    )
    .join("");
}

/**
 * 주문이 orders 테이블에 실제로 처음 저장되는 시점(confirm/webhook의 "신규 주문" 분기)에서만 호출한다.
 * 이메일 발송 실패는 결제/주문 처리 결과에 영향을 주면 안 되므로 절대 throw하지 않는다.
 */
export async function sendOrderEmails(order: OrderEmailInput) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const addressLine = order.shippingAddress
      ? [order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.country]
          .filter(Boolean)
          .join(", ")
      : "-";

    await Promise.all([
      resend.emails.send({
        from: "FOEM <onboarding@resend.dev>",
        to: "berrynko2024@gmail.com",
        subject: `신규 주문 발생 — ${order.orderId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px;">
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">신규 주문이 접수되었습니다</h2>
            <p style="font-size: 13px; color: #9A9A9A; margin-bottom: 16px;">배송을 준비해 주세요.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
              <tr><td style="padding: 8px 0; color: #9A9A9A; width: 90px;">주문번호</td><td style="padding: 8px 0;">${order.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #9A9A9A;">결제수단</td><td style="padding: 8px 0;">${order.paymentMethod}</td></tr>
              <tr><td style="padding: 8px 0; color: #9A9A9A;">금액</td><td style="padding: 8px 0;">${formatAmount(order.amount, order.currency)}</td></tr>
              <tr><td style="padding: 8px 0; color: #9A9A9A;">구매자</td><td style="padding: 8px 0;">${order.customerName}</td></tr>
              <tr><td style="padding: 8px 0; color: #9A9A9A;">이메일</td><td style="padding: 8px 0;">${order.customerEmail}</td></tr>
              ${order.customerPhone ? `<tr><td style="padding: 8px 0; color: #9A9A9A;">연락처</td><td style="padding: 8px 0;">${order.customerPhone}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #9A9A9A; vertical-align: top;">배송지</td><td style="padding: 8px 0;">${addressLine}</td></tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr><th style="text-align:left; padding-bottom: 6px; border-bottom: 1px solid #ccc; color:#9A9A9A; font-weight:normal;">작품</th><th style="text-align:center; padding-bottom: 6px; border-bottom: 1px solid #ccc; color:#9A9A9A; font-weight:normal;">수량</th></tr>
              ${itemsRows(order.items)}
            </table>
          </div>
        `,
      }),
      resend.emails.send({
        from: "FOEM <onboarding@resend.dev>",
        to: order.customerEmail,
        subject: `주문이 확인되었습니다 — ${order.orderId}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
            <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 8px;">주문해 주셔서 감사합니다.</h1>
            <p style="font-size: 14px; line-height: 1.7; color: #4A4A4A; margin-bottom: 24px;">
              결제가 정상적으로 완료되었습니다. 작품은 안전하게 포장하여 배송해 드리겠습니다.
            </p>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: sans-serif; margin-bottom: 16px;">
              <tr><th style="text-align:left; padding-bottom: 6px; border-bottom: 1px solid #ccc; color:#9A9A9A; font-weight:normal;">작품</th><th style="text-align:center; padding-bottom: 6px; border-bottom: 1px solid #ccc; color:#9A9A9A; font-weight:normal;">수량</th></tr>
              ${itemsRows(order.items)}
            </table>
            <p style="font-size: 13px; font-family: sans-serif; color: #4A4A4A;">
              주문번호 <strong>${order.orderId}</strong><br>
              결제금액 <strong>${formatAmount(order.amount, order.currency)}</strong>
            </p>
            <p style="font-size: 12px; color: #9A9A9A; margin-top: 40px; font-family: sans-serif;">
              Field of Emotions — foem.co.kr
            </p>
          </div>
        `,
      }),
    ]);
  } catch (err) {
    console.error("[orderEmail] Failed to send order emails:", err);
  }
}
