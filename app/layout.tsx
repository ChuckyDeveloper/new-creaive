import type { Metadata } from "next";
import ReduxProvider from "../lib/features/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CREAIVE",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ReduxProvider>
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
