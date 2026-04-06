"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface PopupData {
  enabled: boolean;
  imageUrl: string;
}

export default function PopupManagePage() {
  const [data, setData] = useState<PopupData>({ enabled: false, imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Fetch current state ── */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/popup");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Upload image ── */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("enabled", String(data.enabled));

      const res = await fetch("/api/popup", { method: "POST", body: form });
      const json = await res.json();
      setData(json);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ── Toggle enabled ── */
  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/popup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !data.enabled }),
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  /* ── Delete image ── */
  const handleDelete = async () => {
    if (!confirm("ต้องการลบรูปภาพ Popup ใช่ไหม?")) return;
    try {
      const res = await fetch("/api/popup", { method: "DELETE" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  /* ── File preview ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[900px] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      {/* ── Background glow ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-12 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[130px]" />
        <div className="absolute right-[-6%] top-[40%] h-[360px] w-[360px] rounded-full bg-primary-600/12 blur-[120px]" />
      </div>

      {/* ── Header ── */}
      <div className="mb-10">
        <Link
          href="/cms"
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white/70"
        >
          ← กลับไปหน้า CMS
        </Link>
        <h1 className="bg-gradient-to-r from-primary-500 via-primary-600 to-complementary-500 bg-clip-text text-3xl font-black leading-tight text-transparent md:text-4xl">
          จัดการ Popup หน้าแรก
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200/70">
          อัปโหลดรูปภาพ 1 รูป และเปิด/ปิดการแสดง Popup บนหน้าแรกของเว็บไซต์
        </p>
      </div>

      {/* ── Status & Toggle ── */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">สถานะ Popup:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              data.enabled
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                data.enabled ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {data.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          </span>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggling || !data.imageUrl}
          className={`ml-auto rounded-xl px-5 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            data.enabled
              ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {toggling
            ? "กำลังดำเนินการ..."
            : data.enabled
              ? "ปิด Popup"
              : "เปิด Popup"}
        </button>
      </div>

      {/* ── Current Image ── */}
      {data.imageUrl && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">
              รูปภาพปัจจุบัน
            </span>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/20"
            >
              ลบรูปภาพ
            </button>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt="Popup image"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* ── Upload Form ── */}
      <form
        onSubmit={handleUpload}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-white/90">
          {data.imageUrl ? "เปลี่ยนรูปภาพ" : "อัปโหลดรูปภาพ"}
        </h2>

        <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] py-10 transition hover:border-primary-500/40 hover:bg-white/[0.04]">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          {preview ? (
            <div className="relative h-48 w-full max-w-md overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          ) : (
            <>
              <svg
                className="mb-3 h-10 w-10 text-white/20 transition group-hover:text-primary-500/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
              <span className="text-sm text-white/40">
                คลิกเพื่อเลือกรูปภาพ หรือลากไฟล์มาวาง
              </span>
              <span className="mt-1 text-xs text-white/25">
                PNG, JPG, GIF, WebP (แนะนำ 1200×800 px)
              </span>
            </>
          )}
        </label>

        <button
          type="submit"
          disabled={uploading || !fileRef.current?.files?.length}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
        </button>
      </form>
    </div>
  );
}
