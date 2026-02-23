"use client"
import React, { useEffect, useState } from 'react'
import { ButtonProps } from '@/types'
import Link from 'next/link'

// const ButtonPrimary = 'w-full h-[50px] bg-white rounded-[30px]   text-black text-lg font-bold uppercase hover:bg-black hover:text-white hover:border-white hover:border-2'
// const ButtonPrimaryKeepHover = 'w-full h-[50px] rounded-[30px]   text-lg font-bold uppercase bg-black text-white border-white border-2 hover:bg-white hover:text-black'

// const ButtonSecondary = 'w-full h-[50px] bg-secondaryDark-0 rounded-[20px]   text-white text-lg font-bold uppercase hover:bg-black hover:text-secondaryDark-0 hover:border-secondaryDark-0 hover:border-2'
// const ButtonTertinary = 'w-full h-[50px] rounded-[20px]   text-lg text-secondaryDark-0 font-bold uppercase hover:bg-secondaryDark-0 hover:text-white border-2 border-secondaryDark-0 hover:border-2'

const Buttons: React.FC<ButtonProps> = (
    {
        onClick,
        children,
        text,
        bgColor,
        width,
        height,
        font,
        fontColor,
        padding,
        margin,
        type,
        href_,
        disabled,
        // ...props
    }
) => {

    return (
        <div>
            {href_ ?
                <Link
                    target="_blank"
                    href={href_}
                    className='w-full '
                >
                    <button
                        onClick={onClick}
                        type="submit"
                        className='w-full'
                        disabled={disabled}
                    >

                        <div className={`mx-auto flex ${width} ${height} items-center justify-center `}>
                            <div className=" w-full h-full rounded-[6px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 pl-[2px] pr-[1px] py-[1px]">
                                <div className="h-full w-full items-center justify-center bg-[#121212] rounded-[6px] flex">
                                    <div className={`uppercase transition-all duration-300 font-unitea text-white ${fontColor}`}>
                                        {text}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </button>
                </Link>

                :

                <div>
                    <button
                        onClick={onClick}
                        type="submit"
                        className='w-full'
                    // className={`
                    // ${width} 
                    // ${height} 
                    // ${padding}
                    // ${margin}
                    // ${bgColor}
                    // ${fontColor}
                    // `}
                    >

                        <div className={`mx-auto flex ${width} ${height} items-center justify-center `}>
                            <div className=" w-full h-full rounded-[6px] bg-gradient-to-r from-primary-600 via-primary-400 to-complementary-500 pl-[2px] pr-[1px] py-[1px]">
                                <div className="h-full w-full items-center justify-center bg-[#121212] rounded-[6px] flex">
                                    <div className={`uppercase transition-all duration-300 font-unitea text-white ${fontColor}`}>
                                        {text}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </button>
                </div>
            }
        </div>

    )
}


export default Buttons
