"use client";
import React from "react";
import { Carousel } from "@material-tailwind/react";

import type { CarouselProps } from "@material-tailwind/react";

const CarouselsRealWord: React.FC<CarouselProps> = ({ children }) => {
  return (
    <Carousel
      prevArrow={() => false}
      nextArrow={() => false}
      autoplay={true}
      loop={true}
      autoplayDelay={10000}
      transition={{ duration: 10 }}
      className="rounded-[20px] h-auto xl:max-h-[600px] scroll-smooth focus:scroll-auto relative"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div
          // className=" bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2 "
          key={length}
        >
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      placeholder={undefined}
      onPointerEnterCapture={() => undefined}
      onPointerLeaveCapture={undefined}
    >
      {children}
    </Carousel>
  );
};

export default CarouselsRealWord;
