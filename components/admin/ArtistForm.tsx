"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormMode = "create" | "edit";

type ArtistFormData = {
  id: string;
  slug: string;
  name: string;
  name_ko: string;
  bio: string;
  bio_ko: string;
  photo: string;
  photo_filter: string;
  instagram: string;
  youtube: string;
  statement: string;
  statement_ko: string;
  artwork_count: string;
  works_grid: string;
  works_layout: string;
  medium: string;
};

const emptyForm: ArtistFormData = {
  id: "",
  slug: "",
  name: "",
  name_ko: "",
  bio: "",
  bio_ko: "",
  photo: "",
  photo_filter: "",
  instagram: "",
  youtube: "",
  statement: "",
  statement_ko: "",
  artwork_count: "0",
  works_grid: "",
  works_layout: "",
  medium: "",
};

export default function ArtistForm({
  mode,
  initial,
}: {
  mode: FormMode;
  initial?: Partial<ArtistFormData>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArtistFormData>({ ...emptyForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ArtistFormData>(key: K, value: ArtistFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      set("photo", data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim() || !form.slug.trim() || !form.name.trim() || !form.bio.trim() || !form.bio_ko.trim() || !form.photo.trim()) {
      setError("id, slug, name, bio, bio_ko, photo는 필수입니다.");
      return;
    }

    const payload = {
      id: form.id.trim(),
      slug: form.slug.trim(),
      name: form.name.trim(),
      name_ko: form.name_ko.trim() || undefined,
      bio: form.bio.trim(),
      bio_ko: form.bio_ko.trim(),
      photo: form.photo.trim(),
      photo_filter: form.photo_filter.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
      youtube: form.youtube.trim() || undefined,
      statement: form.statement.trim() || undefined,
      statement_ko: form.statement_ko.trim() || undefined,
      artwork_count: Number(form.artwork_count) || 0,
      works_grid: form.works_grid ? Number(form.works_grid) : undefined,
      works_layout: form.works_layout.trim() || undefined,
      medium: form.medium.trim() || undefined,
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/artists" : `/api/admin/artists/${form.id}`;
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

      router.push("/admin/artists");
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
            placeholder="예: a10"
          />
        </div>
        <div>
          <label className={labelClass}>Slug (URL, 예: jane-doe)</label>
          <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Name (English)</label>
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Name (한글)</label>
          <input className={inputClass} value={form.name_ko} onChange={(e) => set("name_ko", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio (English)</label>
        <textarea className={inputClass} rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Bio (한글)</label>
        <textarea className={inputClass} rows={4} value={form.bio_ko} onChange={(e) => set("bio_ko", e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Photo</label>

        {form.photo && (
          <div className="relative w-32 aspect-[4/5] border border-[#E8E6E2] mb-3">
            <Image src={form.photo} alt="" fill sizes="128px" className="object-cover" />
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) uploadPhoto(e.dataTransfer.files[0]);
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
              if (e.target.files?.[0]) uploadPhoto(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-[#9A9A9A]">
            {uploading ? "업로드 중…" : "사진을 드래그하거나 클릭해서 업로드"}
          </p>
        </div>

        {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}

        <details className="mt-3">
          <summary className="text-[11px] text-[#9A9A9A] cursor-pointer">경로 직접 입력 (기존 로컬 이미지 등)</summary>
          <input
            className={`${inputClass} mt-2`}
            value={form.photo}
            onChange={(e) => set("photo", e.target.value)}
            placeholder="/artists/jane-doe.jpg"
          />
        </details>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Photo filter (CSS, 선택. 예: grayscale(100%))</label>
          <input className={inputClass} value={form.photo_filter} onChange={(e) => set("photo_filter", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Medium</label>
          <input className={inputClass} value={form.medium} onChange={(e) => set("medium", e.target.value)} placeholder="photography / painting / sculpture / glass" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Instagram (선택, 예: @handle)</label>
          <input className={inputClass} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>YouTube (선택, URL)</label>
          <input className={inputClass} value={form.youtube} onChange={(e) => set("youtube", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Statement (English, 선택)</label>
        <textarea className={inputClass} rows={3} value={form.statement} onChange={(e) => set("statement", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Statement (한글, 선택)</label>
        <textarea className={inputClass} rows={3} value={form.statement_ko} onChange={(e) => set("statement_ko", e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Artwork count</label>
          <input type="number" className={inputClass} value={form.artwork_count} onChange={(e) => set("artwork_count", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Works grid (선택, 2단 그리드면 2)</label>
          <input type="number" className={inputClass} value={form.works_grid} onChange={(e) => set("works_grid", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Works layout (선택)</label>
          <input className={inputClass} value={form.works_layout} onChange={(e) => set("works_layout", e.target.value)} placeholder="portrait3-mixed" />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] uppercase px-6 py-3 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "저장 중…" : mode === "create" ? "작가 등록" : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
