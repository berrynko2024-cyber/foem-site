"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormMode = "create" | "edit";

type ExhibitionFormData = {
  id: string;
  title: string;
  title_en: string;
  artists: string; // comma-separated
  venue: string;
  location: string;
  start_date: string;
  end_date: string;
  status: "current" | "upcoming" | "past";
  cover_image: string;
  hero_image: string;
  description: string;
  description_ko: string;
  video_url: string;
  orientation: "" | "portrait" | "landscape" | "square";
  photos: string; // JSON
};

const emptyForm: ExhibitionFormData = {
  id: "",
  title: "",
  title_en: "",
  artists: "",
  venue: "",
  location: "",
  start_date: "",
  end_date: "",
  status: "upcoming",
  cover_image: "",
  hero_image: "",
  description: "",
  description_ko: "",
  video_url: "",
  orientation: "",
  photos: "[]",
};

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full border border-[#E8E6E2] bg-transparent px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors";
  const labelClass = "block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2";

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      {value && (
        <div className="relative w-40 aspect-[4/3] border border-[#E8E6E2] mb-3">
          <Image src={value} alt="" fill sizes="160px" className="object-cover" />
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) upload(e.dataTransfer.files[0]);
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
            if (e.target.files?.[0]) upload(e.target.files[0]);
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/exhibitions/example/cover.jpg"
        />
      </details>
    </div>
  );
}

export default function ExhibitionForm({
  mode,
  initial,
}: {
  mode: FormMode;
  initial?: Partial<ExhibitionFormData>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ExhibitionFormData>({ ...emptyForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ExhibitionFormData>(key: K, value: ExhibitionFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim() || !form.title.trim() || !form.location.trim() || !form.start_date || !form.end_date || !form.cover_image.trim()) {
      setError("id, title, location, start_date, end_date, cover_image는 필수입니다.");
      return;
    }

    let photos: unknown = [];
    try {
      photos = form.photos.trim() ? JSON.parse(form.photos) : [];
    } catch {
      setError("Photos 필드가 올바른 JSON 형식이 아닙니다.");
      return;
    }

    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      title_en: form.title_en.trim() || undefined,
      artists: form.artists.split(",").map((s) => s.trim()).filter(Boolean),
      venue: form.venue.trim() || undefined,
      location: form.location.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status,
      cover_image: form.cover_image.trim(),
      hero_image: form.hero_image.trim() || undefined,
      description: form.description.trim() || undefined,
      description_ko: form.description_ko.trim() || undefined,
      video_url: form.video_url.trim() || undefined,
      orientation: form.orientation || undefined,
      photos,
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/exhibitions" : `/api/admin/exhibitions/${form.id}`;
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

      router.push("/admin/exhibitions");
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
            placeholder="예: e12"
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value as ExhibitionFormData["status"])}>
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Title (English, 선택)</label>
          <input className={inputClass} value={form.title_en} onChange={(e) => set("title_en", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Artists (콤마로 구분, 예: Betty Moon, Ha Jeong Lim)</label>
        <input className={inputClass} value={form.artists} onChange={(e) => set("artists", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Venue (선택)</label>
          <input className={inputClass} value={form.venue} onChange={(e) => set("venue", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Start date</label>
          <input type="date" className={inputClass} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>End date</label>
          <input type="date" className={inputClass} value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
        </div>
      </div>

      <ImageUploadField label="Cover image" value={form.cover_image} onChange={(v) => set("cover_image", v)} />
      <ImageUploadField label="Hero image (선택, 상세 페이지 풀스크린)" value={form.hero_image} onChange={(v) => set("hero_image", v)} />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Orientation (선택, 커버 이미지 비율)</label>
          <select className={inputClass} value={form.orientation} onChange={(e) => set("orientation", e.target.value as ExhibitionFormData["orientation"])}>
            <option value="">기본값</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Video URL (선택)</label>
          <input className={inputClass} value={form.video_url} onChange={(e) => set("video_url", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description (English, 선택)</label>
        <textarea className={inputClass} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Description (한글, 선택)</label>
        <textarea className={inputClass} rows={4} value={form.description_ko} onChange={(e) => set("description_ko", e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Photos (선택, JSON 배열 — [{"{"}"src": "/exhibitions/.../a.jpg", "caption": "...", "captionKo": "...", "orientation": "landscape"{"}"}])</label>
        <textarea
          className={`${inputClass} font-mono`}
          rows={6}
          value={form.photos}
          onChange={(e) => set("photos", e.target.value)}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] uppercase px-6 py-3 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "저장 중…" : mode === "create" ? "전시 등록" : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
