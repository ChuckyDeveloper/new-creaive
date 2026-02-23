import type { Metadata } from "next";
import dynamic from "next/dynamic";

import {
  OurProducts,
  OurTechPartners,
  OurUseCases,
  RealWorldCase,
  TrustedBy,
} from "../components/ui/landingPage";

import AnimatedSection from "../components/ui/AnimatedSection";
import ContainerPage from "../components/layout/containerPage";
import Nav from "../components/layout/nav";
import Footer from "../components/layout/footer";

/* ── heavy client components – loaded lazily ── */
const FecilitateComponent = dynamic(() => import("../components/Scheduler"), {
  ssr: false,
});

const AnimatedBackground = dynamic(
  () => import("../components/AnimateBackground"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#121212] flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl xl:text-[10vw] font-black italic bg-gradient-to-r from-primary-600 via-primary-600 to-complementary-600 text-transparent bg-clip-text font-unitea">
          CREAIVE
        </h1>
      </div>
    ),
  },
);

const CODEE = dynamic(() => import("@/components/Codee"), { ssr: false });
const ContactComponant = dynamic(() => import("../components/Contact/"), {
  ssr: false,
  loading: () => <div className="min-h-[400px]" />,
});

export const metadata: Metadata = {
  title: "CREAIVE — Where Creativity and AI Converge",
  description:
    "AI-powered content creation platform featuring AI Humans, AI Microsites, AI Lab, and AI Chatbot. Transform your business with generative AI.",
  openGraph: {
    title: "CREAIVE — Where Creativity and AI Converge",
    description:
      "AI-powered content creation platform. Transform your business with generative AI.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Nav />

      <ContainerPage className="w-full h-auto relative">
        {/* ── Event banner overlay (lazy) ── */}
        <FecilitateComponent />

        {/* ── Hero section with particle background ── */}
        <AnimatedBackground />

        {/* ── Floating chatbot ── */}
        <CODEE />

        {/* ── Main content sections ── */}
        <ContainerPage>
          <AnimatedSection>
            <RealWorldCase />
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="py-8 lg:py-16" />
            <OurProducts />
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <TrustedBy />
          </AnimatedSection>
        </ContainerPage>

        <AnimatedSection>
          <OurUseCases />
        </AnimatedSection>

        <ContainerPage>
          <AnimatedSection delay={100}>
            <OurTechPartners />
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <ContactComponant title="Contact Us" />
          </AnimatedSection>
        </ContainerPage>
      </ContainerPage>

      <Footer />
    </div>
  );
}
