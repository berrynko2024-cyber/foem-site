"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Artist } from "@/lib/mockData";

type FormMode = "create" | "edit";

type ArtworkFormData = {
  id: string;
  title: string;
  title_ko: string;
  description: string;
  price: string;
  currency: "KRW" | "USD";
  category: "painting" | "photo" | "craft";
  images: string;
  artist_id: string;
  stock: string;
  is_sold: boolean;
  year: string;
  medium: string;
  dimensions: string;
  orientation: "portrait" | "landscape" | "square";
  price_display: string;
  series: string;
  fill_frame: boolean;
};

const emptyForm: ArtworkFormData = {
  id: "",
  title: "",
  title_ko: "",
  description: "",
  price: "",
  currency: "KRW",
  category: "painting",
  images: "",
  artist_id: "",
  stock: "1",
  is_sold: false,
  year: "",
  medium: "",
  dimensions: "",
  orientation: "portrait",
  price_display: "",
  series: "",
  fill_frame: false,
};

export default function ArtworkForm({
  mode,
  initial,
  artists,
}: {
  mode: FormMode;
  initial?: Partial<ArtworkFormData>;
  artists: Artist[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArtworkFormData>({
    ...emptyForm,
    artist_id: artists[0]?.id ?? "",
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ArtworkFormData>(key: K, value: ArtworkFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const imageList = form.images.split("\n").map((s) => s.trim()).filter(Boolean);

  const uploadFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setUploadError("");
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "업로드 실패");
        uploadedUrls.push(data.url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
      }
    }

    if (uploadedUrls.length > 0) {
      setForm((f) => ({
        ...f,
        images: [...imageList, ...uploadedUrls].join("\n"),
      }));
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setForm((f) => ({
      ...f,
      images: imageList.filter((u) => u !== url).join("\n"),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.id.trim() || !form.title.trim() || !form.artist_id || !form.price) {
      setError("id, title, artist, price는 필수입니다.");
      return;
    }

    const artist = artists.find((a) => a.id === form.artist_id);
    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      title_ko: form.title_ko.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      currency: form.currency,
      category: form.category,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      artist_id: form.artist_id,
      artist_name: artist?.name ?? "",
      stock: Number(form.stock) || 0,
      is_sold: form.is_sold,
      year: form.year ? Number(form.year) : undefined,
      medium: form.medium.trim() || undefined,
      dimensions: form.dimensions.trim() || undefined,
      orientation: form.orientation,
      price_display: form.price_display.trim() || undefined,
      series: form.series.trim() || undefined,
      fill_frame: form.fill_frame,
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/artworks" : `/api/admin/artworks/${form.id}`;
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

      router.push("/admin/artworks");
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
            placeholder="예: w60"
          />
        </div>
        <div>
          <label className={labelClass}>Artist</label>
          <select
            className={inputClass}
            value={form.artist_id}
            onChange={(e) => set("artist_id", e.target.value)}
          >
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Title (English)</label>
          <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Title (한글)</label>
          <input className={inputClass} value={form.title_ko} onChange={(e) => set("title_ko", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={inputClass}
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Images</label>

        {imageList.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {imageList.map((url) => (
              <div key={url} className="relative aspect-square border border-[#E8E6E2] group">
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:opacity-100"
                  aria-label="이미지 삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
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
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
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
          <textarea
            className={`${inputClass} mt-2`}
            rows={3}
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            placeholder="/artworks/artist-slug/file.jpg"
          />
        </details>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value as ArtworkFormData["category"])}>
            <option value="painting">Painting</option>
            <option value="photo">Photo</option>
            <option value="craft">Craft</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Orientation</label>
          <select className={inputClass} value={form.orientation} onChange={(e) => set("orientation", e.target.value as ArtworkFormData["orientation"])}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input type="number" className={inputClass} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Price</label>
          <input type="number" className={inputClass} value={form.price} onChange={(e) => set("price", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <select className={inputClass} value={form.currency} onChange={(e) => set("currency", e.target.value as ArtworkFormData["currency"])}>
            <option value="KRW">KRW</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Price display (선택, 예: $2,100)</label>
          <input className={inputClass} value={form.price_display} onChange={(e) => set("price_display", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" className={inputClass} value={form.year} onChange={(e) => set("year", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Medium</label>
          <input className={inputClass} value={form.medium} onChange={(e) => set("medium", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Dimensions</label>
          <input className={inputClass} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Series (선택, 같은 이름끼리 작가 페이지에서 그룹으로 묶여 표시됨)</label>
        <input className={inputClass} value={form.series} onChange={(e) => set("series", e.target.value)} placeholder="예: Interval" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-[#4A4A4A]">
          <input
            type="checkbox"
            checked={form.is_sold}
            onChange={(e) => set("is_sold", e.target.checked)}
          />
          Sold out
        </label>
        <label className="flex items-center gap-2 text-sm text-[#4A4A4A]">
          <input
            type="checkbox"
            checked={form.fill_frame}
            onChange={(e) => set("fill_frame", e.target.checked)}
          />
          Fill frame (흰 배경 작품 등을 프레임에 꽉 채워 표시)
        </label>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] uppercase px-6 py-3 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "저장 중…" : mode === "create" ? "작품 등록" : "변경사항 저장"}
        </button>
      </div>
    </form>
  );
}
