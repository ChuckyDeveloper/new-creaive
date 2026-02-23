"use client";
import React, { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
  event?: {
    image: string;
    link: string;
    uptime: string;
    downtime: string;
  };
  imageUrl?: string;
}

export default function Page() {
  const [event, setEvent] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/controllers/getDrive");
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data: ApiResponse = await res.json();

        console.log("📌 API Data:", data);
        setEvent(data);
      } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!event?.event || !event.imageUrl)
    return <p className="text-gray-500">No active events right now.</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">Today's Active Event</h1>

      <div className="mb-6 text-center">
        <a href={event.event.link} target="_blank" rel="noopener noreferrer">
          <img
            src={event.imageUrl}
            alt="Event"
            className="max-w-md rounded shadow-md hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/fallback.png"; // fallback ถ้าภาพโหลดไม่ได้
              console.error("❌ Failed to load image:", event.imageUrl);
            }}
            onLoad={() => console.log("✅ Image loaded:", event.imageUrl)}
          />
        </a>
        <p className="mt-2 text-sm text-gray-700">
          Active from {event.event.uptime} → {event.event.downtime}
        </p>
      </div>
    </main>
  );
}
