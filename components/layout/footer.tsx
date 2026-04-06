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
    <div className="relative text-white">
      {/* Top edge gradient */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <footer className="bg-[#050810]">
        <div className="relative max-w-[1280px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          {/* Logo */}
          <img
            src="/creaive/Creaive Logo Final 06.png"
            className="w-[100px] mb-10 opacity-80"
            alt="CREAiVE"
            loading="lazy"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Company
              </h3>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="about-us"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="blog"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="ai-humans"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  AI Humans
                </Link>
                <Link
                  href="ai-microsites"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  AI Microsites
                </Link>
                <Link
                  href="ai-lab"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  AI LAB
                </Link>
                <Link
                  href="ai-chatbot"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  AI Chatbot
                </Link>
                <Link
                  href="holovue"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Holovue
                </Link>
              </nav>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Explore
              </h3>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Showcases
                </Link>
                <Link
                  href="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Technical Partners
                </Link>
                <Link
                  href="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Customer Use Cases
                </Link>
              </nav>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Support
              </h3>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="contact-us"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="https://ide.creaive.ai/admin/home"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  CMS
                </Link>
                <Link
                  href="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  API & Documentation
                </Link>
                <Link
                  href="https://ide.creaive.ai/_nuxt/PDPA.2sODQ36D.pdf"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="https://ide.creaive.ai/_nuxt/PDPA.2sODQ36D.pdf"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Privacy Policy (PDPA)
                </Link>
              </nav>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    icon: <FiYoutube size={18} />,
                    href: "https://www.youtube.com/@Creaive",
                  },
                  {
                    icon: <FaInstagram size={18} />,
                    href: "https://www.instagram.com/creaive.ai/",
                  },
                  {
                    icon: <FaTiktok size={18} />,
                    href: "https://www.tiktok.com/@creaive.ai",
                  },
                  {
                    icon: <FaLinkedin size={18} />,
                    href: "https://www.linkedin.com/company/96277936/",
                  },
                  {
                    icon: <FaMediumM size={18} />,
                    href: "https://medium.com/@creaive",
                  },
                  {
                    icon: <BsTwitterX size={18} />,
                    href: "https://x.com/creaiveofficial",
                  },
                ].map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} CREAiVE. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Where Creativity and AI Converge
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
