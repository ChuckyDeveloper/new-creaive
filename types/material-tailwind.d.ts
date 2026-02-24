import type React from "react";

/**
 * @material-tailwind/react v2.x has broken types that require
 * non-existent props (placeholder, onPointerEnterCapture, etc.).
 * This module augmentation makes them optional so builds succeed.
 */
type FixMTProps = {
  placeholder?: unknown;
  onResize?: unknown;
  onResizeCapture?: unknown;
  onPointerEnterCapture?: unknown;
  onPointerLeaveCapture?: unknown;
};

declare module "@material-tailwind/react" {
  // Re-export Carousel with relaxed props
  export interface CarouselProps extends FixMTProps {}
  export const Carousel: React.FC<CarouselProps & Record<string, unknown>>;
}
