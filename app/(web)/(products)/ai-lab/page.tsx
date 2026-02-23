import React from 'react'
import Head from 'next/head'
import Container from '../../../../components/layout/containerPage'

const page = () => {
  return (
    <Container>
      <h2 className=" col-span-1 lg:col-start-1 pt-[10vh] text-[6vw] text-center lg:text-[3vw] xl:text-[2.5vw] font-bold leading-[2.0vw] lg:text-center uppercase py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
        AI-LAB
      </h2>
      <h3 className='text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2'>
        Redefining Content Creation
      </h3>
      <div className='px-4 lg:px-0'>
        <div className='pt-[10vh] lg:pt-[2vh] h-auto lg:h-[800px] overflow-hidden rounded-[10px]'>
          {/* <img
            src="/Mascot.png"
            className='w-full object-center object-cover rounded-[10px] '
          /> */}
          <video loop preload="none" muted autoPlay controls={false} playsInline
            className="w-full m-auto rounded-[20px]"
          >
            <source
              src={`/videos/AI Lab.mp4`}
              type="video/mp4"
            // className="w-full m-auto"
            />
          </video>


        </div>
        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0 pt-[6vh]'>
          <div className='text-[3vw] lg:text-[1vw] xl:text-[0.8vw] text-center uppercase px-2'>
            Our generative AI tools produce high-quality content in various formats,
            including images, videos, audio, vision, speech, and translation. <br />
            This technology allows businesses to generate captivating content efficiently.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          {/* <h2 className='py-10 text-[30px] px-4'>
            AI-Generated Content
          </h2> */}

          <h2 className="col-span-1  lg:col-start-1 text-[6vw] text-center lg:text-[3vw] font-bold leading-[2.0vw] lg:text-center uppercase py-10 lg:py-8 font-unitea bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 inline-block text-transparent bg-clip-text w-full">
            AI-Generated Content
          </h2>
          {/* <div className='px-4'>
            We create a variety of content, such as images, videos, 3D animations, sounds,
            and graphics using generative AI techniques. Some examples include
          </div>
          <div className='lg:px-2 lg:pt-4 flex'>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <div className='text-[22px] my-4'>Image to Image</div>
              Modifying or creating new images from existing ones.
            </div>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <div className='text-[22px] my-4'>Text to Image/Video/3D Animation</div>
              Generating visual or video content from text input, making the creative process more efficient and tailored.
            </div>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <div className='text-[22px] my-4'>Voice and Sound Generation</div>
              Producing voiceovers or sound effects from text or voice commands, creating a rich multimedia experience.
            </div>
          </div> */}
          <div className="grid grid-cols-1">
            <img src="ai-humans-page/AI Humans Banner-04.png" className='py-4' />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 lg:px-0'>
            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/text2image.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>Text to Image</div>
            </div>
            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/Text To VDO.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>Text to Video</div>
            </div>
            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/Image To Image.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>Image to Image</div>
            </div>
            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/Image to Video-3D Animation.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>Image to Video & 3D Animation</div>
            </div>
            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/AI Voice and Sound Generation.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>AI Voice and Sound Generation</div>
            </div>

            <div className='col-span-2 lg:px-0 mt-2 lg:mt-0 lg:pt-0 lg:mx-0 text-center'>
              <video loop muted autoPlay controls={false} playsInline
                className="w-full m-auto rounded-[10px] py-4"
              >
                <source
                  src={`/videos/AI Element.mp4`}
                  type="video/mp4"
                />
              </video>
              <div className='font-bold mb-4 mt-4 uppercase font-unitea text-[20px] '>AI Element</div>
            </div>
          </div>
        </div>
        {/* 

        <divclassName='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Solutions for Industries
          </h2>
          <div className='px-4'>
            Our AI Lab develops custom solutions for industries like healthcare, finance, education,
            entertainment, retail, and manufacturing. These AI-driven solutions help businesses improve efficiency,
            reduce operational costs, and stay competitive.
          </div>
          <div className='lg:px-2 lg:pt-4'>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <div className='text-[22px] my-4'>AI in Healthcare</div>
              We create AI systems that assist in medical diagnosis or analyze healthcare data.
            </div>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <div className='text-[22px] my-4'>AI in Retail</div>
              We develop AI-powered chatbots or recommendation systems to enhance the shopping experience.
            </div>
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Automation
          </h2>
          <div className='lg:px-2'>
            <div className='lg:px-4 lg:py-4 border-[0.5px] rounded-[8px] mt-4 lg:mt-0 p-4 lg:pt-0 lg:mx-2 lg:my-2'>
              <h2 className='py-2 text-[30px] px-4'>

              </h2>
              Creaive’s AI Lab focuses on automating processes using AI, such as data processing,
              production management, or business analytics, to streamline operations and reduce manual effort.
              With Robotic Process Automation (RPA),
              we automate complex workflows with high precision, improving overall efficiency.
            </div>
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Analytics and Optimization
          </h2>
          <div className='lg:px-4'>
            Creaive's AI Microsite can analyze user behavior, such as visit duration, engagement, <br />
            and popular content, allowing for continuous improvement of the site's design and content delivery.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Integration with Other Technologies
          </h2>
          <div className='lg:px-4'>
            Our AI Lab integrates AI with other advanced technologies, such as the Internet of Things (IoT), Blockchain, and cloud computing to create robust, versatile solutions. For example:
            AI & IoT: AI processes real-time data from IoT sensors to generate actionable insights, transforming industries like manufacturing and logistics.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Analytics
          </h2>
          <div className='lg:px-4'>
            We develop advanced data analytics systems to help businesses forecast trends, understand customer behavior, and make data-driven decisions.
            Predictive Analytics: Our AI models predict business outcomes and future trends, providing businesses with insights that help them plan ahead.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            Support & Consultation
          </h2>
          <div className='lg:px-4'>
            Creaive’s AI Lab offers technical support and consultation services for businesses looking to implement AI in their operations.
            Whether it’s AI system installation or developing custom AI solutions,
            we work closely with our clients to ensure the technology aligns with their goals.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            Deep Learning Research
          </h2>
          <div className='lg:px-4'>
            We have dedicated teams working on Deep Learning Research,
            a key area that enables AI models to learn from and improve upon complex data sets without human intervention,
            making our solutions more sophisticated and adaptive.
          </div>
        </div>

        <div className='w-full border-b-[0.5px] pb-10 lg:border-b-0'>
          <h2 className='py-10 text-[30px] px-4'>
            AI Innovation and Experimentation
          </h2>
          <div className='lg:px-4'>
            Innovation is at the heart of Creaive’s AI Lab.
            We continually experiment with new ideas and develop AI innovations that address pressing business challenges.
            From advanced image processing AI to multi-language translation systems, we strive to push the boundaries of what AI can do.
          </div>
        </div> */}
      </div>
    </Container>
  )
}

export default page