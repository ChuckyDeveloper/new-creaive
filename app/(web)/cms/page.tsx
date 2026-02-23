import Image from "next/image";

import Buttons from "../../../components/Buttons/Button";
import Container from "../../../components/layout/containerPage";

const features = [
  {
    title: "Fast Publishing",
    description:
      "Create, update, and publish campaign content in minutes with a clean control panel.",
  },
  {
    title: "Team Workflow",
    description:
      "Collaborate across marketing and creative teams with a single source of truth.",
  },
  {
    title: "AI-Ready Structure",
    description:
      "Organize assets for AI agents, chat experiences, and interactive microsites.",
  },
];

export default function Page() {
  return (
    <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-12 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[130px]" />
        <div className="absolute right-[-6%] top-[40%] h-[360px] w-[360px] rounded-full bg-primary-600/12 blur-[120px]" />
      </div>

      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_28px_100px_rgba(4,14,38,0.45)]">
        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-200/80">
              CMS Platform
            </p>
            <h1 className="bg-gradient-to-r from-primary-500 via-primary-600 to-complementary-500 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl">
              Content Management System
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
              Control your digital experience from one place. Manage pages,
              media, products, and branded content with a workflow built for
              speed.
            </p>

            <div className="mt-7 w-full sm:w-[280px]">
              <Buttons
                href_="https://ide.creaive.ai/admin/home"
                text="LET'S TRY OUR CMS"
                width="w-full"
                height="h-[52px]"
                padding=""
                margin="m-auto"
                bgColor=""
                fontColor="text-[13px] sm:text-[14px] tracking-[0.08em]"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172b]/70 p-2">
            <Image
              src="/Holovue Page-03.png"
              alt="CMS dashboard preview"
              width={1280}
              height={780}
              priority
              className="h-auto w-full rounded-xl object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-white/10 bg-[#0f172b]/65 p-5 backdrop-blur"
          >
            <h2 className="text-lg font-semibold text-cyan-100">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-200/90">
              {feature.description}
            </p>
          </article>
        ))}
      </section>
    </Container>
  );
}
