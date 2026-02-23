"use client"

import useAuthBootstrap from "../../lib/hooks/useAuthBootstrap";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useAuthBootstrap();
    return (
        <div>
            {children}
        </div>
    );
}
