// app/products/showcase/[id]/page.tsx
export const revalidate = 0; // always fresh (หรือเอาออกถ้าจะให้ cache ได้)

import { notFound } from "next/navigation";
import Image from "next/image";
import ContactComponant from "@/components/Contact";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

type Brand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
};

type Img = { url: string; alt?: string; width?: number; height?: number };
type Video = { url: string; title?: string };

type ProductDTO = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  link?: string;
  body?: unknown;
  images?: Img[];
  videos?: Video[];
  categories?: string[];
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  status: "draft" | "scheduled" | "published" | "archived";
  visibility: "public" | "private" | "roles";
  allowedRoles?: string[];
  publishedAt?: string;
  unpublishedAt?: string;

  // จาก API ที่ populate แล้ว
  brandId: string; // id เพียว ๆ
  brand?: Brand; // object ของแบรนด์
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!res.ok) {
    if (res.status === 404) notFound();
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${msg}`);
  }
  return res.json();
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (
      ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
    ) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed") {
        return parts[1] ? `https://www.youtube.com/embed/${parts[1]}` : null;
      }
    }
  } catch {}
  return null;
}

function VideoSection({ videos }: { videos?: Video[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="mb-10 space-y-6">
      {videos.map((v, i) => {
        const url = v.url || "";
        const embed = toYouTubeEmbed(url);
        if (embed) {
          return (
            <div
              key={`${url}-${i}`}
              className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={`${embed}?rel=0&modestbranding=1`}
                title={v.title || `video ${i + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        }
        if (url.toLowerCase().endsWith(".mp4")) {
          return (
            <video
              key={`${url}-${i}`}
              controls
              className="w-full rounded-xl border border-white/10"
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        }
        return (
          <a
            key={`${url}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block underline text-fuchsia-400"
          >
            Watch video {v.title ? `: ${v.title}` : ""}
          </a>
        );
      })}
    </section>
  );
}

function MasonryGallery({ data }: { data: { images?: any[] } }) {
  if (!data.images?.length) return null;

  return (
    <section className="mb-12 [column-count:4] md:[column-count:3] sm:[column-count:2] [column-gap:1rem]">
      {data.images.map((img, i) => {
        const needsFill = !(img.width && img.height);

        return (
          <figure key={`${img.url}-${i}`} className="mb-4 break-inside-avoid">
            <div
              className={[
                "relative w-full overflow-hidden rounded-xl border border-white/10",
                needsFill ? "h-[340px]" : "",
              ].join(" ")}
            >
              {needsFill ? (
                <img
                  src={`/api/v1/controllers/getImage/productcontent/?name=${encodeURIComponent(
                    img.url.replace("/productcontent/", "")
                  )}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`/api/v1/controllers/getImage/productcontent/?name=${encodeURIComponent(
                    img.url.replace("/productcontent/", "")
                  )}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {img.alt && (
              <figcaption className="mt-2 text-center text-sm text-slate-400">
                {img.alt}
              </figcaption>
            )}
          </figure>
        );
      })}
    </section>
  );
}

export default async function ShowcaseBrandPage({
  params,
}: {
  params: { id: string };
}) {
  const idOrSlug = decodeURIComponent(params.id);

  // สินค้าจาก endpoint เดียว (รวม populate brand เรียบร้อย)
  const data = await fetchJSON<ProductDTO>(
    `${API_BASE}/api/v1/controllers/products/public/${encodeURIComponent(
      idOrSlug
    )}`
  );

  console.log("[ShowcaseBrandPage] data:", data);

  const coverUrl = data.brand?.coverUrl;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-white min-h-screen">
      {/* Brand cover */}
      {coverUrl && (
        <div className="mb-6 relative w-full overflow-hidden rounded-xl border border-white/10">
          <img
            src={`/api/v1/controllers/getImage/uploads/brands/?name=${encodeURIComponent(
              coverUrl.replace("/uploads/brands/", "")
            )}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title + brand */}
      <section className="mb-6 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-balance py-4 font-semibold text-center">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="mt-2 text-base sm:text-lg md:text-2xl text-center text-slate-300">
            {data.subtitle}
          </p>
        )}
        {data.brand && (
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
            <div className="w-full text-end">
              <span className="opacity-80">by </span>
              <span className="font-medium">{data.brand.name}</span>
            </div>
          </div>
        )}
      </section>

      {/* Summary */}
      {data.summary && (
        <p className="mb-6 text-sm sm:text-base md:text-lg text-slate-300">
          {data.summary}
        </p>
      )}

      {/* Body (รองรับทั้ง string และ JSON object แบบ fallback) */}
      {typeof data.body === "string" ? (
        <article className="text-sm sm:text-base md:text-lg max-w-none mb-8">
          <p>{data.body}</p>
        </article>
      ) : isPlainObject(data.body) ? (
        <pre className="mb-8 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-slate-200">
          {JSON.stringify(data.body, null, 2)}
        </pre>
      ) : null}

      {/* Videos */}
      <VideoSection videos={data.videos} />

      {/* External link */}
      {data.link && (
        <div className="mb-8">
          <a
            href={data.link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold hover:bg-fuchsia-500"
          >
            Visit project
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"
              />
              <path fill="currentColor" d="M5 5h5V3H3v7h2V5z" />
            </svg>
          </a>
        </div>
      )}

      {/* Hero image (ภาพแรก) */}
      {Array.isArray(data.images) &&
        data.images.length > 0 &&
        (data.images.length === 1 ? (
          <figure className="mb-12">
            <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
              {data.images[0].width && data.images[0].height ? (
                <img
                  src={`/api/v1/controllers/getImage/productcontent/?name=${encodeURIComponent(
                    data.images[0].url.replace("/productcontent/", "")
                  )}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative h-[340px]">
                  <img
                    src={`/api/v1/controllers/getImage/productcontent/?name=${encodeURIComponent(
                      data.images[0].url.replace("/productcontent/", "")
                    )}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {data.images[0].alt && (
              <figcaption className="mt-2 text-center text-sm text-slate-400">
                {data.images[0].alt}
              </figcaption>
            )}
          </figure>
        ) : (
          <MasonryGallery data={{ images: data.images ?? [] }} />
        ))}

      {/* Meta */}
      <section className="space-y-2 text-sm text-slate-400">
        {data.categories?.length ? (
          <div>
            <span className="opacity-70 mr-2">Categories:</span>
            {data.categories.join(", ")}
          </div>
        ) : null}
        {data.tags?.length ? (
          <div>
            <span className="opacity-70 mr-2">Tags:</span>
            {data.tags?.slice(0, 3).map((t) => (
              <Link
                key={t}
                href={`/products/${t}`}
                className="hover:underline hover:text-fuchsia-400 ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                #{t}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <ContactComponant />
    </main>
  );
}
