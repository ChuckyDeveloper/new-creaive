import Footer from "../../components/layout/footer";
import Nav from "../../components/layout/nav";
import ScrollReveal from "../../components/layout/ScrollReveal";
import DelayedChatbot from "../../components/layout/DelayedChatbot";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <Nav />
      {children}
      <Footer />
      <ScrollReveal />
      <DelayedChatbot />
    </div>
  );
}
