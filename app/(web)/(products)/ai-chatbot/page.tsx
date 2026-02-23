"use client";
import React, { useState, useEffect } from "react";
import Container from '../../../../components/layout/containerPage'
import ContactComponant from "../../../../components/Contact/";
import { CardVideo } from "../../../../components/Cards";
import Link from "next/link";


const ShowCases = () => {
    return (
        <div className="p-4">
            <div className='pt-[10vh] lg:pt-[6vh] h-auto lg:h-[800px] overflow-hidden rounded-[10px]'>
                <img
                    src="/AI Chatbot Banner 1.png"
                    className='w-full object-center object-cover rounded-[10px] '
                />
            </div>

            <div className="col-span-1 lg:col-start-1 text-[8vw] lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[1.8rem] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-auto">
                AI Chatbot Showcase
            </div>

            <h3 className='w-full pb-[2vh] text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2'>
                See how we have helped our customers and partners bring AI to life!
            </h3>

            <div className=" ">
                <div className="grid grid-cols-2 gap-2 ">
                    <CardVideo
                        text="AI Influencer & Ambrassadors"
                        thums="/BlackWindow.png"
                        video="/videos/influ.mp4"
                    />
                    <CardVideo
                        text="AI Clone"
                        thums="/BlackWindow.png"
                        video="/videos/K_Prapan.mp4"
                    />
                    <CardVideo
                        text="MC AVATAR"
                        thums="/BlackWindow.png"
                        video="/videos/AIinfluencerAmbrassador.mp4"
                    />
                    <CardVideo
                        text="MC CHAT"
                        thums="/BlackWindow.png"
                        video="/videos/Nis_04.mp4"
                    />
                    {/* <CardVideo
            text="Platform"
            thums="/BlackWindow.png"
            video="/videos/AIinfluencerAmbrassador.mp4"
          /> */}
                </div>
            </div>
            <div className="w-full py-20">
                {/* <Buttons
                    href_="https://ide.creaive.ai/"
                    text="LET's TALK with our AI Humans"
                    width="w-full"
                    height="h-[50px]"
                    padding=" "
                    margin="m-auto "
                    bgColor="bg-primary-700 hover:bg-primary-500"
                    fontColor="text-white hover:text-[18px] duration-200 text-[14px] xl:text-[14px]"
                /> */}

                <Link
                    target="_blank"
                    href="https://ide.creaive.ai/"
                    className='w-full '
                >
                    <button
                        // onClick={onClick}
                        type="submit"
                        className='w-full'
                    >

                        <div className="mx-auto flex max-w-[180px] h-[50px] items-center justify-center" >
                            <div className=" w-full h-full rounded-[6px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 pl-[2px] pr-[1px] py-[1px]">
                                <div className="h-full w-full items-center justify-center bg-[#121212] rounded-[6px] flex">
                                    <div className={`uppercase transition-all duration-300 font-unitea text-white hover:text-[18px] text-[14px] xl:text-[14px]`}>
                                        LET's TALK with our AI Humans
                                    </div>
                                </div>
                            </div>
                        </div>

                    </button>
                </Link>
            </div>
        </div>
    );
};

const index = () => {
    return (
        <Container>

            <ShowCases />
            <ContactComponant title="Contact for AI Humans" />

        </Container>
    );
};

export default index;
