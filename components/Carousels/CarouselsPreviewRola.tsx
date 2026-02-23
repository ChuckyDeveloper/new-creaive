"use client";
import React from "react";
import { Carousel } from "@material-tailwind/react";
import type { CarouselProps } from "@material-tailwind/react";

type Props = {
  image: string;
};

const Card = ({ image }: Props) => {
  return (
    <div className="flex mr-1 md:mr-1 h-[80px] w-full xl:h-[290px] rounded-[8px] xl:rounded-[20px] overflow-hidden justify-between">
      <div className="flex flex-col justify-center items-center bg-grayDefaultDark-300 rounded-[2px] md:rounded-[10px] w-full ">
        <img
          src={image}
          alt="Placeholder"
          className="object-fit object-top rounded-[2px] md:rounded-[20px] h-full "
        />
      </div>
    </div>
  );
};


const CarouselsPreviewRola: React.FC = ({ }) => {
  const aimodels = [
    "ai-models/Aden 01.jpg",
    "ai-models/Aden 02.jpg",
    "ai-models/Aden 03.jpg",
    "ai-models/Aden 04.jpg",
    "ai-models/Aden 05.jpg",
    "ai-models/Aden 06.jpg",
    "ai-models/Alice 01.jpg",
    "ai-models/Alice 02.jpg",
    "ai-models/Alice 03.jpg",
    "ai-models/Alice 04.jpg",
    "ai-models/Alice 05.jpg",
    "ai-models/Alice 06.jpg",
    "ai-models/Amber 01.jpg",
    "ai-models/Amber 02.jpg",
    "ai-models/Amber 03.jpg",
    "ai-models/Amber 04.jpg",
    "ai-models/Amber 05.jpg",
    "ai-models/Amber 06.jpg",
    "ai-models/Grandpa 01.jpg",
    "ai-models/Grandpa 02.jpg",
    "ai-models/Grandpa 03.jpg",
    "ai-models/Grandpa 04.jpg",
    "ai-models/Jack 01.jpg",
    "ai-models/Jack 02.jpg",
    "ai-models/Jack 03.jpg",
    "ai-models/Jack 04.jpg",
    "ai-models/Jack 05.jpg",
    "ai-models/Jack 06.jpg",
    "ai-models/Jane 01.jpg",
    "ai-models/Jane 02.jpg",
    "ai-models/Jane 03.jpg",
    "ai-models/Jane 04.jpg",
    "ai-models/Jane 05.jpg",
    "ai-models/Jane 06.jpg",
    "ai-models/NIC 01.jpg",
    "ai-models/NIC 02.jpg",
    "ai-models/NIC 03.jpg",
    "ai-models/NIC 04.jpg",
    "ai-models/NIC 05.jpg",
    "ai-models/NIC 06.jpg",
    "ai-models/NIC 07.jpg",
    "ai-models/NIC 08.jpg",
    "ai-models/NISA 01.jpg",
    "ai-models/NISA 02.jpg",
    "ai-models/NISA 03.jpg",
    "ai-models/NISA 04.jpg",
    "ai-models/NISA 05.jpg",
    "ai-models/NISA 06.jpg",
  ]

  return (
    // children, prevArrow, nextArrow, navigation, autoplay, autoplayDelay, transition, loop, className, slideRef
    <Carousel
      prevArrow={() => false}
      nextArrow={() => false}
      autoplay={true}
      navigation={() => false}
      loop={true}
      autoplayDelay={15000}
      transition={{ duration: 15 }}
      className="max-h-[800px] xl:max-h-[600px] no-scrollbar gradienL2R py-8"
      placeholder={undefined}
      onPointerEnterCapture={() => undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex w-auto">
        <Card image={aimodels[1]} />
        <Card image={aimodels[3]} />
        <Card image={aimodels[13]} />
        <Card image={aimodels[5]} />
        <Card image={aimodels[25]} />
        <Card image={aimodels[9]} />
        <Card image={aimodels[12]} />
        <Card image={aimodels[10]} />
      </div>
      <div className="flex w-auto">
        <Card image={aimodels[4]} />
        <Card image={aimodels[16]} />
        <Card image={aimodels[21]} />
        <Card image={aimodels[22]} />
        <Card image={aimodels[8]} />
        <Card image={aimodels[43]} />
        <Card image={aimodels[42]} />
        <Card image={aimodels[5]} />
        {/* <Card image={aimodels[48]} /> */}
      </div>
      <div className="flex w-auto">
        <Card image={aimodels[6]} />
        <Card image={aimodels[2]} />
        <Card image={aimodels[47]} />
        <Card image={aimodels[41]} />
        <Card image={aimodels[23]} />
        <Card image={aimodels[32]} />
        <Card image={aimodels[31]} />
        <Card image={aimodels[38]} />
      </div>
    </Carousel>
  );
};

export default CarouselsPreviewRola;
