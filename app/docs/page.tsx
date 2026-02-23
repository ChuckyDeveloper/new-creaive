"use client";

import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";
import type { SwaggerUIProps } from "swagger-ui-react";

const SwaggerUI = dynamic<SwaggerUIProps>(
  () => import("swagger-ui-react").then((m) => m.default),
  { ssr: false }
);

function SwaggerPage() {
    return <SwaggerUI url="/api/v1/docs" />;
}

export default SwaggerPage;
