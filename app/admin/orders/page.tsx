"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, type Currency } from "@/lib/currency";

interface OrderItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  currency?: Currency;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  items: OrderItem[];
  total_amount: number;
  currency?: Currency;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Orders</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-3xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Orders
        </h1>
        {!loading && (
          <span className="text-sm text-[#9A9A9A]">{orders.length} orders</span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#9A9A9A]">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="border border-[#E8E6E2] p-12 text-center">
          <p
            className="text-2xl font-normal text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            No orders yet
          </p>
          <p className="text-sm text-[#9A9A9A]">
            Orders will appear here once a customer completes checkout.
          </p>
        </div>
      ) : (
        <div className="border border-[#E8E6E2] divide-y divide-[#E8E6E2]">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#F5F3EF] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-[#1A1A1A]">
                      {order.customer_name}{" "}
                      <span className="text-[#9A9A9A]">— {order.customer_email}</span>
                    </p>
                    <p className="text-[11px] text-[#9A9A9A] mt-1">
                      #{order.order_number.slice(0, 8).toUpperCase()} ·{" "}
                      {order.payment_method === "paypal" ? "PayPal" : "토스페이먼츠"} ·{" "}
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className={`text-[10px] tracking-[0.1em] uppercase px-2 py-1 border ${
                        order.payment_status === "paid"
                          ? "border-[#268042] text-[#268042]"
                          : "border-[#E8E6E2] text-[#9A9A9A]"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                    <span className="text-sm text-[#1A1A1A]">
                      {formatPrice(order.total_amount, order.currency ?? "KRW")}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 bg-[#F5F3EF]">
                    {order.customer_phone && (
                      <p className="text-[11px] text-[#9A9A9A] mb-3">
                        Phone: {order.customer_phone}
                      </p>
                    )}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[#1A1A1A]">
                            {item.title} <span className="text-[#9A9A9A]">· {item.artist}</span>{" "}
                            × {item.quantity}
                          </span>
                          <span className="text-[#4A4A4A]">
                            {formatPrice(item.price * item.quantity, item.currency ?? "KRW")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
