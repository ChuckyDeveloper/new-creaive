"use client"
import React, { useEffect, useState } from 'react'
import { CardProps } from '@/types'

const VibrantPrimaryFill_CardCol_1 = {
    style: 'w-full  bg-grayDefaultDark-500 rounded-[20px] py-4 bg-opacity-50 text-white ',
}


const CardsScreenTrustedBy: React.FC<CardProps> = (
    {
        children,
        type,
        topic,
        tagline,
        body,
        ...props
    }
) => {

    const [cardType, setCardType] = useState(VibrantPrimaryFill_CardCol_1)

    return (
        <div className={cardType.style}>
            <div className='flex h-full'>
                <div className='w-full h-full rounded-[20px] '>
                    {children}
                </div>

            </div>
        </div>
    )
}


export default CardsScreenTrustedBy