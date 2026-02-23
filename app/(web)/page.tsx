import dynamic from "next/dynamic";

import ContactComponant from "@/components/Contact";
import ContainerPage from "@/components/layout/containerPage";
import FecilitateComponent from "@/components/Scheduler";

/* ── Above-the-fold: load immediately ── */
const AnimatedBackground = dynamic(
  () => import("@/components/AnimateBackground"),
  { ssr: false },
);

/* ── Below-the-fold: skeleton placeholders ── */
const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

const RealWorldCase = dynamic(
  () => import("@/components/ui/landingPage").then((m) => m.RealWorldCase),
  {
    ssr: false,
    loading: () => (
      <div className={`h-[420px] rounded-2xl bg-white/[0.02] ${shimmer}`} />
    ),
  },
);

const OurProducts = dynamic(
  () => import("@/components/ui/landingPage").then((m) => m.OurProducts),
  {
    ssr: false,
    loading: () => (
      <div className={`h-[320px] rounded-2xl bg-white/[0.02] ${shimmer}`} />
    ),
  },
);

const TrustedBy = dynamic(
  () => import("@/components/ui/landingPage").then((m) => m.TrustedBy),
  {
    ssr: false,
    loading: () => (
      <div className={`h-[260px] rounded-2xl bg-white/[0.02] ${shimmer}`} />
    ),
  },
);

const OurUseCases = dynamic(
  () => import("@/components/ui/landingPage").then((m) => m.OurUseCases),
  {
    ssr: false,
    loading: () => (
      <div className={`h-[300px] rounded-2xl bg-white/[0.02] ${shimmer}`} />
    ),
  },
);

const OurTechPartners = dynamic(
  () => import("@/components/ui/landingPage").then((m) => m.OurTechPartners),
  {
    ssr: false,
    loading: () => (
      <div className={`h-[260px] rounded-2xl bg-white/[0.02] ${shimmer}`} />
    ),
  },
);

/* ── Accent divider variants ── */
function SectionDivider({
  variant = "default",
}: {
  variant?: "default" | "glow" | "dots";
}) {
  if (variant === "glow") {
    return (
      <div className="relative my-20 md:my-28 flex items-center justify-center">
        <div className="absolute h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        <div className="relative flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary-500/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary-400/60 shadow-[0_0_12px_rgba(120,42,144,0.5)]" />
          <div className="h-1 w-1 rounded-full bg-primary-500/40" />
        </div>
      </div>
    );
  }
  if (variant === "dots") {
    return (
      <div className="relative my-20 md:my-28 flex items-center justify-center gap-3">
        <div className="h-1 w-1 rounded-full bg-white/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-complementary-500/50 shadow-[0_0_10px_rgba(71,194,203,0.3)]" />
        <div className="h-1 w-1 rounded-full bg-white/10" />
      </div>
    );
  }
  return (
    <div className="relative my-20 md:my-28 flex items-center justify-center">
      <div className="absolute h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative h-1.5 w-1.5 rounded-full bg-complementary-500/60 shadow-[0_0_12px_rgba(71,194,203,0.4)]" />
    </div>
  );
}

/* ── Section heading helper ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-complementary-500/60" />
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ── Ambient glow (fixed, GPU-composited) ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(71,194,203,0.08)_0%,transparent_70%)]" />
        <div className="absolute right-[-10%] top-[35%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(120,42,144,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(71,194,203,0.05)_0%,transparent_70%)]" />
      </div>

      {/* ── Grain texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <main className="relative z-10">
        {/* ══════════  HERO  ══════════ */}
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
          <section className="reveal-section group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] shadow-2xl backdrop-blur-[2px] transition-all duration-700 hover:border-white/[0.1] hover:shadow-primary-500/[0.05]">
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-complementary-500/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            {/* <FecilitateComponent /> */}
            <AnimatedBackground />
          </section>
        </ContainerPage>
        <SectionDivider variant="glow" />
        ══════════ SHOWCASE ══════════
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="reveal-section space-y-16 md:space-y-20">
            <SectionLabel>Showcase</SectionLabel>
            <RealWorldCase />
          </section>
        </ContainerPage>
        <SectionDivider variant="dots" />
        {/* ══════════  PRODUCTS  ══════════ */}
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="reveal-section">
            <SectionLabel>Our Products</SectionLabel>
            <OurProducts />
          </section>
        </ContainerPage>
        <SectionDivider />
        {/* ══════════  TRUSTED BY  ══════════ */}
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="reveal-section group relative overflow-hidden rounded-3xl border border-white/[0.04] bg-gradient-to-b from-white/[0.025] to-white/[0.01] p-6 md:p-10 backdrop-blur-[2px] transition-all duration-500 hover:border-white/[0.08]">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <TrustedBy />
          </section>
        </ContainerPage>
        <SectionDivider variant="glow" />
        {/* ══════════  USE CASES  ══════════ */}
        <section className="reveal-section relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-full w-full max-w-5xl -translate-x-1/2 bg-gradient-to-b from-primary-600/[0.06] via-primary-500/[0.03] to-transparent blur-3xl" />
          </div>
          <SectionLabel>Use Cases</SectionLabel>
          <OurUseCases />
        </section>
        <SectionDivider variant="dots" />
        {/* ══════════  TECH PARTNERS  ══════════ */}
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="reveal-section group relative overflow-hidden rounded-3xl border border-white/[0.04] bg-gradient-to-b from-white/[0.025] to-transparent p-6 md:p-10 backdrop-blur-[2px] transition-all duration-500 hover:border-white/[0.08]">
            <SectionLabel>Partners</SectionLabel>
            <OurTechPartners />
          </section>
        </ContainerPage>
        <SectionDivider variant="glow" />
        {/* ══════════  CONTACT  ══════════ */}
        <ContainerPage className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-0 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <section className="reveal-section group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-primary-600/[0.06] via-primary-500/[0.02] to-transparent p-6 md:p-10 backdrop-blur-[2px] transition-all duration-500 hover:border-primary-500/[0.12]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary-500/[0.08] blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-complementary-500/[0.06] blur-[60px]" />

            <div className="relative mb-8 text-center">
              <SectionLabel>Contact</SectionLabel>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to Get{" "}
                <span className="bg-gradient-to-r from-primary-400 to-complementary-400 bg-clip-text text-transparent">
                  Started?
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/40">
                Let&apos;s discuss how our AI-powered creative solutions can
                transform your business.
              </p>
            </div>

            <ContactComponant title="Contact Us" />
          </section>
        </ContainerPage>
      </main>
    </>
  );
}
