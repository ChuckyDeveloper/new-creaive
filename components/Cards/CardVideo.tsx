"use client"
import React from 'react'

type Props = {
    text: string
    thums: string
    video: string
};


const CardVideo = ({ text, thums, video }: Props) => {
    const handleOnMouseOver = (e: React.MouseEvent<HTMLVideoElement>) => {
        e.currentTarget.play();
    };

    const handleOnMouseOut = (e: React.MouseEvent<HTMLVideoElement>) => {
        e.currentTarget.pause();
    };



    return (
        <div className='relative w-full h-full rounded-[20px] overflow-hidden min-h-[300px]'>
            <div className='absolute bg-black h-full opacity-60 hover:opacity-0 z-10 hover:z-0  transition '>
                <div className='absolute text-white  uppercase text-center w-full h-full top-[80%] md:top-[90%] text-[12px] xl:text-[18px]'>
                    {text}
                </div>
                <img
                    src={thums}
                    alt="Aiinfluencer"
                    className=''
                />
            </div>
            <div className='absolute z-0 hover:z-10'>
                <video
                    loop
                    autoPlay
                    preload='none'
                    muted // Needs to be there to be able to play
                    onMouseOver={handleOnMouseOver}
                    onMouseOut={handleOnMouseOut}
                    className=''
                >
                    <source
                        src={video}
                        type='video/mp4'
                    />
                </video>
            </div>
        </div>
    )
}

export default CardVideo