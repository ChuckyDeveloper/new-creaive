import * as React from "react";

/**
 * TopicHeading — responsive, semantic heading with optional highlighted segment
 * Matches the provided design (Tailwind) and keeps API flexible for reuse.
 *
 * Usage example:
 * <TopicHeading
 *   leading="Real Impact with"
 *   highlight="generative AI-Driven"
 *   trailing="Content & Solutions"
 *   align="start"
 * />
 */

export type TopicHeadingProps = {
  /** Text before the highlighted part */
  leading?: string;
  /** Middle text that should be highlighted */
  highlight?: string;
  /** Text after the highlighted part */
  trailing?: string;
  /** h1 | h2 | h3 – semantic level, defaults to h2 */
  as?: "h1" | "h2" | "h3";
  /** text alignment; defaults to "start" on md+ and "center" on mobile */
  align?: "start" | "center";
  /** Optional small label above heading */
  eyebrow?: string;
  /** Tailwind className passthrough */
  className?: string;
  /** Add extra classes to the highlight span */
  highlightClassName?: string;
  /** Uppercase transformation (default true) */
  uppercase?: boolean;
  /** Font family classes to apply; defaults to font-unitea provided by user */
  fontClassName?: string;
  /** Whether to insert line breaks between leading/highlight/trailing on md+ */
  responsiveBreaks?: boolean;
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

export default function TopicHeading({
  leading = "Real Impact with",
  highlight = "generative AI-Driven",
  trailing = "Content & Solutions",
  as = "h2",
  align = "start",
  eyebrow,
  className,
  highlightClassName,
  uppercase = true,
  fontClassName = "font-unitea",
  responsiveBreaks = true,
}: TopicHeadingProps) {
  const Tag = as as any;

  const baseSize = "text-[28px] leading-[30px]"; // mobile
  const mdSize = "md:text-[38px] md:leading-[38px]";
  const lgSize = "lg:text-[40px] lg:leading-[2.9vw]";
  const xlSize = "xl:text-[50px] xl:leading-[50px]";

  const alignClsMobile = align === "center" ? "text-center" : "text-center"; // mobile centered by design
  const alignClsMd =
    align === "center"
      ? "md:text-center lg:text-center"
      : "md:text-start lg:text-start";

  const casing = uppercase ? "uppercase" : "";

  return (
    <div className="w-full">
      {eyebrow && (
        <div className="px-4 pb-2">
          <span className="text-xs tracking-wider text-primary-600 font-semibold uppercase">
            {eyebrow}
          </span>
        </div>
      )}
      <Tag
        className={cx(
          "w-full font-black px-4 pb-8 font-regular", // original intent
          baseSize,
          mdSize,
          lgSize,
          xlSize,
          alignClsMobile,
          alignClsMd,
          casing,
          fontClassName,
          className
        )}
      >
        <span>{leading}</span>
        {responsiveBreaks && <br className="hidden md:flex" />}
        <span
          className={cx(
            "text-primary-600 font-black",
            mdSize.replace("md:", "md:"),
            lgSize.replace("lg:", "lg:"),
            xlSize.replace("xl:", "xl:"),
            highlightClassName
          )}
        >
          {highlight}
        </span>
        {responsiveBreaks && <br className="hidden md:flex" />}
        {trailing && <span> {trailing}</span>}
      </Tag>
    </div>
  );
}

/*
Design notes (for dev leads/CTO):
- Semantic control via `as` prop lets you maintain proper heading hierarchy per page.
- Tailwind sizes mirror the original snippet exactly; we keep mobile centered and md+ configurable.
- We default to uppercase to match the design; set `uppercase={false}` to disable.
- The highlight span is colorized with text-primary-600 and preserves the same sizing.
- `responsiveBreaks` inserts <br> between segments on md+ to reproduce the multi-line layout.
- Use `eyebrow` for small category labels above the headline.
*/

/* Example usages:

// 1) Match original snippet
<TopicHeading />

// 2) Centered on all breakpoints
<TopicHeading align="center" />

// 3) Non-uppercase, custom highlight color
<TopicHeading uppercase={false} highlightClassName="text-fuchsia-500" />

// 4) Semantic h1 with eyebrow label
<TopicHeading as="h1" eyebrow="Case Study" />

*/
