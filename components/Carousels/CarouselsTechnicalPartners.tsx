"use client";
import React from "react";
import { Carousel } from "@material-tailwind/react";

type Props = {
  img: string;
};

const Card = ({ img }: Props) => {
  return (
    <div className="flex gap-4 mr-4">
      <div className="flex flex-col justify-center items-center rounded-[20px] shadow-lg w-full h-[100px]">
        <div className="">
          <img
            className="w-[60%] m-auto rounded-[20px] "
            // {`/{img}`}
            src={`${img}`}
            alt="Placeholder"
          />
        </div>
      </div>
    </div>
  );
};

const CarouselsTechnicalPartners: React.FC = ({}) => {
  return (
    <Carousel
      prevArrow={() => false}
      nextArrow={() => false}
      autoplay={true}
      navigation={() => false}
      loop={true}
      autoplayDelay={5000}
      transition={{ duration: 5 }}
      className="xl:w-[500px] no-scrollbar gradienL2R m-auto"
    >
      <Card img="/partners/Partners Logo 01.png" />
      <Card img="/partners/Partners Logo 02.png" />
      <Card img="/partners/Partners Logo 03.png" />
      <Card img="/partners/Partners Logo 04.png" />
      <Card img="/partners/Partners Logo 05.png" />
      <Card img="/partners/Partners Logo 06.png" />
      <Card img="/partners/Partners Logo 07.png" />
      <Card img="/partners/Partners Logo 08.png" />
      {/* <Card img="/partners/Partners Logo 09.png" /> */}
      <Card img="/partners/Partners Logo 10.png" />
      <Card img="/partners/Partners Logo 11.png" />
      <Card img="/partners/Partners Logo 12.png" />
    </Carousel>
  );
};

export default CarouselsTechnicalPartners;
