import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { items, customer, orderId, origin } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const baseUrl = origin || "https://www.foem.co.kr";

  const line_items = items.map((item: {
    title: string;
    artist: string;
    price: number;
    quantity: number;
    image?: string;
  }) => ({
    price_data: {
      currency: "krw",
      product_data: {
        name: item.title,
        description: `by ${item.artist}`,
        ...(item.image ? { images: [`${baseUrl}${item.image}`] } : {}),
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer_email: customer?.email,
    metadata: {
      orderId,
      customerName: customer?.name ?? "",
      customerPhone: customer?.phone ?? "",
      shippingAddress: customer
        ? `${customer.address}, ${customer.city}, ${customer.country}`
        : "",
    },
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
