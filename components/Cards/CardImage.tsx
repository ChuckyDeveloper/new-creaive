"use client"
import React, { useState } from 'react'
import Link from 'next/link';
import Header from "@/components/Header/Header";
import { MdArrowForward } from "react-icons/md";

type Props = {
    text: string
    thums: string
    image: string
    href: string
};


const CardImage = ({ text, image, href }: Props) => {

    const [hidden, setHidden] = useState(true)

    return (
        <div
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            className='relative w-full h-full min-h-[120px] md:min-h-[120px] lg:min-h-[100px] transition-all '
        >
            {
                hidden ? (
                    <div className=''>
                        <div className='relative w-full max-h-[300px] md:h-auto overflow-hidden flex'>
                            <div>
                                <h2 className='absolute top-[30%] items-center font-proDisplayBold font-bold text-[28px] xl:text-[24px] text-start uppercase '>
                                    {text}
                                </h2>
                                <div className='absolute top-[50%] pt-8 lg:pt-0'>
                                    <Link href={href} className='w-[120px] flex text-complementary-500 font-semibold'>Learn More <MdArrowForward size={20} className='m-auto' /></Link>
                                </div>
                            </div>
                            <img
                                src={image}
                                alt="Aiinfluencer"
                                className='object-fill opacity-100 w-full gradienL'
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='relative w-full max-h-[300px] overflow-hidden flex'>
                            <div>
                                <h2 className='absolute top-[30%] items-center font-proDisplayBold font-bold text-[28px] xl:text-[24px] text-start uppercase z-10'>
                                    {text}
                                </h2>
                                <div className='absolute top-[50%] z-50 pt-8 lg:pt-0'>
                                    <Link href={href} className='w-[120px] flex text-complementary-500 font-semibold'>Learn More <MdArrowForward size={20} className='m-auto' /></Link>
                                </div>
                            </div>
                            <img
                                src={image}
                                alt="Aiinfluencer"
                                className='object-fill opacity-100 w-full gradienL'
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CardImage