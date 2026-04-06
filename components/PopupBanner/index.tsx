"use client";

import { useEffect, useState } from "react";

interface PopupData {
  enabled: boolean;
  imageUrl: string;
}

export default function PopupBanner() {
  const [data, setData] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetch("/api/popup")
      .then((res) => res.json())
      .then((json: PopupData) => {
        setData(json);
        if (json.enabled && json.imageUrl) {
          // Small delay to let page render first
          setTimeout(() => setVisible(true), 800);
        }
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible || !data?.enabled || !data?.imageUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* ── Popup container ── */}
      <div
        className={`relative w-full max-w-3xl transform transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* ── Close button ── */}
        <button
          onClick={handleClose}
          className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/70 shadow-lg transition-all hover:bg-white/10 hover:text-white"
          aria-label="ปิด"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ── Image ── */}
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt="Popup Banner"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
