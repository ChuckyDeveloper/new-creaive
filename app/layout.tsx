import type { Metadata } from "next";
import ReduxProvider from "../lib/features/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CREAIVE — Where Creativity and AI Converge",
    template: "%s | CREAIVE",
  },
  description:
    "AI-powered content creation platform featuring AI Humans, AI Microsites, AI Lab, and AI Chatbot. Transform your business with generative AI.",
  keywords: ["AI", "generative AI", "AI Humans", "content creation", "CREAIVE"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://creaive.ai",
  ),
  openGraph: {
    title: "CREAIVE — Where Creativity and AI Converge",
    description:
      "AI-powered content creation platform. Transform your business with generative AI.",
    type: "website",
    siteName: "CREAIVE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
