import React from 'react'
import Head from 'next/head'
import Container from '../../../components/layout/containerPage'
import ContactComponant from "../../../components/Contact/";



const page = () => {
  return (
    <div>
      <Container>
        <div className='pt-[10vh] lg:pt-[8vh] h-auto lg:h-auto rounded-[10px]'>
          <img
            src="/Contact Us.png"
            className='w-full object-center object-cover rounded-[10px] opacity-80'
          />
        </div>
        <ContactComponant title="Contact Us" />
      </Container>
    </div>
  )
}

export default page