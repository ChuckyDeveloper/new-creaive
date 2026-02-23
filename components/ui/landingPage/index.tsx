"use client";
import {
  CarouselsRealWord,
  CarouselsTechnicalPartners,
  CarouselsUseCases,
} from "../../../components/Carousels/Carousels";
import { CardScreen, CardImage } from "../../../components/Cards";
import { Carousel } from "@material-tailwind/react";
import TopicHeading from "../Heads/HeadLine";
import GradientSplitHeading from "../Heads/HeadGradient";
import Head from "next/head";

export const RealWorldCase = () => {
  return (
    <div className="h-auto relative z-10 lg:m-4 text-white">
      {/* <div>
        <h2 className="w-full text-[28px] md:text-[38px] md:leading-[38px] lg:text-[40px] xl:text-[50px] leading-[30px] lg:leading-[2.9vw] xl:leading-[50px] font-black px-4 font-regular text-center md:text-start lg:text-start uppercase pb-8 font-unitea">
          Real Impact with <br className="hidden md:flex" /><a className="text-primary-600 font-black md:text-[38px] lg:text-[40px] lg:leading-[45px] xl:text-[50px]">generative AI-Driven </a><br className="hidden md:flex" />
          Content & Solutions
        </h2>
      </div> */}
      <TopicHeading />
      <CarouselsRealWord className="w-full h-auto xl:max-h-[800px] absolute z-50">
        <div className="grid grid-cols-2 xl:grid-cols-12 gap-4 items-center text-center xl:mx-2 mx-4">
          <div className="w-full h-[600px] col-span-6 xl:col-span-5 bg-grayDefaultDark-400 rounded-[20px] overflow-hidden">
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
            <div className="grid grid-cols-3 gap-4 max-h-[300px] h-full pb-2">
              <div className="col-span-1 bg-grayDefaultDark-0 rounded-[20px] h-full overflow-hidden">
                <img
                  className="w-full h-full rounded-[20px] object-cover object-top"
                  src={`/ai-models/Aden 03.jpg`}
                  alt="AI Model Aden"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="col-span-2 bg-grayDefaultDark-100 rounded-[20px] h-full overflow-hidden">
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

            <div className="grid grid-cols-3 gap-4 max-h-[300px] h-full pt-2">
              <div className="col-span-2 bg-grayDefaultDark-100 rounded-[20px] h-full overflow-hidden">
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
              <div className="col-span-1 bg-grayDefaultDark-0 rounded-[20px] h-full overflow-hidden">
                <img
                  className="w-full h-full rounded-[20px] object-cover "
                  src={`/ai-models/NIC 01.jpg`}
                  alt="AI Model NIC"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-12 gap-4 items-center text-center xl:mx-2 mx-4">
          <div className="w-full h-[600px] col-span-6 xl:col-span-5 bg-grayDefaultDark-400 rounded-[20px] overflow-hidden">
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
            <div className="grid grid-cols-4 gap-4 max-h-[300px] h-full pb-2">
              <div className="col-span-2 bg-grayDefaultDark-500 rounded-[20px] h-full overflow-hidden">
                <img
                  className="w-full h-full rounded-[20px] object-cover object-center"
                  src={`/ai-models/NISA 02.jpg`}
                  alt="AI Model NISA"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="col-span-2 bg-grayDefaultDark-200 rounded-[20px] h-full overflow-hidden">
                <img
                  className="w-full h-full rounded-[20px] object-cover object-center"
                  src={`/ai-models/Jane 02.jpg`}
                  alt="AI Model Jane"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[300px] h-full pt-2">
              <div className="col-span-2 bg-grayDefaultDark-0 rounded-[20px] h-full overflow-hidden">
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
    <div className="h-auto lg:h-auto xl:h-auto text-white py-8 lg:py-12">
      <GradientSplitHeading align="end" width="auto" />

      <div className="grid grid-cols-1">
        <CardScreen type="Primary" topic="Holovue" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 lg:gap-8 mt-2 h-auto px-4">
        <div className=" w-full h-full text-white mx-2 my-1">
          <CardImage
            text="Ai Humans"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Models.png`}
            href="/ai-humans"
          />
        </div>
        <div className="w-full h-full text-white mx-2 my-1">
          <CardImage
            text="Ai Microsites"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Microsite.png`}
            href="/ai-microsites"
          />
        </div>
        <div className="w-full h-full text-white mx-2 my-1">
          <CardImage
            text="AI lab"
            thums="/BlackWindow.png"
            image={`/Product Banner AI Labs.png`}
            href="/ai-lab"
          />
        </div>
        <div className="w-full h-full text-white mx-2 my-1">
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

export const TrustedBy = () => {
  return (
    <div className="min-h-[40vh] relative rounded-[20px] py-12 lg:py-16">
      <GradientSplitHeading
        textBefore="Trusted by"
        textAfter=""
        align="center"
        width="auto"
      />

      <div className="h-auto ">
        <Carousel
          prevArrow={() => false}
          nextArrow={() => false}
          placeholder={undefined}
          onPointerEnterCapture={() => undefined}
          onPointerLeaveCapture={undefined}
          autoplay={true}
          loop={true}
          autoplayDelay={10000}
          transition={{ duration: 10 }}
          className="hidden xl:flex h-auto xl:max-h-[800px] scroll-smooth focus:scroll-auto bg-grayDefaultDark-300 bg-opacity-20 py-6 gradienL2R bottom-0"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div
              className=" bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2 "
              key={length}
            >
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                    activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          <div className="flex">
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 06.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 07.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 08.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 09.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 10.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 13.png`}
              alt="Placeholder"
            />
            {/* </div>
          <div className="flex"> */}
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 15.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 17.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 01.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 02.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 03.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
              src={`/logos/Customers Logo 04.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 28.png`}
              alt="Placeholder"
            />
          </div>

          <div className="flex">
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 05.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 14.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 16.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 18.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 19.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 20.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 27.png`}
              alt="Placeholder"
            />
            {/* </div>
          <div className="flex"> */}
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 21.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 22.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 23.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 24.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 25.png`}
              alt="Placeholder"
            />
            <img
              className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
              src={`/logos/Customers Logo 26.png`}
              alt="Placeholder"
            />
          </div>
        </Carousel>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 xl:hidden bg-grayDefaultDark-400 bg-opacity-40 mx-4 ">
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] lg:w-[80px] lg:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 06.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 07.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 08.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 09.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 10.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 13.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 15.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 17.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 01.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 02.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 03.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-200 m-auto"
          src={`/logos/Customers Logo 04.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 28.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 05.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 14.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 16.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 18.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 19.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 20.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 27.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 21.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 22.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 23.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 24.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 25.png`}
          alt="Placeholder"
        />
        <img
          className="w-[50px] h-[50px] md:w-[90px] md:h-[90px] xl:w-[80px] xl:h-[80px] rounded-[20px] opacity-50 hover:opacity-100 hover:scale-x-150 hover:scale-y-150 duration-100 m-auto"
          src={`/logos/Customers Logo 26.png`}
          alt="Placeholder"
        />
      </div>
    </div>
  );
};

export const OurUseCases = () => {
  return (
    <div className="max-w-[1440px] m-auto lg:h-auto px-4 text-white ">
      <div className="absolute -z-20 left-0 w-screen h-[80vh] bg-primary-600 gradienB2T"></div>
      <div className="pt-[10vh] pb-[5vh] ">
        <TopicHeading leading="use cases" highlight="" trailing="" />
        <h3 className="text-[14px] lg:text-[3vw] xl:text-[1.3vw] text-start uppercase  px-2">
          Explore real-world customer use cases that showcase how our solutions
          drive <a className="text-complementary-500 font-semibold">success</a>{" "}
          and{" "}
          <a className="text-complementary-500 font-semibold"> innovation </a>{" "}
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
    <div className="pt-8 lg:pt-12 mx-4 text-white">
      <h2 className="text-[28px] md:text-[38px] lg:text-[40px] xl:text-[50px] font-black leading-[6vw] lg:leading-[5vw] text-center lg:text-center uppercase py-8 font-unitea px-2 bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        {/* <div className="text-center lg:text-center items-center justify-center w-full">
          Technical Partners
        </div> */}
        <GradientSplitHeading
          textAfter="Technical Partners"
          textBefore=""
          width="auto"
        />
      </h2>
      {/* <h3 className="text-[1vw] text-end uppercase font-semibold">
        Our tools can be helpful   <br/>
        for your business  <br/>
        and make the impact to   <br/>
        customers interacted make the choices  <br/>
      </h3> */}
      <div className="opacity-100 w-full lg:py-10">
        <CarouselsTechnicalPartners />
      </div>
    </div>
  );
};
