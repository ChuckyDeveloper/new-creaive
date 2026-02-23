import React from "react";
import Container from "../../../components/layout/containerPage";
import ContactComponant from "../../../components/Contact/";

const page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary-500/20 blur-[120px]" />
        <div className="absolute -right-32 top-60 h-[400px] w-[400px] rounded-full bg-complementary-500/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[140px]" />
      </div>

      {/* Hero section */}
      <Container>
        <div className="flex flex-col items-center pt-[14vh] pb-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-300">
            Get in Touch
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Let&apos;s Build Something{" "}
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-complementary-400 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Have a project in mind or want to learn more about our AI-powered
            creative solutions? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact section */}
        <ContactComponant title="Contact Us" />

        {/* Bottom spacer */}
        <div className="h-20" />
      </Container>
    </div>
  );
};

export default page;
