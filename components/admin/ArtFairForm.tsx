"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormMode = "create" | "edit";

type ArtFairFormData = {
  id: string;
  name: string;
  venue: string;
  location: string;
  artists: string; // comma-separated
  preview_date: string;
  start_date: string;
  end_date: string;
  status: "current" | "upcoming" | "past";
  cover_image: string;
  description: string;
  artwork_ids: string; // comma-separated
  booth_number: string;
};

const emptyForm: ArtFairFormData = {
  id: "",
  name: "",
  venue: "",
  location: "",
  artists: "",
  preview_date: "",
  start_date: "",
  end_date: "",
  status: "upcoming",
  cover_image: "",
  description: "",
  artwork_ids: "",
  booth_number: "",
};

export default function ArtFairForm({
  mode,
  initial,
}: {
  mode: FormMode;
  initial?: Partial<ArtFairFormData>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArtFairFormData>({ ...emptyForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ArtFairFormData>(key: K, value: ArtFairFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadCover = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      set("cover_image", data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim() || !form.name.trim() || !form.venue.trim() || !form.location.trim() || !form.start_date || !form.end_date || !form.cover_image.trim()) {
      setError("id, name, venue, location, start_date, end_date, cover_image는 필수입니다.");
      return;
    }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      venue: form.venue.trim(),
      location: form.location.trim(),
      artists: form.artists.split(",").map((s) => s.trim()).filter(Boolean),
      preview_date: form.preview_date || undefined,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status,
      cover_image: form.cover_image.trim(),
      description: form.description.trim() || undefined,
      artwork_ids: form.artwork_ids.split(",").map((s) => s.trim()).filter(Boolean),
      booth_number: form.booth_number.trim() || undefined,
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/art-fairs" : `/api/admin/art-fairs/${form.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "저장에 실패했습니다.");
        return;
      }

      router.push("/admin/art-fairs");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-[#E8E6E2] bg-transparent px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors";
  const labelClass = "block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>ID {mode === "edit" && "(변경 불가)"}</label>
          <input
            className={inputClass}
            value={form.id}
            disabled={mode === "edit"}
            onChange={(e) => set("id", e.target.value)}
            placeholder="예: f10"
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value as ArtFairFormData["status"])}>
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Venue</label>
          <input className={inputClass} value={form.venue} onChange={(e) => set("venue", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Artists (콤마로 구분)</label>
        <input className={inputClass} value={form.artists} onChange={(e) => set("artists", e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>VIP Preview date (선택)</label>
          <input type="date" className={inputClass} value={form.preview_date} onChange={(e) => set("preview_date", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Start date</label>
          <input type="date" className={inputClass} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>End date</label>
          <input type="date" className={inputClass} value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Cover image</label>

        {form.cover_image && (
          <div className="relative w-40 aspect-[4/3] border border-[#E8E6E2] mb-3">
            <Image src={form.cover_image} alt="" fill sizes="160px" className="object-cover" />
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) uploadCover(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
            dragActive ? "border-[#1A1A1A] bg-[#F5F3EF]" : "border-[#E8E6E2] hover:border-[#9A9A9A]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) uploadCover(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-[#9A9A9A]">
            {uploading ? "업로드 중…" : "이미지를 드래그하거나 클릭해서 업로드"}
          </p>
        </div>

        {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}

        <details className="mt-3">
          <summary className="text-[11px] text-[#9A9A9A] cursor-pointer">경로 직접 입력 (기존 로컬 이미지 등)</summary>
          <input
            className={`${inputClass} mt-2`}
            value={form.cover_image}
            onChange={(e) => set("cover_image", e.target.value)}
            placeholder="/art-fairs/example/cover.jpg"
          />
        </details>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Booth number (선택)</label>
          <input className={inputClass} value={form.booth_number} onChange={(e) => set("booth_number", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Artwork IDs (선택, 콤마로 구분, 예: w22,w23)</label>
          <input className={inputClass} value={form.artwork_ids} onChange={(e) => set("artwork_ids", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description (선택)</label>
        <textarea className={inputClass} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] uppercase px-6 py-3 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "저장 중…" : mode === "create" ? "아트페어 등록" : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
