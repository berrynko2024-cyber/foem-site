"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteExhibitionButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${title}" 전시를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/exhibitions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "삭제에 실패했습니다.");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-red-500 transition-colors focus:outline-none disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
