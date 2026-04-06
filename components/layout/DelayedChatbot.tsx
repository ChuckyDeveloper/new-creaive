"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CODEE = dynamic(() => import("@/components/Codee"), {
  ssr: false,
});

/**
 * Delays mounting of the chatbot widget to avoid blocking
 * initial page load. Extracted from layout so the layout
 * shell can remain a server component.
 */
export default function DelayedChatbot() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  return show ? <CODEE /> : null;
}
