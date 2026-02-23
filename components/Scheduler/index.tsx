"use client";

import { useEffect, useMemo, useState } from "react";

type Banner = {
    _id: string;
    isActive: boolean;
    title?: string;
    imageUrl: string;
};

export default function FecilitateComponent() {
    const [event, setEvent] = useState(false);
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

                if (data[0].isActive) setEvent(true)

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


    if (event)
        return (
            <div className="fixed w-screen h-screen z-50 bg-black flex">
                <img
                    // src={banners[0].imageUrl}
                    src={`/api/v1/controllers/felicitate/banner/getImageBanner?name=${encodeURIComponent(
                        banners[0].imageUrl.replace("uploads/", "")
                    )}`}
                    alt={banners[0].title ?? ""}
                    className="h-auto lg:w-[80%] xl:w-[62%] object-cover m-auto pt-20 xl:pt-2 p-2 lg:p-0" />

                <button
                    className="absolute bottom-10 xl:bottom-4 left-1/2 transform -translate-x-1/2"
                    onClick={() => setEvent(false)}
                >
                    <img
                        src="/fastival/Button.png"
                        alt="Close"
                        className="max-w-[150px] xl:max-w-[200px] m-auto lg:pt-2 2xl:pt-0"
                    />
                </button>
            </div>
        );

    return
}
