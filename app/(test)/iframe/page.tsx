"use client";
import React from "react";

type IframeProps = {
    src?: string;
    title?: string;
    className?: string;
    allow?: string;
    sandbox?: string;
};

function IframeEmbed({
    src = "https://waiwai.creaivelab.com/",
    title = "Embedded content",
    className = "",
    allow = "fullscreen; clipboard-write; encrypted-media; picture-in-picture",
    sandbox = "allow-scripts allow-same-origin",
}: IframeProps) {
    return (
        <div
            className={"relative w-full overflow-hidden rounded-xl flex items-center justify-center " + className}
            style={{ aspectRatio: "16 / 9" }}
        >
            <iframe
                src={src}
                title={title}
                loading="lazy"
                allow={allow}
                sandbox={sandbox}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full border-0"
            />
        </div>
    );
}

// ✅ Default export is a Page component (no custom props)
export default function Page() {
    return <IframeEmbed />;
}
