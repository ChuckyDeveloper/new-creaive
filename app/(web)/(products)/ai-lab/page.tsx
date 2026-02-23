import type { Metadata } from "next";
import Container from "../../../../components/layout/containerPage";

export const metadata: Metadata = {
  title: "AI Lab — Creaive.ai",
  openGraph: { title: "AI Lab — Creaive.ai" },
};

/* ─── data ──────────────────────────────────────────────────────────── */
const DEMOS = [
  {
    title: "Text to Image",
    video: "/videos/text2image.mp4",
    description:
      "Generate stunning visuals from simple text prompts — transforming ideas into imagery in seconds.",
  },
  {
    title: "Text to Video",
    video: "/videos/Text To VDO.mp4",
    description:
      "Turn written scripts into dynamic video content, accelerating production workflows.",
  },
  {
    title: "Image to Image",
    video: "/videos/Image To Image.mp4",
    description:
      "Transform existing images into entirely new styles, compositions, or variations.",
  },
  {
    title: "Image to Video & 3D Animation",
    video: "/videos/Image to Video-3D Animation.mp4",
    description:
      "Bring static images to life with motion and depth through AI-powered animation.",
  },
  {
    title: "AI Voice & Sound Generation",
    video: "/videos/AI Voice and Sound Generation.mp4",
    description:
      "Produce natural voiceovers, sound effects, and audio content from text or voice commands.",
  },
  {
    title: "AI Element",
    video: "/videos/AI Element.mp4",
    description:
      "Generate graphic elements, overlays, and design assets on demand with generative AI.",
  },
];

/* ─── Section badge (reusable) ──────────────────────────────────────── */
function SectionBadge({
  label,
  color = "primary",
}: {
  label: string;
  color?: "primary" | "complementary";
}) {
  const dot = color === "primary" ? "bg-primary-400" : "bg-complementary-400";
  const text =
    color === "primary" ? "text-primary-300" : "text-complementary-300";
  const border =
    color === "primary"
      ? "border-primary-500/20 bg-primary-500/[0.06]"
      : "border-complementary-500/20 bg-complementary-500/[0.06]";

  return (
    <div
      className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${border}`}
    >
      <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dot}`} />
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${text}`}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function AiLabPage() {
  return (
    <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full bg-primary-500/[0.08] blur-[160px]" />
        <div className="absolute -right-32 top-[30%] h-[500px] w-[500px] rounded-full bg-complementary-500/[0.06] blur-[140px]" />
        <div className="absolute bottom-[15%] left-[30%] h-[400px] w-[400px] rounded-full bg-primary-600/[0.05] blur-[120px]" />
      </div>

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent shadow-2xl backdrop-blur-sm">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full border border-primary-500/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-[240px] w-[240px] rounded-full border border-complementary-500/10" />

        {/* Text content */}
        <div className="relative z-10 px-8 pt-10 text-center md:px-12 md:pt-14 lg:pt-16">
          <SectionBadge label="Creative Engine" />

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              AI{" "}
            </span>
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
              Lab
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300/90 md:text-lg md:leading-9">
            Redefining content creation — our generative AI tools produce
            high-quality content in various formats including images, videos,
            audio, vision, speech, and translation, allowing businesses to
            generate captivating content efficiently.
          </p>
        </div>

        {/* Hero video */}
        <div className="relative z-10 mt-8 px-6 pb-8 md:px-10 md:pb-10">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_20px_80px_-12px_rgba(120,42,144,0.2)]">
            <video
              loop
              muted
              autoPlay
              playsInline
              preload="none"
              className="w-full"
            >
              <source src="/videos/AI Lab.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BANNER
      ═══════════════════════════════════════════════ */}
      <section className="mt-16">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ai-humans-page/AI Humans Banner-04.png"
            alt="AI Generated Content showcase"
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AI-GENERATED CONTENT — Demo grid
      ═══════════════════════════════════════════════ */}
      <section className="mt-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge label="Capabilities" color="complementary" />
          <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              AI-Generated{" "}
            </span>
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
              Content
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 md:text-lg">
            From text to image, video, 3D animation, and sound — explore the
            full spectrum of generative AI content creation.
          </p>
        </div>

        {/* Demo cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((demo, i) => (
            <article
              key={demo.title}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0a0f1a]/80 transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] hover:shadow-[0_20px_60px_-12px_rgba(120,42,144,0.15)]"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/10 to-complementary-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Number watermark */}
              <span className="absolute right-4 top-3 text-[56px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-white/[0.06]">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Video */}
              <div className="relative overflow-hidden">
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src={demo.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-5 pt-4">
                <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-primary-300">
                  {demo.title}
                </h3>
                <div className="my-3 h-px w-10 bg-gradient-to-r from-primary-500/50 to-transparent transition-all duration-500 group-hover:w-16 group-hover:from-complementary-500/60" />
                <p className="text-[13px] leading-7 text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {demo.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-r from-primary-500/[0.08] via-[#0f172b] to-complementary-500/[0.08] p-10 text-center md:p-16">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-primary-500/[0.08] blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-complementary-500/[0.08] blur-[100px]" />

          <div className="relative">
            <h3 className="text-3xl font-black text-white md:text-4xl">
              Ready to Supercharge Your{" "}
              <span className="bg-gradient-to-r from-primary-400 to-complementary-500 bg-clip-text text-transparent">
                Content Creation
              </span>
              ?
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-base text-slate-400 md:text-lg">
              Discover how our AI Lab can transform your creative workflows and
              produce studio-quality content at scale.
            </p>
            <a
              href="/contact-us"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 via-primary-400 to-complementary-500 px-8 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110"
            >
              Request a Demo
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </Container>
  );
}
