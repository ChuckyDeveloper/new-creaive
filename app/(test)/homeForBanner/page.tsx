"use client";

import { useEffect, useMemo, useState } from "react";

type Banner = {
    _id: string;
    title?: string;
    imageUrl: string;
};

export default function HomePageClient() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const apiUrl = useMemo(() => {
        const base =
            process.env.NEXT_PUBLIC_SITE_URL ||
            (typeof window !== "undefined" ? window.location.origin : "");
        return `${base}/api/v1/controllers/felicitate/banner?active=1`;
    }, []);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const res = await fetch(apiUrl, { cache: "no-store", signal: ac.signal });

                console.log("Status:", res.status, res.statusText);
                console.log("Headers:", Object.fromEntries(res.headers.entries()));

                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

                const data: Banner[] = await res.json();
                console.log("Body:", data); // << log data ใน browser

                setBanners(data);
            } catch (e: any) {
                if (e.name !== "AbortError") {
                    console.error("Fetch error:", e);
                    setErr(e?.message ?? "Fetch failed");
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, [apiUrl]);

    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center">Loading…</div>;
    }
    if (err) {
        return <div className="p-6 text-red-300">Error: {err}</div>;
    }

    return (
        <div className="w-screen h-screen p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {banners.map((b) => (
                    <div key={b._id} className="rounded overflow-hidden border">
                        <img src={b.imageUrl} alt={b.title ?? ""} className="h-56 w-full object-cover" />
                        {b.title && <div className="p-2 text-sm">{b.title}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
