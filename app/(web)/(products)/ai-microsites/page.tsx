import React from 'react'
import Head from 'next/head'
import Container from '../../../../components/layout/containerPage'

const page = () => {
  return (
    <div className=''>
      <Container>
        <div className='pt-[10vh] lg:pt-[6vh] h-auto lg:h-auto rounded-[10px]'>
          <img
            src="/AI Microsite Banner.png"
            className='w-full object-center object-cover rounded-[10px] '
          />
        </div>
        <div className='px-4 lg:px-0'>
        </div>
      </Container>
    </div>
  )
}

export default page