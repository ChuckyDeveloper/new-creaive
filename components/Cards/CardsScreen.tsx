"use client";

import React from "react";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PointLight } from "three";
import { CardProps } from "@/types";
import Buttons from "../../components/Buttons/Button";

import Holovue from "../Holovue/Holovue";

const CardScreen: React.FC<CardProps> = ({
  children,
  type,
  topic,
  tagline,
  body,
  ...props
}) => {
  const lightRef = useRef<PointLight>(null);

  return (
    <div className="flex h-full rounded-[20px] p-4  ">
      <div className="grid grid-cols-1 xl:grid-cols-3 w-full xl:gap-4 ">
        <div className="items-start justify-start w-full h-full rounded-[20px] col-span-2">
          <img src="/HOLOVUE Logo Light.png" className="w-[50%] m-auto"></img>
          <div className="pt-2 xl:text-justify text-[16px] xl:text-[20px] leading-5 font-unitea text-justify lg:text-center md:w-[80%] m-auto">
            We are the leading experts in using AI and
            3D technology to create visually engaging content. Through a mixture
            of the latest technologies, our vision is to bring holographic
            experiences to everyone. Holographic communication is an innovative
            channel to drive user awareness, activation and engagement,
            ultimately driving a memorable and unique experience wherever you
            are. Brands and companies are using Holographic technology to
            deliver a truly lifelike, lifesize, realtime or scheduled,
            volumetric digital experiences!
          </div>
          <div className="col-span-1 lg:w-[220px] py-[8vh] md:w-[80%] m-auto">
            <Buttons
              href_="/holovue"
              text="LEARN MORE"
              width="relative w-full md:w-full lg:w-[220px]"
              height="h-[50px] xl:h-[50px]"
              padding="xl:p-1 xl:p-1 col-span-4"
              margin="mt-[2vh] "
              bgColor="bg-primary-600 hover:bg-primary-500"
              fontColor="text-white hover:text-[20px] duration-200 text-[12px] xl:text-[14px]"
            />
          </div>
        </div>

        {/*  */}
        <div className="xl:w-full h-[300px] xl:h-[500px] rounded-[20px] ">
          <Canvas className="overflow-visible rounded-[20px]">
            <OrbitControls
              enableRotate
              autoRotate
              onChange={(e) => {
                if (!e) return;
                const camera = e.target.object;

                if (lightRef.current) {
                  lightRef.current.position.set(0, 1, 0);
                  lightRef.current.position.add(camera.position);
                }
              }}
            />
            <ambientLight intensity={1} />

            <pointLight ref={lightRef} intensity={20} position={[2, 2, 0]} />
            <Holovue />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default CardScreen;
