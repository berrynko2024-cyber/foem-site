"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ConsultingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  mediums: string[] | null;
  medium_other: string | null;
  vibe: string | null;
  vibe_other: string | null;
  artwork_size: string | null;
  placement: string | null;
  space_other: string | null;
  status: string;
  created_at: string;
}

const mediumLabel: Record<string, string> = {
  photography: "사진",
  "painting-figurative": "회화 · 구상",
  "painting-non-figurative": "회화 · 비구상",
  craft: "공예",
};
const vibeLabel: Record<string, string> = {
  oriental: "동양적 여백",
  geometric: "기하학적 구조",
  lyrical: "서정적 서사",
  minimal: "미니멀 & 정제",
  bold: "대담한 에너지",
};
const sizeLabel: Record<string, string> = {
  large: "대형 (160cm+)",
  medium: "중소형 (100cm 내외)",
  custom: "공간 맞춤형",
};
const placementLabel: Record<string, string> = {
  living: "거실",
  dining: "다이닝",
  lobby: "오피스 로비",
  private: "서재 / 프라이빗 룸",
  commercial: "상업 공간 / 갤러리",
};

export default function AdminConsultingPage() {
  const [requests, setRequests] = useState<ConsultingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ConsultingRequest | null>(null);

  useEffect(() => {
    fetch("/api/admin/consulting")
      .then((r) => r.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  async function toggleStatus(req: ConsultingRequest) {
    const newStatus = req.status === "pending" ? "done" : "pending";
    await fetch("/api/admin/consulting", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: req.id, status: newStatus }),
    });
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: newStatus } : r))
    );
    if (selected?.id === req.id) setSelected({ ...req, status: newStatus });
  }

  const mediumsText = (r: ConsultingRequest) =>
    [
      ...(r.mediums?.map((m) => mediumLabel[m] ?? m) ?? []),
      ...(r.medium_other ? [`기타: ${r.medium_other}`] : []),
    ].join(", ") || "—";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Consulting</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-normal text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Art Consulting Requests
        </h1>
        {!loading && (
          <span className="text-sm text-[#9A9A9A]">{requests.length} total</span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#9A9A9A]">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="border border-[#E8E6E2] p-12 text-center">
          <p className="text-sm text-[#9A9A9A]">No consulting requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List */}
          <div className="border border-[#E8E6E2] divide-y divide-[#E8E6E2]">
            {requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelected(req)}
                className={`w-full text-left px-5 py-4 hover:bg-[#F5F3EF] transition-colors ${
                  selected?.id === req.id ? "bg-[#F5F3EF]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{req.name}</p>
                    <p className="text-[11px] text-[#9A9A9A] truncate mt-0.5">{req.email}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] tracking-[0.1em] uppercase px-2 py-1 ${
                    req.status === "pending"
                      ? "bg-[#268042] text-white"
                      : "bg-[#E8E6E2] text-[#9A9A9A]"
                  }`}>
                    {req.status === "pending" ? "New" : "Done"}
                  </span>
                </div>
                <p className="text-[11px] text-[#9A9A9A] mt-1">
                  {new Date(req.created_at).toLocaleDateString("ko-KR")}
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
                    selected.status === "pending"
                      ? "bg-[#1A1A1A] text-white hover:bg-[#4A4A4A]"
                      : "border border-[#E8E6E2] text-[#9A9A9A] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {selected.status === "pending" ? "Mark as Done" : "Mark as New"}
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: "이메일", value: selected.email },
                  { label: "연락처", value: selected.phone },
                  { label: "관심 매체", value: mediumsText(selected) },
                  { label: "미학적 경향", value: [selected.vibe ? (vibeLabel[selected.vibe] ?? selected.vibe) : "", selected.vibe_other ? `기타: ${selected.vibe_other}` : ""].filter(Boolean).join(", ") || "—" },
                  { label: "작품 크기", value: selected.artwork_size ? (sizeLabel[selected.artwork_size] ?? selected.artwork_size) : "—" },
                  { label: "설치 공간", value: selected.placement ? (placementLabel[selected.placement] ?? selected.placement) : "—" },
                  { label: "접수일", value: new Date(selected.created_at).toLocaleDateString("ko-KR") },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] w-20 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-[#1A1A1A]">{value}</span>
                  </div>
                ))}

                {selected.space_other && (
                  <div className="flex gap-4 pt-3 border-t border-[#E8E6E2] mt-2">
                    <span className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] w-20 flex-shrink-0 pt-0.5">공간 메모</span>
                    <span className="text-[#1A1A1A] leading-relaxed">{selected.space_other}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-[#E8E6E2] p-12 flex items-center justify-center">
              <p className="text-sm text-[#9A9A9A]">신청 항목을 선택하면 상세 정보가 표시됩니다</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
