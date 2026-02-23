import React from "react";
import Link from "next/link";

// import FooterContainer from './FooterContainer'

import { FiYoutube } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaMediumM } from "react-icons/fa";

// export default function FooterContainer({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <div className='relative md:max-w-[768px] xl:max-w-[1280px] m-auto h-auto xl:max-h-auto min-h-[30vh] pb-10'>
//             {/* {children}
//              */}
//             <Footer />
//         </div>
//     )
// }
// C:\Users\you\Desktop\CREaiVE\public\Creaive BG 01.png

const Footer = () => {
  return (
    <div className="text-white bg-[#121212]">
      <div className="md:max-w-[768px] xl:max-w-[1280px] m-auto h-auto xl:max-h-auto">
        <img
          src="/Creaive BG 01.png"
          className="max-h-[200px] flex items-end justify-end bottom-0 m-auto"
          loading="lazy"
          decoding="async"
          alt="CREAIVE background"
        />
      </div>
      <footer className="w-screen bg-grayDefaultDark-400 left-0 bottom-0 ">
        <div className="relative md:max-w-[768px] xl:max-w-[1280px] m-auto h-auto xl:max-h-auto min-h-[30vh] pb-10">
          <div className="relative mx-4">
            <img
              src="/creaive/Creaive Logo Final 06.png"
              className="w-[110px] py-10"
              loading="lazy"
              decoding="async"
              alt="CREAIVE logo"
            />
            <div className="grid md:grid-cols-4 ">
              <div className="col-span-1 xl:mr-20">
                <div className="text-xl font-bold border-b-[1px] border-[#2D979E] py-4">
                  Company
                </div>
                <div className="pt-2">
                  <Link href="about-us">About Us</Link>
                </div>
                {/* <div className='pt-2'>
                                    <Link href="about-us">
                                    Products
                                    </Link>
                                </div> */}
                <div className="pt-2">
                  <Link href="blog">Blog</Link>
                </div>
                <div className="pt-2">
                  <Link href="ai-humans">AI Humans</Link>
                </div>
                <div className="pt-2">
                  <Link href="ai-microsites">AI microsites</Link>
                </div>
                <div className="pt-2">
                  <Link href="ai-lab">AI LAB</Link>
                </div>
                <div className="pt-2">
                  <Link href="ai-chatbot">AI Chatbot</Link>
                </div>
                <div className="pt-2">
                  <Link href="holovue">Holovue</Link>
                </div>
              </div>

              <div className="col-span-1 xl:mr-20">
                <div className="text-xl font-bold border-b-[1px] border-[#2D979E] pb-4 pt-8 md:py-4">
                  Explore
                </div>
                <div className="pt-2">
                  <Link href="/">Showcases</Link>
                </div>
                <div className="pt-2">
                  <Link href="/">Technical Partners</Link>
                </div>
                <div className="pt-2">
                  <Link href="/">Customers use-cases</Link>
                </div>
              </div>

              <div className="col-span-1 xl:mr-20">
                <div className="text-xl font-bold border-b-[1px] border-[#2D979E] pb-4 pt-8 md:py-4">
                  Support
                </div>
                <div className="pt-2">
                  <Link href="contact-us">Contact Us</Link>
                </div>
                <div className="pt-2">
                  <Link href="https://ide.creaive.ai/admin/home">CMS</Link>
                </div>
                <div className="pt-2">
                  <Link href="/">API & Documentation</Link>
                </div>
                <div className="pt-2">
                  <Link href="https://ide.creaive.ai/_nuxt/PDPA.2sODQ36D.pdf">
                    Terms & Conditions
                  </Link>
                </div>
                <div className="pt-2">
                  <Link href="https://ide.creaive.ai/_nuxt/PDPA.2sODQ36D.pdf">
                    Privacy Policy (PDPA)
                  </Link>
                </div>
              </div>

              <div className="col-span-1 xl:mr-20">
                <div className="text-xl font-bold border-b-[1px] border-[#2D979E] pb-4 pt-10 text-center md:py-4">
                  Follow Us
                </div>
                <div className="flex w-full justify-between px-2 pt-4 gap-1">
                  {/* <FaFacebook size={25} /> */}
                  <Link href="https://www.youtube.com/@Creaive" target="_blank">
                    <FiYoutube size={25} />
                  </Link>
                  <Link
                    href="https://www.instagram.com/creaive.ai/"
                    target="_blank"
                  >
                    <FaInstagram size={25} />
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@creaive.ai?_t=8pg28YEehfD&_r=1"
                    target="_blank"
                  >
                    <FaTiktok size={25} />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/96277936/admin/feed/posts/"
                    target="_blank"
                  >
                    <FaLinkedin size={25} />
                  </Link>
                  <Link href="https://medium.com/@creaive" target="_blank">
                    <FaMediumM size={25} />
                  </Link>
                  <Link
                    href="https://x.com/creaiveofficial?s=21&t=iPOGK51GBXopMNTaNYWBuQ"
                    target="_blank"
                  >
                    <BsTwitterX size={25} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
