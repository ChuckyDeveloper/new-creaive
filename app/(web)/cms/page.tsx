import React from "react";
import Container from '../../../components/layout/containerPage'
import Buttons from "../../../components/Buttons/Button";
import GradientSplitHeading from "@/components/ui/Heads/HeadGradient";


const HolovueMultiDevices = () => {
    return (
        <div>
            {/* <h2 className=" col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] leading-[3vh] text-center lg:text-[3vw] xl:text-[2.5vw] font-bold lg:text-center uppercase py-4 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
                Content Management System
            </h2> */}

            <GradientSplitHeading textBefore="Content Management System" textAfter=""/>
            <div className="relative overflow-visible">
                <img src="/Holovue Page-03.png" className=" w-screen opacity-80" />
            </div>
        </div>
    )
}

const page = () => {
    return (
        <Container>
            <HolovueMultiDevices />
            <div className="w-full px-4 lg:w-[20vw] m-auto py-10">
                <Buttons
                    href_="https://ide.creaive.ai/admin/home"
                    text="LET's TRY OUR CMS"
                    width="w-full"
                    height="h-[50px]"
                    padding=""
                    margin="m-auto "
                    bgColor="bg-primary-700 hover:bg-primary-500"
                    fontColor="text-white hover:text-[18px] duration-200 text-[14px] xl:text-[14px]"
                />
            </div>
        </Container>
    );
};

export default page;


{/* <div className="w-[20vw] m-auto py-10">
<Buttons
    href_="https://ide.creaive.ai/"
    text="LET's TALK with our AI Humans"
    width="w-full"
    height="h-[50px]"
    padding=""
    margin="m-auto "
    bgColor="bg-primary-700 hover:bg-primary-500"
    fontColor="text-white hover:text-[18px] duration-200 text-[14px] xl:text-[14px]"
/>
</div> */}

