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
  const [featured, ...rest] = items;

  return (
    <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-12 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[130px]" />
        <div className="absolute right-[-6%] top-[35%] h-[420px] w-[420px] rounded-full bg-primary-600/12 blur-[130px]" />
      </div>

      <section className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-6 shadow-[0_26px_100px_rgba(4,14,38,0.45)] md:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-200/80">
          Creaive Journal
        </p>
        <h1 className="bg-gradient-to-r from-primary-500 via-primary-600 to-complementary-500 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl">
          Ideas, Trends, and AI Insights
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
          Explore the latest from our team on generative AI, immersive brand
          experiences, and creative technology.
        </p>
      </section>

      {featured ? (
        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#0f172b]/80">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative h-[260px] lg:h-full">
              {extractFirstImage(featured.content_encoded || featured.content || "") ? (
                <img
                  src={extractFirstImage(
                    featured.content_encoded || featured.content || ""
                  ) as string}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/10 to-white/5 text-2xl font-semibold text-white/60">
                  Featured
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <div className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                  Featured Post
                </div>
                <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-200/90">
                  {truncate(
                    stripHtml(featured.content_encoded || featured.content || ""),
                    320
                  )}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {formatDate(featured.created)}
                </span>
                <a
                  href={featured.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-cyan-200/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-300/20"
                >
                  Read Article
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {rest.length > 0 ? (
            rest.map((item: Blog, index: number) => {
              const html = item.content_encoded || item.content || "";
              const image = extractFirstImage(html);
              const content = truncate(stripHtml(html), 180);
              const dateStr = formatDate(item.created);

              return (
                <article
                  key={item.id || index}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f172b]/75 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40"
                >
                  {image ? (
                    <div className="overflow-hidden border-b border-white/10">
                      <img
                        src={image}
                        alt={item.title}
                        className="h-[200px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="p-4">
                    {dateStr ? (
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                        {dateStr}
                      </div>
                    ) : null}
                    <h3 className="text-xl font-semibold leading-7 text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 line-clamp-5 text-sm leading-7 text-slate-200/90">
                      {content}
                    </p>
                  </div>

                  <div className="px-4 pb-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/[0.12]"
                    >
                      Read More
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-white/10 bg-[#0f172b]/70 p-6">
              <p className="text-white/80">
                Could not load blog posts. Please try again later.
              </p>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
