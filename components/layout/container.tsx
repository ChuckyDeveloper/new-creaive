import React from 'react'

export default function Container({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='
            flex items-center justify-center m-auto
            w-screen h-screen 
            md:max-w-md
            lg:max-w-lg 
            xl:max-w-xl
            2xl:max-w-2xl
        '>
            {children}
        </div>
    )
}
