import React from "react";

// import Container from "@/components/ContainerPage";
import Head from "next/head";
import { SlArrowRight } from "react-icons/sl";
import Container from "../../../components/layout/containerPage";


const page = () => {
  return (
    <Container>
      <Head>
        <title>About Us Creaive.ai</title>
        <meta property="og:title" content="About Us Creaive.ai" key="title" />
      </Head>

      <div className="grid grid-cols-2 pt-[10vh] px-4">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex">
            <h1 className='py-4 text-center w-full text-[50px] leading-[60px] lg:text-[60px] xl:text-[80px] px-4 font-black bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text font-unitea'>
              ABOUT US
            </h1>
            <SlArrowRight size={45} className="hidden xl:flex items-center justify-center m-auto text-complementary-500 rotate-90 lg:rotate-0" />
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-[14px] lg:text-[20px] xl:text-[30px] italic">
            Welcome to <a className=" font-unitea">CREaiVE</a> <br />
            where creativity meets the cutting edge <br />
          </h3>
          <a className="text-[#872a90] lg:text-[30px] font-semibold">of AI Technology.</a>
        </div>

        <h3 className="col-span-2 pt-[4vh] leading-7 lg:leading-10">
          We are a generative AI lab that specializes in making content for any creative function. Our cutting-edge generative AI solutions, designed to revolutionize creativity and streamline operations
          workflows by operationalizing AI into the creative process. Here at
          CREAIVE, we offer 4 main solutions that are transforming the
          creative landscape:
        </h3>
      </div>

      <div className="grid grid-cols-2 pt-[10vh] gap-8">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex">
            <img src='Vision.png' className="w-20 h-20 mx-4" />
            <h2 className="lg:text-[60px] text-[50px] font-semibold">VISION</h2>
          </div>
          <div className="relative">
            <img src="/img/Line.png" className="absolute -z-10" />
            <h3 className="pt-[8vh] lg:pt-[5vh] xl:pt-[10vh] px-8 leading-7 lg:leading-10">
              Our vision is to be the global leader in AI-driven creativity,
              shaping the future of content production for brands, agencies,
              and creators alike. We envision a world where AI and human
              creativity work hand-in-hand, enabling limitless possibilities
              in content creation. Through constant innovation, we aim to
              redefine the creative landscape, making it more dynamic,
              efficient, and impactful for businesses across industries.
            </h3>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <div className="flex">
            <img src='Mission.png' className="w-20 h-20 mx-4" />
            <h2 className="lg:text-[60px] text-[40px] font-semibold">MISSION</h2>
          </div>
          <div className="relative">
            <img src="/img/Line.png" className="absolute -z-10" />
            <h3 className="pt-[8vh] lg:pt-[5vh] xl:pt-[10vh] px-8 leading-7 lg:leading-10">
              At CREaiVE, our mission is to empower brands and agencies by
              integrating AI into their creative operations. We aim to
              streamline content production, reduce inefficiencies, and drive
              innovation through generative AI technology. By offering
              solutions that enhance digital engagement and streamline
              workflows, we seek to make creativity more accessible and
              scalable for all businesses.
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 lg:pt-[20vh] gap-4">
        <div className="col-span-4 lg:col-span-2">
          <div className="my-auto items-center justify-center">
            <h1 className='w-full leading-[66px] lg:w-[80%] text-center text-[60px] pt-[10vh] lg:pt-[0vh] lg:text-[60px] xl:text-[80px] px-4 font-black bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text font-unitea'>
              PRODUCTS OVERVIEW
            </h1>
            <h2 className="px-4 :text-[24px] lg:text-[28px] xl:text-[36px] font-unitea font-semibold">Making ideas come alive with AI</h2>
          </div>
        </div>
        <div className="col-span-4 lg:col-span-2 px-4">
          <h3 className="">
            <a className='text-[22px] lg:text-[18px] xl:text-[22px] py-10 font-black bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text'>
              CREAIVE, where CREATIVITY and AI converge!
            </a>
            <br />
            <a className="leading-7 lg:leading-10">
              We are a generative AI lab that specializes in making content for any creative function.
              Our cutting-edge generative AI solutions, designed to revolutionize creativity and streamline operations
              workflows by operationalizing AI into the creative process. Here at
              CREAIVE, we offer 4 main solutions that are transforming the
              creative landscape
            </a>
          </h3>
        </div>

        <div className="col-span-4 lg:col-span-1 pt-[8vh] px-2">
          <h2 className="italic font-semibold text-[3vh] lg:text-[28px] xl:text-[30px] text-center text-primary-600 py-4">AI Humans</h2>
          <img src='img/About Us - AI Humans.png' className="" />
          <SlArrowRight size={60} className="flex items-center justify-center m-auto text-complementary-500 rotate-90" />
          <h3 className="text-start leading-7 lg:leading-10">
            We create AI Influencers, <br />
            AI Chatbots, and AI Doubles that replicate real people with astonishing accuracy.
            Whether you need a digital spokesperson or a virtual assistant, our
            AI humans can enhance your brand's presence.
          </h3>
        </div>

        <div className="col-span-4 lg:col-span-1 pt-[8vh] px-2">
          <h2 className="italic font-semibold text-[3vh] lg:text-[28px] xl:text-[30px] text-center text-primary-600 py-4">Operational AI</h2>
          <img src='img/About Us - Operational AI.png' className="" />
          <SlArrowRight size={60} className="flex items-center justify-center m-auto text-complementary-500 rotate-90" />
          <h3 className="text-start leading-7 lg:leading-10">
            Our generative AI tools produce high-quality content
            in various formats. includeing images.
            videos, audio, vision, speech, and translation.
            This technology allows business to generate
            captiveting content efficiently.
          </h3>
        </div>

        <div className="col-span-4 lg:col-span-1 pt-[8vh] px-2">
          <h2 className="italic font-semibold text-[3vh] lg:text-[28px] xl:text-[30px] text-center text-primary-600 py-4">AI Microsites</h2>
          <img src='img/About Us - Microsite.png' className="" />
          <SlArrowRight size={60} className="flex items-center justify-center m-auto text-complementary-500 rotate-90" />
          <h3 className="text-start leading-7 lg:leading-10">
            Designed for customer engagement.
            our AI microsites provide brands with valuable
            insignts into customer behavior. These dynamic
            interactive platforms help drive engagement
            and gother critical data.
          </h3>
        </div>

        <div className="col-span-4 lg:col-span-1 pt-[8vh] px-2">
          <h2 className="italic font-semibold text-[3vh] lg:text-[28px] xl:text-[30px] text-center text-primary-600 py-4">HOLOVUE</h2>
          <img src='img/About Us - Holovue.png' className="" />
          <SlArrowRight size={60} className="flex items-center justify-center m-auto text-complementary-500 rotate-90" />
          <h3 className="text-start leading-7 lg:leading-10">
            Cutting-edge display technology
            delivers stunning 3D holographic output
            that bring your to life, createing immersive
            and captivating experiences for events,
            exhibitions, and retail environments.
          </h3>
        </div>
      </div>
    </Container>
  );
};

export default page;
