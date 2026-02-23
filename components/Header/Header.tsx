"use client"
import React from 'react'
import { HeaderProps } from '@/types'



const Header: React.FC<HeaderProps> = (
    {   
        topic,
        tagline
    }
) => {
    return (
        <div className='w-full pt-[140px] pb-[50px]'>
            <h2 className='font-proDisplayBold font-bold text-[28px] xl:text-[38px] text-center pb-6'>
                {topic}
            </h2>
            <h3 className='font-proDisplayRegular text-[14px] xl:text-[14px] text-center'>
                {tagline?.map((text) => {
                    return (
                        <div key={text}>
                            {text}
                        </div>
                    )
                })}
            </h3>
        </div>
    )
}

export default Header