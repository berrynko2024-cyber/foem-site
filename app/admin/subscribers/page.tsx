"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((data) => {
        setSubscribers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Subscribers</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-normal text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Mailing List
        </h1>
        {!loading && (
          <span className="text-sm text-[#9A9A9A]">{subscribers.length} subscribers</span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#9A9A9A]">Loading...</p>
      ) : subscribers.length === 0 ? (
        <div className="border border-[#E8E6E2] p-12 text-center">
          <p className="text-sm text-[#9A9A9A]">No subscribers yet.</p>
        </div>
      ) : (
        <div className="border border-[#E8E6E2] divide-y divide-[#E8E6E2]">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#1A1A1A]">{s.email}</span>
              <span className="text-[11px] text-[#9A9A9A]">
                {new Date(s.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
