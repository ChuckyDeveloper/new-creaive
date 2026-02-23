'use client';

import React, { useEffect } from 'react';
import Particles from 'particlesjs';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import './styles.css';
import {
    useAppDispatch
} from '../../lib/features'
import { setIsLoading } from '../../lib/features/settings/settingSlice';

const MyComponent: React.FC = () => {
    ssr: false
    const dispatch = useAppDispatch();

    useEffect(() => {
        const canvas = document.querySelector('.background');
        if (canvas) {
            Particles.init({
                selector: '.background',
                color: ['#47C2CB', '#782a90', '#510966', '#9233AF'],
                connectParticles: true,
                responsive: [
                    {
                        breakpoint: 768,
                        options: {
                            color: ['#47C2CB', '#782a90', '#510966', '#9233AF'],
                            maxParticles: 43,
                            connectParticles: false,
                        },
                    },
                ],
            });
        } else {
            console.error("Canvas element with class 'background' not found.");
        }

        dispatch(setIsLoading(false));
    }, []);


    const text_1 = 'text-white text-start italic text-[18px] leading-none md:text-[24px] xl:text-[28px] 2xl:text-[40px]'

    return (
        <div className='w-full h-full'>
            <section className="nav w-full h-full m-auto relative flex items-center justify-center">
                <canvas className="background absolute -z-50 font-unitea"></canvas>

                <div className='w-full h-auto max-w-[1280px] m-auto p-4'>
                    <div className='ml-0 mx-auto flex flex-col'>

                        <a className={text_1}>
                            WELCOME TO
                        </a>

                        <h1 className='max-w-[1000px] overflow-hidden text-start bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text'>
                            <a className='text-start text-[70px] leading-none md:text-[8rem] xl:text-[10vw] 2xl:text-[180px] italic font-black pr-10'>
                                CREAIVE
                            </a>
                        </h1>

                        <a className={text_1}>
                            WHERE CREATIVITY AND AI CONVERGE
                        </a>
                    </div>
                </div>

                <div className='absolute top-[70%] md:top-[70%] lg:top-[80%] h-auto'>
                    <Link
                        target="_blank"
                        href="/request-demo"
                        className=''
                    >
                        <button
                            type="submit"
                            className='w-[200px] mx-auto'>
                            <div className={`mx-auto flex h-[40px] xl:h-[45px] items-center justify-center`}>
                                <div className="w-full h-full rounded-[6px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 pl-[2px] pr-[1px] py-[1px]">
                                    <div className="h-full w-full items-center justify-center bg-[#121212] rounded-[6px] flex">
                                        <div className={`uppercase transition-all duration-300 font-unitea text-white hover:text-[15px] text-[9px] xl:text-[14px] px-2`}>
                                            request a demo
                                        </div>
                                        <MdArrowForward size={20} className='relative text-complementary-500' />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default MyComponent;
