import React from "react";
import Container from "../../../../components/layout/containerPage";
import Buttons from "../../../../components/Buttons/Button";
import ContactComponant from "../../../../components/Contact/";
import HolovueFunctionAndSpec from "../../../../app/(web)/(products)/holovue/HolovueFunctionAndSpec";

import { IoIosArrowDropleft } from "react-icons/io";
import GradientSplitHeading from "@/components/ui/Heads/HeadGradient";

const OpeningPage = () => {
  return (
    <div className="w-full h-auto m-auto md:pt-[5vh] md:h-auto lg:h-auto  flex text-center items-center overflow-hidden ">
      <div className="absolute z-10 top-[10vh] grid grid-cols-4 max-w-auto xl:w-[40vw] md:max-w-[1280px] xl:pl-4 xl:pt-[30vh] m-auto mx-4 md:pl-4 md:m-auto">
        <img
          src="/img/Holovue.png"
          className="w-full xl:w-full col-span-4 mt-[20vh] md:mt-[10vh] lg:col-span-3 xl:col-span-2 xl:p-0 xl:m-0 "
        />
        <div className="w-full h-auto col-span-4 md:col-start-4 lg:col-span-2 xl:col-span-1 xl:col-start-1 py-10">
          <Buttons
            href_="/request-demo"
            text="request demo"
            width="relative w-full md:w-[160px] xl:w-[220px]"
            height="h-[50px] xl:h-[50px]"
            padding="xl:p-1 xl:p-1 col-span-4"
            margin="mt-[2vh] "
            bgColor="border-[1px] transparent"
            fontColor="text-white hover:text-[20px] duration-200 text-[12px] xl:text-[14px]"
          />
        </div>
      </div>
      <video
        loop
        preload="none"
        muted
        autoPlay
        playsInline
        className="rounded-[8px] opacity-40 w-full pt-6 lg:pt-0"
      >
        <source src={`/mp4/HolovueOpening.mp4`} type="video/mp4" />
      </video>
    </div>
  );
};

const ContentDeliveryReimaginedVideoCard = ({
  text,
  video,
}: {
  text: string;
  video: string;
}) => {
  return (
    <div className="relative col-span-6 lg:col-span-2 w-full rounded-[20px] h-[225px] md:h-[280px] xl:h-[350px] overflow-hidden">
      <video
        loop
        preload="none"
        muted
        autoPlay
        playsInline
        className="rounded-[20px] opacity-50 hover:opacity-100  "
      >
        <source src={video} type="video/mp4" className="w-full" />
      </video>

      <div className="absolute flex items-center z-10 top-[70%] md:top-[80%] lg:top-[70%] xl:top-[80%] text-[18px] xl:text-[30px] px-4 bg-rd w-full ">
        {text}
      </div>
    </div>
  );
};

