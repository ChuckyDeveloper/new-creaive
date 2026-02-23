"use client";
import React, { useState, useEffect } from "react";
import { CarouselsPreviewRola } from "../../../../components/Carousels/Carousels";
import ContactComponant from "../../../../components/Contact/";
import Container from "../../../..//components/layout/containerPage";

export type Data = {
  // id: null | number,
  img: null | string,
}


const PreviewAiHumans = () => {
  return (
    <div className="p-4 pt-[10vh]">
      <h2 className="col-span-1 lg:col-start-1 text-[6vw] text-center lg:text-[3vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        Preview Our AI Humans
      </h2>
      <h3 className="text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2">Explore our lineup of AI Humans, ready to elevate your brand and revolutionize customer interactions with their lifelike presence and advanced capabilities.</h3>
      <div className="">
        <CarouselsPreviewRola />
      </div>
    </div>
  );
};


const AImodels = () => {
  return (
    <div className="pt-[4vh] px-4">
      <h2 className="col-span-1 lg:col-start-1 text-center text-[6vw] lg:text-[3vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        AI Humans
      </h2>
      <div className="pt-[4vh] grid grid-cols-3 gap-2">
        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Nisa001.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">NISA</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Nic0011.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">NIC</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Amber004.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">AMBER</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Aden004.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">Aden</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Alice004.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">alice</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Jane001.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">Jane</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Grandma001.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">Grandma</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Grandpa001.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">Grandpa</h3>
        </div>

        <div className="col-span-3 lg:col-span-1 w-full pb-[4vh]">
          <img src="/ai-humans/Leo001.png" />
          <h3 className="w-full text-start uppercase text-[30px] font-unitea font-bold">LEO</h3>
        </div>
      </div>
    </div>
  )
}


const AiHumansBackground = ({ img }: { img: string }) => {
  const rows = [];
  const arrayImages = [
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
    // "ai-models/NIC 09.jpg",
    "ai-models/NISA 01.jpg",
    "ai-models/NISA 02.jpg",
    "ai-models/NISA 03.jpg",
    "ai-models/NISA 04.jpg",
    "ai-models/NISA 05.jpg",
    "ai-models/NISA 06.jpg",


  ];

  // const [height, setHeight] = useState(0)
  // const [width, setWidth] = useState(0)
  const [resRows, setResRows] = useState(0);
  let [cardState, setCradState] = useState([])

  const shuffle = (array: string[]) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array
  }

  useEffect(() => {
    setCradState(shuffle(arrayImages))
    const widthx = window.innerWidth;
    const heightx = window.innerHeight;

    console.log(widthx);

    if (widthx < 640) {
      setResRows(1);
    } else if (widthx > 640 && widthx <= 786) {
      //md
      setResRows(12);
    } else if (widthx > 786 && widthx <= 820) {
      //md
      setResRows(16);
    } else if (widthx > 820 && widthx <= 1024) {
      //lg
      setResRows(24);
    } else if (widthx > 1024 && widthx < 1280) {
      //xl
      setResRows(24);
    } else if (widthx >= 1280 && widthx <= 1440) {
      //xl
      setResRows(24);
    } else if (widthx > 1440) {
      //2xl
      setResRows(48);
    }

    // setHeight(heightx)
    // setWidth(widthx)
  }, [resRows]);

  for (let i = 0; i < resRows; i++) {
    rows.push(
      <img
        key={img}
        src={`${cardState[i]}`}
        // src={cardState}
        // src={cardState[i]}
        className="rounded-[20px] w-full md:h-[280px] lg:h-[260px] xl:h-[245px] 2xl:h-[320px] opacity-20 hover:opacity-100 hover:-z-20 object-cover"
      />
    );
  }

  return (
    // <div className='absolute -z-10 w-full h-screen grid grid-cols-1 top-[6vh]'>
    <div className="absolute p-4 -z-10 w-full md:h-screen grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-y-0 gap-1 2xl:gap-2 bg-[#121212]  ">
      {rows}
    </div>
  );
};

const WhatWeHelp = () => {
  return (
    <div className="h-auto xl:h-auto p-4">
      <div className="pb-[10vh]">
        <h2 className="col-span-1 lg:col-start-1 text-[6vw] text-center lg:text-[3vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
          Giving life to AI!
        </h2>
        <h3 className="text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2">
          Craft influencers, brand ambassadors,
          chatbots, or even clones <br />
          that embody the essence of real people with remarkable precision.
        </h3>
      </div>

      <div className="grid grid-cols-1">
        {/* <a className="uppercase font-semibold w-full text-center font-unitea text-[32px] py-8">AI Brand Ambassador</a> */}
        <h2 className="col-span-1 lg:col-start-1 text-[6vw] text-center lg:text-[3vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
          AI Brand Ambassador
        </h2>
        <img src="ai-humans-page/AI Humans Banner-01.png" />
        <img src="ai-humans-page/AI Humans Banner-02.png" />
        <img src="ai-humans-page/AI Humans Banner-03.png" />
        <img src="ai-humans-page/AI Humans Banner-05.png" />
      </div>
    </div>
  );
};

const index = () => {
  return (
    <div>
      <div className="pt-[8vh]">
        <div className="absolute z-0 w-full h-[780px] md:h-[100vh] xl:h-[100vh] overflow-hidden ">
          <div className="absolute w-full bg-black">
            <img
              src="/Source 08.png"
              className="absolute z-10 m-auto w-[70vw] xl:w-[30vw] top-[50vh] left-[15%] md:left-[25%] md:top-[40vh] xl:left-[50%] xl:top-[40vh] "
            />
          </div>
          <AiHumansBackground img="-" />
        </div>
      </div>

      <Container>
        <div className="h-[80vh] md:h-[90vh] xl:h-[110vh]"></div>
        {/* <OpeningSection /> */}
        <WhatWeHelp />
        <PreviewAiHumans />
        <AImodels />
        <ContactComponant title="Contact for AI Humans" />
      </Container>
    </div>
  );
};

export default index;
