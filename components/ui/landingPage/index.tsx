"use client";
import dynamic from "next/dynamic";
import {
  CarouselsRealWord,
  CarouselsTechnicalPartners,
  CarouselsUseCases,
} from "../../../components/Carousels/Carousels";
import { CardImage } from "../../../components/Cards";
import TopicHeading from "../Heads/HeadLine";
import GradientSplitHeading from "../Heads/HeadGradient";

/* ── Lazy-load CardScreen (pulls in Three.js ~600 KB) ── */
const CardScreen = dynamic(
  () => import("../../../components/Cards/CardsScreen"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white/[0.02]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary-500" />
      </div>
    ),
  },
);

export const RealWorldCase = () => {
  return (
    <div className="h-auto relative z-10 text-white">
      <TopicHeading />
      <CarouselsRealWord className="w-full h-auto xl:max-h-[800px] absolute z-50">
        <div className="grid grid-cols-2 xl:grid-cols-12 gap-3 items-center text-center xl:mx-2 mx-4">
          <div className="w-full h-[600px] col-span-6 xl:col-span-5 bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06]">
            <video
              loop
              preload="none"
              muted
              autoPlay
              playsInline
              controls={false}
              className="w-full h-full object-cover object-top"
            >
              <source
                src={`/videos/Snap finger cloth change.mp4`}
                type="video/mp4"
              />
            </video>
          </div>

          <div className="w-full h-[600px] col-span-6 xl:col-span-7">
            <div className="grid grid-cols-3 gap-3 max-h-[300px] h-full pb-1.5">
              <div className="col-span-1 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <img
                  className="w-full h-full rounded-2xl object-cover object-top"
                  src={`/ai-models/Aden 03.jpg`}
                  alt="Placeholder"
                  loading="lazy"
                />
              </div>

              <div className="col-span-2 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <video
                  loop
                  preload="none"
                  muted
                  autoPlay
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover object-top"
                >
                  <source src={`/videos/03.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-[300px] h-full pt-1.5">
              <div className="col-span-2 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <video
                  loop
                  preload="none"
                  muted
                  autoPlay
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover object-top"
                >
                  <source
                    src={`/videos/AIinfluencerAmbrassador.mp4`}
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="col-span-1 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <img
                  className="w-full h-full rounded-2xl object-cover "
                  src={`/ai-models/NIC 01.jpg`}
                  alt="Placeholder"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-12 gap-3 items-center text-center xl:mx-2 mx-4">
          <div className="w-full h-[600px] col-span-6 xl:col-span-5 bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06]">
            <video
              loop
              preload="none"
              muted
              autoPlay
              playsInline
              controls={false}
              className="w-full h-full object-cover object-top"
            >
              <source src={`/videos/14.mp4`} type="video/mp4" />
            </video>
          </div>

          <div className="w-full h-[600px] col-span-6 xl:col-span-7">
            <div className="grid grid-cols-4 gap-3 max-h-[300px] h-full pb-1.5">
              <div className="col-span-2 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <img
                  className="w-full h-full rounded-2xl object-cover object-center"
                  src={`/ai-models/NISA 02.jpg`}
                  alt="Placeholder"
                  loading="lazy"
                />
              </div>

              <div className="col-span-2 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <img
                  className="w-full h-full rounded-2xl object-cover object-center"
                  src={`/ai-models/Jane 02.jpg`}
                  alt="Placeholder"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[300px] h-full pt-1.5">
              <div className="col-span-2 rounded-2xl h-full overflow-hidden border border-white/[0.06]">
                <video
                  loop
                  preload="none"
                  muted
                  autoPlay
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover object-top"
                >
                  <source src={`/videos/AILAB.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </CarouselsRealWord>
    </div>
  );
};

export const OurProducts = () => {
  return (
    <div className="h-auto text-white">
      <GradientSplitHeading align="end" width="auto" />

      <div className="grid grid-cols-1">
        <CardScreen type="Primary" topic="Holovue" />
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-3 h-auto px-4">
        <div className="w-full h-full text-white">
          <CardImage
            text="Ai Humans"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Models.png`}
            href="/ai-humans"
          />
        </div>
        <div className="w-full h-full text-white">
          <CardImage
            text="Ai Microsites"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Microsite.png`}
            href="/ai-microsites"
          />
        </div>
        <div className="w-full h-full text-white">
          <CardImage
            text="AI lab"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Labs.png`}
            href="/ai-lab"
          />
        </div>
        <div className="w-full h-full text-white">
          <CardImage
            text="AI Chatbot"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Chatbot.png`}
            href="/ai-chatbot"
          />
        </div>
      </div>
    </div>
  );
};

const TRUSTED_LOGOS = [
  "06",
  "07",
  "08",
  "09",
  "10",
  "13",
  "15",
  "17",
  "01",
  "02",
  "03",
  "04",
  "28",
  "05",
  "14",
  "16",
  "18",
  "19",
  "20",
  "27",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
];

export const TrustedBy = () => {
  return (
    <div className="relative py-4">
      <GradientSplitHeading
        textBefore="Trusted by"
        textAfter=""
        align="center"
        width="auto"
      />

      {/* CSS-only infinite marquee */}
      <div className="relative overflow-hidden mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-10 animate-[marquee_40s_linear_infinite] w-max">
          {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((num, i) => (
            <img
              key={i}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200 shrink-0"
              src={`/logos/Customers Logo ${num}.png`}
              alt={`Partner ${num}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const OurUseCases = () => {
  return (
    <div className="max-w-[1440px] 2xl:max-w-[1536px] m-auto lg:h-auto px-4 text-white">
      <div className="absolute -z-20 left-0 w-screen h-[80vh] bg-primary-600 gradienB2T"></div>
      <div className="pt-[10vh] pb-[5vh]">
        <TopicHeading leading="use cases" highlight="" trailing="" />
        <h3 className="text-sm lg:text-base xl:text-lg text-start uppercase px-2 text-white/60 leading-relaxed max-w-3xl">
          Explore real-world customer use cases that showcase how our solutions
          drive{" "}
          <span className="text-complementary-500 font-semibold">success</span>{" "}
          and{" "}
          <span className="text-complementary-500 font-semibold">
            innovation
          </span>{" "}
          across industries
        </h3>
      </div>
      <div>
        <CarouselsUseCases>
          <div></div>
        </CarouselsUseCases>
      </div>
    </div>
  );
};

export const OurTechPartners = () => {
  return (
    <div className="pt-0 mx-4 text-white">
      <GradientSplitHeading
        textAfter="Technical Partners"
        textBefore=""
        width="auto"
      />
      <div className="opacity-100 w-full lg:py-10">
        <CarouselsTechnicalPartners />
      </div>
    </div>
  );
};
