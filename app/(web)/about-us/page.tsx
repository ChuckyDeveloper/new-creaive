import type { Metadata } from "next";
import Image from "next/image";
import { SlArrowRight } from "react-icons/sl";

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
      "We create AI Influencers, AI Chatbots, and AI Doubles that replicate real people with astonishing accuracy. Whether you need a digital spokesperson or a virtual assistant, our AI humans can enhance your brand's presence.",
  },
  {
    title: "Operational AI",
    image: "/img/About Us - Operational AI.png",
    description:
      "Our generative AI tools produce high-quality content in multiple formats including images, videos, audio, vision, speech, and translation. This technology allows businesses to generate captivating content efficiently.",
  },
  {
    title: "AI Microsites",
    image: "/img/About Us - Microsite.png",
    description:
      "Designed for customer engagement, our AI microsites provide brands with valuable insights into customer behavior. These dynamic interactive platforms help drive engagement and gather critical data.",
  },
  {
    title: "HOLOVUE",
    image: "/img/About Us - Holovue.png",
    description:
      "Cutting-edge display technology delivers stunning 3D holographic output that brings your ideas to life, creating immersive and captivating experiences for events, exhibitions, and retail environments.",
  },
];

export default function Page() {
  return (
    <Container className="relative mx-auto w-full max-w-[1280px] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[120px]" />
        <div className="absolute right-[-8%] top-[45%] h-[360px] w-[360px] rounded-full bg-primary-600/10 blur-[120px]" />
      </div>

      <section className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-6 shadow-[0_24px_90px_rgba(3,14,38,0.45)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-200/80">Company Story</p>
            <h1 className="bg-gradient-to-r from-primary-500 via-primary-600 to-complementary-500 bg-clip-text text-5xl font-black leading-tight text-transparent md:text-6xl xl:text-7xl">
              ABOUT US
            </h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#10182c]/70 p-5 text-base leading-8 text-slate-100/90 md:text-lg md:leading-9">
            <p>
              Welcome to <span className="font-semibold text-white">CREaiVE</span>, where creativity meets the cutting edge of AI technology.
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-5xl text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
          We are a generative AI lab that specializes in making content for any creative function. Our cutting-edge solutions are designed to revolutionize creativity and streamline operational workflows by integrating AI directly into the creative process.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-[#0f172b]/80 p-6 backdrop-blur md:p-8">
          <div className="mb-5 flex items-center gap-4">
            <Image src="/Vision.png" alt="Vision" width={72} height={72} className="h-14 w-14 md:h-[72px] md:w-[72px]" />
            <h2 className="text-3xl font-semibold tracking-wide text-cyan-100 md:text-5xl">VISION</h2>
          </div>
          <p className="text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
            Our vision is to be the global leader in AI-driven creativity, shaping the future of content production for brands, agencies, and creators alike. We envision a world where AI and human creativity work hand-in-hand, enabling limitless possibilities in content creation.
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-[#10172a]/80 p-6 backdrop-blur md:p-8">
          <div className="mb-5 flex items-center gap-4">
            <Image src="/Mission.png" alt="Mission" width={72} height={72} className="h-14 w-14 md:h-[72px] md:w-[72px]" />
            <h2 className="text-3xl font-semibold tracking-wide text-cyan-100 md:text-5xl">MISSION</h2>
          </div>
          <p className="text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
            At CREaiVE, our mission is to empower brands and agencies by integrating AI into their creative operations. We aim to streamline content production, reduce inefficiencies, and drive innovation through generative AI technology.
          </p>
        </article>
      </section>

      <section className="mt-14 rounded-[30px] border border-white/10 bg-gradient-to-b from-[#0f1628] to-[#0a0f1a] p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <h2 className="bg-gradient-to-r from-primary-500 via-primary-600 to-complementary-500 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl xl:text-7xl">
              PRODUCTS OVERVIEW
            </h2>
            <p className="mt-3 text-xl font-semibold text-cyan-50 md:text-2xl">Making ideas come alive with AI</p>
          </div>
          <p className="text-sm leading-8 text-slate-200/90 md:text-base md:leading-9">
            <span className="font-semibold text-white">CREAIVE, where creativity and AI converge.</span> We deliver generative AI products that transform how brands build content, engage audiences, and run creative operations at scale.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {productCards.map((card) => (
            <article key={card.title} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.06]">
              <h3 className="text-center text-2xl font-semibold italic text-primary-500">{card.title}</h3>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={720}
                  height={520}
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="my-4 flex justify-center text-complementary-500">
                <SlArrowRight size={36} className="rotate-90" />
              </div>
              <p className="text-sm leading-7 text-slate-200/90">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
