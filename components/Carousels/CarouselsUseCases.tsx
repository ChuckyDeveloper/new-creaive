"use client";
import React from "react";
import { Carousel } from "@material-tailwind/react";
import type { CarouselProps } from "@material-tailwind/react";

const VDOCard = ({ text, vdo }: { text: string; vdo: string }) => {
  return (
    <div className="relative w-full h-[400px] col-span-6 bg-[#121212] rounded-[20px] overflow-hidden">
      <div className="absolute uppercase font-semibold w-full bottom-10 right-0 text-[20px]">
        {text}
      </div>
      <video
        loop
        preload="none"
        muted
        autoPlay
        playsInline
        className="object-cover w-full h-full opacity-60"
      >
        <source src={vdo} type="video/mp4" />
      </video>
    </div>
  );
};

const CarouselsUseCases: React.FC<CarouselProps> = ({ children }) => {
  return (
    <Carousel
      autoplay={true}
      loop={true}
      autoplayDelay={10000}
      transition={{ duration: 4 }}
      className="rounded-[20px] h-auto xl:max-h-[600px] scroll-smooth focus:scroll-auto"
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
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center text-center mx-2">
          <VDOCard text="Social Media Video" vdo="/videos/04.mp4" />
          <VDOCard text="Informational Video" vdo="/videos/01.mp4" />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center text-center mx-2">
          <VDOCard text="Social Media Event" vdo="/videos/IDE_dnn_pre.mp4" />
          <VDOCard
            text="Social Media Event"
            vdo="/videos/MAI_holovue_usecase.mp4"
          />
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselsUseCases;
