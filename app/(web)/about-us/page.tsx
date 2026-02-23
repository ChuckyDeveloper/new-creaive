import type { Metadata } from "next";
import Image from "next/image";

import Container from "../../../components/layout/containerPage";

export const metadata: Metadata = {
  title: "About Us Creaive.ai",
  openGraph: {
    title: "About Us Creaive.ai",
  },
};

const productCards = [
  {
    title: "AI Humans",
    image: "/img/About Us - AI Humans.png",
    description:
      "AI Influencers, AI Chatbots, and AI Doubles that replicate real people with astonishing accuracy — enhancing your brand's presence with digital spokespersons and virtual assistants.",
    accent: "from-purple-500/20 to-primary-500/20",
    number: "01",
  },
  {
    title: "Operational AI",
    image: "/img/About Us - Operational AI.png",
    description:
      "Generative AI tools producing high-quality content across images, videos, audio, vision, speech, and translation — enabling brands to create captivating content at scale.",
    accent: "from-blue-500/20 to-cyan-500/20",
    number: "02",
  },
  {
    title: "AI Microsites",
    image: "/img/About Us - Microsite.png",
    description:
      "Dynamic interactive platforms designed for customer engagement, providing brands with valuable behavioral insights while driving meaningful connections.",
    accent: "from-complementary-500/20 to-emerald-500/20",
    number: "03",
  },
  {
    title: "HOLOVUE",
    image: "/img/About Us - Holovue.png",
    description:
      "Cutting-edge 3D holographic display technology that brings ideas to life, creating immersive experiences for events, exhibitions, and retail environments.",
    accent: "from-pink-500/20 to-primary-500/20",
    number: "04",
  },
];

export default function Page() {
  return (
    <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-20 h-[600px] w-[600px] rounded-full bg-primary-500/[0.08] blur-[160px]" />
        <div className="absolute -right-32 top-[30%] h-[500px] w-[500px] rounded-full bg-complementary-500/[0.06] blur-[140px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-primary-600/[0.05] blur-[120px]" />
      </div>

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-8 shadow-2xl backdrop-blur-sm md:p-12 lg:p-16">
        {/* Inner decorative rings */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full border border-primary-500/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-[240px] w-[240px] rounded-full border border-complementary-500/10" />

        <div className="relative grid gap-10 lg:grid-cols-5 lg:items-center">
          {/* Left — Title */}
          <div className="lg:col-span-3">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/[0.06] px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-300">
                Our Story
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Where{" "}
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
                Creativity
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Meets{" "}
              </span>
              <span className="bg-gradient-to-r from-complementary-400 to-complementary-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300/90 md:text-lg md:leading-9">
              We are a generative AI lab that specializes in making content for
              any creative function — revolutionizing creativity and
              streamlining workflows by integrating AI directly into the
              creative process.
            </p>
          </div>

          {/* Right — Hero image */}
          <div className="relative lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
              <Image
                src="/img/About Us - Main.png"
                alt="CREAiVE About Us"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/[0.08] bg-[#0a0e18]/90 px-5 py-3 backdrop-blur-xl md:-bottom-5 md:-left-6">
              <p className="text-2xl font-black text-white md:text-3xl">
                CREAiVE
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-complementary-500">
                Generative AI Lab
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VISION & MISSION
      ═══════════════════════════════════════════════ */}
      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        {/* Vision */}
        <article className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#0f172b]/90 to-[#0a0f1a]/90 p-8 backdrop-blur transition-all duration-500 hover:border-primary-500/20 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-primary-500/[0.06] blur-[80px] transition-all duration-700 group-hover:bg-primary-500/[0.12]" />

          <div className="relative">
            <div className="mb-6 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-primary-500/[0.08] md:h-20 md:w-20">
                <Image
                  src="/Vision.png"
                  alt="Vision"
                  width={48}
                  height={48}
                  className="h-10 w-10 md:h-12 md:w-12"
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-400/60">
                  Our
                </p>
                <h2 className="text-3xl font-black tracking-wide text-white md:text-4xl">
                  VISION
                </h2>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-primary-500/30 via-primary-500/10 to-transparent" />

            <p className="mt-6 text-sm leading-8 text-slate-300/90 md:text-base md:leading-9">
              To be the global leader in AI-driven creativity, shaping the
              future of content production for brands, agencies, and creators
              alike. We envision a world where AI and human creativity work
              hand-in-hand, enabling limitless possibilities in content
              creation.
            </p>
          </div>
        </article>

        {/* Mission */}
        <article className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#0f172b]/90 to-[#0a0f1a]/90 p-8 backdrop-blur transition-all duration-500 hover:border-complementary-500/20 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-complementary-500/[0.06] blur-[80px] transition-all duration-700 group-hover:bg-complementary-500/[0.12]" />

          <div className="relative">
            <div className="mb-6 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-complementary-500/20 bg-complementary-500/[0.08] md:h-20 md:w-20">
                <Image
                  src="/Mission.png"
                  alt="Mission"
                  width={48}
                  height={48}
                  className="h-10 w-10 md:h-12 md:w-12"
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-complementary-500/60">
                  Our
                </p>
                <h2 className="text-3xl font-black tracking-wide text-white md:text-4xl">
                  MISSION
                </h2>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-complementary-500/30 via-complementary-500/10 to-transparent" />

            <p className="mt-6 text-sm leading-8 text-slate-300/90 md:text-base md:leading-9">
              To empower brands and agencies by integrating AI into their
              creative operations. We aim to streamline content production,
              reduce inefficiencies, and drive innovation through generative AI
              technology — making world-class creativity accessible to all.
            </p>
          </div>
        </article>
      </section>

      {/* ═══════════════════════════════════════════════
          PRODUCTS OVERVIEW
      ═══════════════════════════════════════════════ */}
      <section className="mt-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-complementary-500/20 bg-complementary-500/[0.06] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-complementary-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-complementary-300">
              What We Build
            </span>
          </div>
          <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Products{" "}
            </span>
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
              Overview
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 md:text-lg">
            Making ideas come alive with AI — delivering generative AI products
            that transform how brands build content and engage audiences.
          </p>
        </div>

        {/* Product cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0a0f1a]/80 transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] hover:shadow-[0_20px_60px_-12px_rgba(120,42,144,0.15)]"
            >
              {/* Card accent glow */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              {/* Number watermark */}
              <span className="absolute right-4 top-3 text-[64px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-white/[0.06]">
                {card.number}
              </span>

              {/* Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={720}
                  height={520}
                  className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-5 pt-4">
                <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-primary-300">
                  {card.title}
                </h3>
                <div className="my-3 h-px w-10 bg-gradient-to-r from-primary-500/50 to-transparent transition-all duration-500 group-hover:w-16 group-hover:from-complementary-500/60" />
                <p className="text-[13px] leading-7 text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {card.description}
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
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-primary-400 to-complementary-500 bg-clip-text text-transparent">
                Creative Workflow
              </span>
              ?
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-base text-slate-400 md:text-lg">
              Let&apos;s explore how CREAiVE can elevate your brand with
              AI-powered solutions.
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
