import React from "react";
import Container from "../../../components/layout/containerPage";

type Blog = {
  id: string;
  title: string;
  content?: string;
  content_encoded?: string;
  created?: number;
  link: string;
  isoDate?: string;
};

export const revalidate = 600;

async function getCreaiveBlogs(): Promise<{ rss: { items: Blog[] } }> {
  const fallback = { rss: { items: [] as Blog[] } };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); 
  try {
    const res = await fetch("https://api.creaive.ai/feed", {
      next: { revalidate },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn("[BLOG] feed not ok:", res.status, res.statusText);
      return fallback;
    }

    const data = await res.json().catch(() => fallback);

    // Removed debug log of first item to avoid leaking large payloads
    // console.log(data.rss.items[0])

    if (!data || !data.rss || !Array.isArray(data.rss.items)) return fallback;

    // Normalize fields so UI can read images and dates consistently
    const normalized = {
      rss: {
        items: data.rss.items.map((i: any) => ({
          ...i,
          // map "content:encoded" -> content_encoded for safe access
          content_encoded: i["content:encoded"] ?? i.content_encoded ?? i.content ?? "",
          // prefer numeric created (seconds) else derive from isoDate
          created: typeof i.created === "number"
            ? i.created
            : (i.isoDate ? Math.floor(new Date(i.isoDate).getTime() / 1000) : undefined),
        })),
      },
    } as { rss: { items: Blog[] } };

    return normalized;

  } catch (e) {

    console.error("[BLOG] Error fetching Blog feed:", e);
    return fallback;

  } finally {

    clearTimeout(timeout);
  }
}

function extractFirstImage(html: string | undefined): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(div|li|ul|p)>/gi, "\n")
    .replace(/<li>/gi, "  • ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncate(s: string, n = 220) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function formatDate(ts?: number) {
  if (!ts) return "";
  try {
    return new Date(ts * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default async function Page() {
  const blogFeed = await getCreaiveBlogs();
  const items = blogFeed.rss.items;

  // console.log(items)

  return (
    <Container>
      <div className="pt-[8vh]">
        <div className="grid grid-cols-1 gap-4 p-0 text-start lg:grid-cols-3 xl:grid-cols-3">
          {items.length > 0 ? (
            items.map((item: Blog, index: number) => {
              const html = item.content_encoded || item.content || "";
              const image = extractFirstImage(html);
              const content = truncate(stripHtml(html));
              const dateStr = formatDate(item.created);

              return (
                <article
                  key={item.id || index}
                  className="relative col-span-1 min-h-[400px] max-h-[520xp] lg:max-h-[480xp] overflow-hidden rounded-[10px] border border-grayDefaultDark-400 text-white lg:max-h-[60vh] lg:min-h-[35vh] xl:max-h-[40vh] xl:min-h-[20vh]"
                >
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      className="max-h-[200px] w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="p-4">
                    {dateStr && (
                      <div className="mb-2 text-xs text-slate-400">{dateStr}</div>
                    )}
                    <h2 className="text-[22px] font-bold leading-6 text-primary-500 lg:text-[28px] xl:text-[22px]">
                      {item.title}
                    </h2>
                    <p className="mt-3 line-clamp-6 text-[14px] text-white/90">{content}</p>
                  </div>

                  <div className="absolute bottom-0 flex h-[40px] w-full justify-end xl:h-[40px]">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary-700 p-2 text-center text-[18px] hover:bg-primary-500"
                    >
                      Read More.
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full">
              <p className="text-white/80">Could not load blog posts. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}