const ContentDeliveryReimaginedVideoSection = () => {
  return (
    <div className="h-auto ">
      <div className="pt-[20vh] md:pt-[0vh]">
        {/* <Header
          topic={`The Future is Holovue`}
          tagline={["Immersive Content, Infinite Possibilities!"]}
        /> */}
      </div>

      <GradientSplitHeading
        textBefore="The Future is Holovue"
        textAfter=""
        width="auto"
        subText="Immersive Content, Infinite Possibilities! User Experience Reimagined"
      />

      {/* <h2 className=" col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.0vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        The Future is Holovue
      </h2>
      <h3 className="w-full pb-[2vh] text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2">
        Immersive Content, Infinite Possibilities!
      </h3>
      <h2 className="col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.0vw] font-bold leading-[1.8rem] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        User Experience Reimagined
      </h2> */}

      <div className="grid grid-cols-4 w-full m-auto px-4 gap-4">
        <ContentDeliveryReimaginedVideoCard
          text="Pre-Recorded Content"
          video="/videos/Snap finger cloth change.mp4"
        />
        {/* <ContentDeliveryReimaginedVideoCard
          text="Live Stream"
          video="/mp4/HolovueOpening.mp4"
        /> */}
        <ContentDeliveryReimaginedVideoCard
          text="Interactive"
          video="/videos/MAI_holovue_usecase.mp4"
        />
      </div>

      <GradientSplitHeading
        textBefore="HOLOVUE On Events"
        textAfter=""
        width="auto"
        // subText="Immersive Content, Infinite Possibilities! User Experience Reimagined"
      />

      {/* <h2 className=" col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        HOLOVUE On Events
      </h2> */}
      <div className="grid grid-cols-6 w-full m-auto px-4 gap-4 ">
        <ContentDeliveryReimaginedVideoCard
          text=""
          video="/videos/!RENDER_FHD_chr2_prob4.mp4"
        />
        <ContentDeliveryReimaginedVideoCard
          text=""
          video="/videos/Final_Render_Hakuhodo_4k.mp4"
        />
        <ContentDeliveryReimaginedVideoCard
          text=""
          video="/videos/ThaiRat_02_Land2.mp4"
        />
      </div>

      <div>
        <div className="col-span-4 md:col-span-1 lg:col-span-4">
          {/* <div className="w-full pt-[10px] lg:pt-[10px] ">
            <h2 className="col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
              Virtual User Engagement
            </h2>
          </div> */}
          <GradientSplitHeading
            textBefore="Virtual User Engagement"
            textAfter=""
            width="auto"
            // subText="Immersive Content, Infinite Possibilities! User Experience Reimagined"
          />
          <div className="w-full m-auto lg:justify-center justify-center flex lg:py-8 col-span-4">
            <Buttons
              href_="/request-demo"
              text="request a demo"
              width=" w-full md:w-full lg:w-[220px]"
              height="h-[50px] xl:h-[50px]"
              padding="xl:p-1 xl:p-1 col-span-4"
              margin="mt-[2vh] "
              bgColor="bg-primary-700 hover:bg-primary-500"
              fontColor="text-white hover:text-[20px] duration-200 text-[12px] xl:text-[14px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HolovueFuntionAndSpecs = () => {
  return (
    <div className="grid grid-cols-10">
      <h2 className="col-span-10 lg:col-span-10 lg:col-start-1 text-center lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        <GradientSplitHeading
          textBefore="Functions & Specs"
          textAfter=""
          width="auto"
          // subText="Immersive Content, Infinite Possibilities! User Experience Reimagined"
        />
      </h2>

      {/* <h3 className='w-full pb-[2vh] text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2'>
        Customizable on your request
      </h3> */}
      {/* <div className="grid grid-cols-10 p-4">

      </div> */}

      <img src="Holovue Spec.png" className="col-span-10 lg:col-span-4" />

      <div className="col-span-10 lg:col-span-6">
        <HolovueFunctionAndSpec />
      </div>
    </div>
  );
};

const HolovueLiveStreaming = () => {
  return (
    <div>
      {/* <h2 className="col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        Live Streaming
      </h2>
      <h3 className="text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2">
        Live Content Replay & More
      </h3> */}
      <GradientSplitHeading
        textBefore="Live Streaming"
        textAfter=""
        width="auto"
        subText="Live Content Replay & More"
      />
      <div className="relative overflow-visible pt-[5vh]">
        <img src="/Holovue Page-01.png" className=" w-screen opacity-80" />
      </div>
    </div>
  );
};

const HolovueCMS = () => {
  return (
    <div>
      {/* <h2 className="col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center leading-8 lg:text-[3vw] xl:text-[2.5vw] font-bold lg:leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        Content Management System
      </h2> */}

      <GradientSplitHeading
        textBefore="Content Management System"
        textAfter=""
        width="auto"
        // subText="Live Content Replay & More"
      />

      <div className="relative overflow-visible">
        <img src="/Holovue Page-02.png" className=" w-screen opacity-80" />
      </div>
    </div>
  );
};

const page = () => {
  return (
    <div className="pt-[8vh]">
      <Container>
        <OpeningPage />
        <ContentDeliveryReimaginedVideoSection />
        <HolovueFuntionAndSpecs />

        <HolovueLiveStreaming />
        <HolovueCMS />
        {/* <HolovueMultiDevices /> */}

        <ContactComponant title="Contact for Holovue" />
      </Container>
    </div>
  );
};

export default page;
