"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { CarouselsPreviewRola } from "../../../../components/Carousels/Carousels";
import ContactComponant from "../../../../components/Contact/";
import Container from "../../../../components/layout/containerPage";

/* ─── data ──────────────────────────────────────────────────────────── */
const AI_MODELS = [
  { name: "NISA", image: "/ai-humans/Nisa001.png", role: "AI Influencer" },
  { name: "NIC", image: "/ai-humans/Nic0011.png", role: "AI Presenter" },
  { name: "AMBER", image: "/ai-humans/Amber004.png", role: "AI Ambassador" },
  { name: "ADEN", image: "/ai-humans/Aden004.png", role: "AI Spokesperson" },
  { name: "ALICE", image: "/ai-humans/Alice004.png", role: "AI Assistant" },
  { name: "JANE", image: "/ai-humans/Jane001.png", role: "AI Host" },
  { name: "GRANDMA", image: "/ai-humans/Grandma001.png", role: "AI Character" },
  { name: "GRANDPA", image: "/ai-humans/Grandpa001.png", role: "AI Character" },
  { name: "LEO", image: "/ai-humans/Leo001.png", role: "AI Presenter" },
];

const BANNER_IMAGES = [
  "/ai-humans-page/AI Humans Banner-01.png",
  "/ai-humans-page/AI Humans Banner-02.png",
  "/ai-humans-page/AI Humans Banner-03.png",
  "/ai-humans-page/AI Humans Banner-05.png",
];

const MOSAIC_IMAGES = [
  "ai-models/Aden 01.jpg",
  "ai-models/Alice 03.jpg",
  "ai-models/Amber 02.jpg",
  "ai-models/NIC 01.jpg",
  "ai-models/NISA 04.jpg",
  "ai-models/Jane 02.jpg",
  "ai-models/Jack 03.jpg",
  "ai-models/Grandpa 01.jpg",
  "ai-models/Aden 04.jpg",
  "ai-models/Alice 05.jpg",
  "ai-models/Amber 04.jpg",
  "ai-models/NIC 05.jpg",
  "ai-models/NISA 02.jpg",
  "ai-models/Jane 04.jpg",
  "ai-models/Jack 01.jpg",
  "ai-models/Aden 06.jpg",
  "ai-models/Alice 01.jpg",
  "ai-models/Amber 06.jpg",
  "ai-models/NIC 07.jpg",
  "ai-models/NISA 06.jpg",
  "ai-models/Jane 06.jpg",
  "ai-models/Jack 05.jpg",
  "ai-models/Grandpa 03.jpg",
  "ai-models/NIC 03.jpg",
];

/* ─── Hero mosaic background ────────────────────────────────────────── */
function HeroMosaic() {
  const [shuffled, setShuffled] = useState<string[]>([]);

  useEffect(() => {
    const arr = [...MOSAIC_IMAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, []);

  if (!shuffled.length) return null;

  return (
    <div className="absolute inset-0 -z-10 grid grid-cols-4 gap-1 p-1 opacity-[0.15] sm:grid-cols-6 lg:grid-cols-8">
      {shuffled.map((src, i) => (
        <div key={i} className="relative overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#050810]/40 to-[#050810]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/60 via-transparent to-[#050810]/60" />
    </div>
  );
}

/* ─── Section badge ─────────────────────────────────────────────────── */
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
export default function AiHumansPage() {
  return (
    <div className="relative text-white">
      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <HeroMosaic />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
          <div className="absolute left-1/2 top-[20%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-500/[0.1] blur-[160px]" />
          <div className="absolute -right-20 bottom-[10%] h-[400px] w-[400px] rounded-full bg-complementary-500/[0.07] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center sm:px-6">
          <SectionBadge label="AI Technology" />

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl xl:text-8xl">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              AI{" "}
            </span>
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
              Humans
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300/90 md:text-lg md:leading-9">
            Giving life to AI — craft influencers, brand ambassadors, chatbots,
            or even clones that embody the essence of real people with
            remarkable precision.
          </p>

          {/* Decorative hero image */}
          <div className="relative mx-auto mt-10 max-w-xs">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-primary-500/20 to-complementary-500/20 blur-3xl" />
            <Image
              src="/Source 08.png"
              alt="AI Humans"
              width={400}
              height={400}
              className="relative mx-auto w-full drop-shadow-[0_0_60px_rgba(120,42,144,0.3)]"
              priority
            />
          </div>
        </div>
      </section>

      <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 text-white sm:px-6 lg:px-8">
        {/* Ambient glows for body */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-[20%] h-[600px] w-[600px] rounded-full bg-primary-500/[0.05] blur-[160px]" />
          <div className="absolute -right-32 top-[55%] h-[500px] w-[500px] rounded-full bg-complementary-500/[0.04] blur-[140px]" />
        </div>

        {/* ═══════════════════════════════════════════════
            AI BRAND AMBASSADOR — Banners
        ═══════════════════════════════════════════════ */}
        <section className="mt-8">
          <div className="text-center">
            <SectionBadge label="Use Case" color="complementary" />
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                AI Brand{" "}
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
                Ambassador
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 md:text-lg">
              Elevate your brand with AI-powered ambassadors that deliver
              consistent, engaging experiences at any scale.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {BANNER_IMAGES.map((src, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-500 hover:border-white/[0.12]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`AI Brand Ambassador showcase ${i + 1}`}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            PREVIEW CAROUSEL
        ═══════════════════════════════════════════════ */}
        <section className="mt-24">
          <div className="text-center">
            <SectionBadge label="Gallery" />
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Preview Our{" "}
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
                AI Humans
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 md:text-lg">
              Explore our lineup of AI Humans, ready to elevate your brand and
              revolutionize customer interactions.
            </p>
          </div>

          <div className="mt-10">
            <CarouselsPreviewRola />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            MEET THE AI HUMANS — Character grid
        ═══════════════════════════════════════════════ */}
        <section className="mt-24">
          <div className="text-center">
            <SectionBadge label="Characters" color="complementary" />
            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl xl:text-6xl">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                Meet the{" "}
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-complementary-500 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 md:text-lg">
              Each AI Human is crafted with unique personality, appearance, and
              capabilities to serve diverse brand needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AI_MODELS.map((model) => (
              <article
                key={model.name}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0a0f1a]/80 transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.12] hover:shadow-[0_20px_60px_-12px_rgba(120,42,144,0.15)]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/10 to-complementary-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={model.image}
                    alt={model.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/10 to-transparent" />
                </div>

                {/* Info */}
                <div className="relative -mt-16 px-5 pb-5">
                  <h3 className="text-2xl font-black uppercase tracking-wide text-white">
                    {model.name}
                  </h3>
                  <div className="my-2 h-px w-8 bg-gradient-to-r from-primary-500/60 to-transparent transition-all duration-500 group-hover:w-14 group-hover:from-complementary-500/60" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-complementary-500/70">
                    {model.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CONTACT
        ═══════════════════════════════════════════════ */}
        <section className="mt-24">
          <ContactComponant title="Contact for AI Humans" />
        </section>
      </Container>
    </div>
  );
}
