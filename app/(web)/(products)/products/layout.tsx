import type { ReactNode } from "react";
import Image from "next/image";
import NavTabs from "./nav-tabs";
import Navbar from "@/components/layout/nav";

export const dynamic = "force-dynamic";

export default function ProductsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <Navbar />

            {/* Header */}
            <header
                className="
          pt-24 sm:pt-28
          px-4 sm:px-6 lg:px-8
          mx-auto w-full max-w-6xl
        "
            >
                <div className="mx-auto flex justify-center">
                    <Image
                        src="/creaive/Creaive Logo Final 06.png"
                        alt="Creaive logo"
                        width={420}
                        height={120}
                        priority
                        className="h-auto w-[240px] sm:w-[320px] md:w-[420px] object-contain"
                        sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, 420px"
                    />
                </div>

                <h1
                    className="
            text-center font-bold mt-6
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            leading-tight text-balance
          "
                >
                    Where creativity meets the cutting edge of AI Technology.
                </h1>

                <p
                    className="
            mt-4 text-center text-base sm:text-lg md:text-2xl
            text-slate-200 text-pretty
          "
                >
                    We are a generative AI lab that specializes in making content for any creative
                    function.
                </p>

                <p
                    className="
            mx-auto mt-3 max-w-3xl text-center
            text-sm sm:text-base md:text-lg
            text-slate-400 text-pretty
          "
                >
                    Our cutting-edge generative AI solutions, designed to revolutionize creativity and
                    streamline operations workflows by operationalizing AI into the creative process.
                </p>
            </header>

            {/* Main */}
            <main
                className="
          mx-auto w-full max-w-6xl
          px-4 sm:px-6 lg:px-8
          pb-12
          min-h-screen
        "
            >
                <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-center">
                    <NavTabs />
                </div>

                {children}
            </main>
        </div>
    );
}
