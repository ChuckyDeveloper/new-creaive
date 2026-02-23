"use client";
import React from "react";
import "./styles.css";

import dynamic from "next/dynamic";

const MyComponent = dynamic(() => import("./MyComponent"), {
  ssr: false,
});

const NavigationPage: React.FC = () => {
  return <MyComponent />;
};

export default NavigationPage;
