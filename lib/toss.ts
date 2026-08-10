import "server-only";

/** Toss Payments 결제 취소(환불) API 호출. 성공/실패를 명확히 반환한다. */
export async function cancelTossPayment(
  paymentKey: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encodedKey = Buffer.from(secretKey + ":").toString("base64");

  try {
    const res = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancelReason: reason }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || `Toss 취소 실패 (status ${res.status})` };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Toss 취소 API 호출 중 오류" };
  }
}
