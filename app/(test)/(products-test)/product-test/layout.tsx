import type { ReactNode } from "react";
import Link from "next/link";
import NavTabs from "./nav-tabs";
import Navbar from "@/components/layout/nav";

export const dynamic = "force-dynamic"; // ensure SSR (no static pre-render)

export default function ProductsLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-black text-white">
                <header className="w-full pt-20 ">
                    <img src="/creaive/Creaive Logo Final 06.png" className="max-w-[420px] m-auto" />

                    <h1 className="text-center text-4xl font-bold py-6">
                        Where creativity meets the cutting edge of AI Technology.
                    </h1>

                    <h2 className="text-center text-2xl py-2">
                        We are a generative AI lab that specializes in making content for any creative function.
                    </h2>

                    <h3 className="text-center  text-md py-1">
                        Our cutting-edge generative AI solutions, designed to revolutionize creativity and streamline operations workflows by operationalizing AI into the creative process.
                    </h3>

                </header>

                <main className="mx-auto max-w-6xl px-4 py-6">
                    <div className="mb-6 flex justify-center pt-10">
                        <NavTabs />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
