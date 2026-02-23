import Image from "next/image";

import Buttons from "../../../../components/Buttons/Button";
import ContactComponant from "../../../../components/Contact/";
import Container from "../../../../components/layout/containerPage";
import GradientSplitHeading from "@/components/ui/Heads/HeadGradient";
import HolovueFunctionAndSpec from "./HolovueFunctionAndSpec";

type VideoTileProps = {
  title?: string;
  video: string;
  className?: string;
};

const immersiveTiles: VideoTileProps[] = [
  {
    title: "Pre-Recorded Content",
    video: "/videos/Snap finger cloth change.mp4",
  },
  {
    title: "Interactive Experience",
    video: "/videos/MAI_holovue_usecase.mp4",
  },
];

const eventTiles: VideoTileProps[] = [
  {
    video: "/videos/!RENDER_FHD_chr2_prob4.mp4",
  },
  {
    video: "/videos/Final_Render_Hakuhodo_4k.mp4",
  },
  {
    video: "/videos/ThaiRat_02_Land2.mp4",
  },
];

function VideoTile({ title, video, className = "" }: VideoTileProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`.trim()}
    >
      <video
        loop
        preload="none"
        muted
        autoPlay
        playsInline
        className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:opacity-100 group-hover:scale-[1.02]"
      >
        <source src={video} type="video/mp4" />
      </video>
      {title ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4 text-base font-medium text-white md:text-lg">
          {title}
        </div>
      ) : null}
    </article>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_30px_100px_rgba(3,15,38,0.5)]">
      <video
        loop
        preload="none"
        muted
        autoPlay
        playsInline
        className="h-[360px] w-full object-cover opacity-35 md:h-[460px] xl:h-[540px]"
      >
        <source src="/mp4/HolovueOpening.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-[#04070fcc] via-[#04070f80] to-transparent" />

      <div className="absolute inset-0 z-10 grid items-center gap-6 px-5 py-8 md:px-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-100/80">
            Immersive Display Platform
          </p>
          <Image
            src="/img/Holovue.png"
            alt="Holovue"
            width={520}
            height={200}
            priority
            className="h-auto w-[260px] md:w-[340px] xl:w-[440px]"
          />
          <p className="mt-5 max-w-xl text-sm leading-8 text-slate-100/90 md:text-base">
            A high-impact holographic experience designed for retail spaces,
            events, and digital activations.
          </p>
          <div className="mt-7 w-full sm:w-[240px]">
            <Buttons
              href_="/contact-us"
              text="Request Demo"
              width="w-full"
              height="h-[50px]"
              padding=""
              margin="m-auto"
              bgColor=""
              fontColor="text-[12px] sm:text-[14px] tracking-[0.08em]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-[#0e1628]/70 p-4 md:p-6">
      <GradientSplitHeading
        textBefore="The Future is Holovue"
        textAfter=""
        width="auto"
        subText="Immersive Content, Infinite Possibilities! User Experience Reimagined"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {immersiveTiles.map((tile) => (
          <VideoTile
            key={`${tile.video}-${tile.title}`}
            title={tile.title}
            video={tile.video}
            className="h-[260px] md:h-[320px] xl:h-[380px]"
          />
        ))}
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-[#0e1628]/70 p-4 md:p-6">
      <GradientSplitHeading
        textBefore="Holovue On Events"
        textAfter=""
        width="auto"
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {eventTiles.map((tile) => (
          <VideoTile
            key={tile.video}
            video={tile.video}
            className="h-[220px] md:h-[260px] xl:h-[320px]"
          />
        ))}
      </div>
    </section>
  );
}

function FunctionAndSpecSection() {
  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#0a101d] p-4 md:p-6">
      <GradientSplitHeading
        textBefore="Functions & Specs"
        textAfter=""
        width="auto"
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-10">
        <div className="overflow-hidden rounded-2xl border border-white/10 lg:col-span-4">
          <Image
            src="/Holovue Spec.png"
            alt="Holovue specifications"
            width={900}
            height={1200}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-6">
          <HolovueFunctionAndSpec />
        </div>
      </div>
    </section>
  );
}

function LiveAndCMSSection() {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-2">
      <article className="rounded-[26px] border border-white/10 bg-[#0f172b]/70 p-4 md:p-6">
        <GradientSplitHeading
          textBefore="Live Streaming"
          textAfter=""
          width="auto"
          subText="Live Content Replay & More"
        />
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/Holovue Page-01.png"
            alt="Holovue live streaming"
            width={1400}
            height={860}
            className="h-auto w-full object-cover opacity-90"
            loading="lazy"
          />
        </div>
      </article>

      <article className="rounded-[26px] border border-white/10 bg-[#0f172b]/70 p-4 md:p-6">
        <GradientSplitHeading
          textBefore="Content Management System"
          textAfter=""
          width="auto"
        />
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/Holovue Page-02.png"
            alt="Holovue content management system"
            width={1400}
            height={860}
            className="h-auto w-full object-cover opacity-90"
            loading="lazy"
          />
        </div>
      </article>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mt-12 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#121f3b] to-[#0b1324] px-5 py-8 text-center md:px-8">
      <GradientSplitHeading
        textBefore="Virtual User Engagement"
        textAfter=""
        width="auto"
      />
      <p className="mx-auto mt-2 max-w-3xl text-sm leading-7 text-slate-200/90 md:text-base">
        Bring interactive holographic storytelling to your audience and convert
        attention into measurable engagement.
      </p>
      <div className="mx-auto mt-7 w-full sm:w-[240px]">
        <Buttons
          href_="/contact-us"
          text="Request A Demo"
          width="w-full"
          height="h-[50px]"
          padding=""
          margin="m-auto"
          bgColor=""
          fontColor="text-[12px] sm:text-[14px] tracking-[0.08em]"
        />
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="relative overflow-hidden pt-[8vh] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[150px]" />
        <div className="absolute right-[-10%] top-[36%] h-[420px] w-[420px] rounded-full bg-primary-600/10 blur-[130px]" />
      </div>

      <Container className="w-full h-auto relative max-w-[1280px] 2xl:max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <ExperienceSection />
        <EventsSection />
        <FunctionAndSpecSection />
        <LiveAndCMSSection />
        <CTASection />
        {/* <div className="mt-12">
          <ContactComponant title="Contact for Holovue" />
        </div> */}
      </Container>
    </div>
  );
}
