"use client";
import CODEE from "@/components/Codee";
import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Nav />
      <CODEE />
      {children}
      <Footer />
    </div>
  );
}
