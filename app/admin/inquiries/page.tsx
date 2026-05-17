"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Inquiry {
  id: string;
  artwork_title: string;
  artist_name: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      });
  }, []);

  async function toggleStatus(inquiry: Inquiry) {
    const newStatus = inquiry.status === "new" ? "responded" : "new";
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inquiry.id, status: newStatus }),
    });
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiry.id ? { ...i, status: newStatus } : i))
    );
    if (selected?.id === inquiry.id) {
      setSelected({ ...inquiry, status: newStatus });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Inquiries</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-normal text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Artwork Inquiries
        </h1>
        {!loading && (
          <span className="text-sm text-[#9A9A9A]">{inquiries.length} total</span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#9A9A9A]">Loading...</p>
      ) : inquiries.length === 0 ? (
        <div className="border border-[#E8E6E2] p-12 text-center">
          <p className="text-sm text-[#9A9A9A]">No inquiries yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List */}
          <div className="border border-[#E8E6E2] divide-y divide-[#E8E6E2]">
            {inquiries.map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelected(inq)}
                className={`w-full text-left px-5 py-4 hover:bg-[#F5F3EF] transition-colors ${
                  selected?.id === inq.id ? "bg-[#F5F3EF]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{inq.name}</p>
                    <p className="text-[11px] text-[#9A9A9A] truncate mt-0.5">{inq.artwork_title}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] tracking-[0.1em] uppercase px-2 py-1 ${
                    inq.status === "new"
                      ? "bg-[#268042] text-white"
                      : "bg-[#E8E6E2] text-[#9A9A9A]"
                  }`}>
                    {inq.status === "new" ? "New" : "Done"}
                  </span>
                </div>
                <p className="text-[11px] text-[#9A9A9A] mt-1">
                  {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                </p>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="border border-[#E8E6E2] p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-normal text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {selected.name}
                </h2>
                <button
                  onClick={() => toggleStatus(selected)}
                  className={`text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 transition-colors ${
                    selected.status === "new"
                      ? "bg-[#1A1A1A] text-white hover:bg-[#4A4A4A]"
                      : "border border-[#E8E6E2] text-[#9A9A9A] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {selected.status === "new" ? "Mark as Done" : "Mark as New"}
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: "Artwork", value: selected.artwork_title },
                  { label: "Artist", value: selected.artist_name },
                  { label: "Email", value: selected.email },
                  ...(selected.phone ? [{ label: "Phone", value: selected.phone }] : []),
                  { label: "Date", value: new Date(selected.created_at).toLocaleDateString("ko-KR") },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] w-16 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-[#1A1A1A]">{value}</span>
                  </div>
                ))}

                {selected.message && (
                  <div className="flex gap-4 pt-2 border-t border-[#E8E6E2] mt-4">
                    <span className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] w-16 flex-shrink-0 pt-0.5">Message</span>
                    <span className="text-[#1A1A1A] leading-relaxed">{selected.message}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-[#E8E6E2] p-12 flex items-center justify-center">
              <p className="text-sm text-[#9A9A9A]">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
