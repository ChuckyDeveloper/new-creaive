import React from "react";

/**
 * GradientSplitHeading � responsive headline with gradient text
 */

export type BreakBehavior =
  | "always"
  | "never"
  | "lg-hidden-xl-flex";

type AlignOption = "start" | "center" | "end";
type WidthOption = "full" | "auto";

export type GradientSplitHeadingProps = {
  textBefore?: string;
  textAfter?: string;
  breakBehavior?: BreakBehavior;
  as?: React.ElementType;
  wrapperClassName?: string;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  fontFamily?: string;
  uppercase?: boolean;
  align?: AlignOption;
  maxWidth?: string;
  width?: WidthOption;
  subText?: string;
  subClassName?: string;
  subAs?: "p" | "div" | "span";
};

const cx = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

export default function GradientSplitHeading({
  textBefore = "Products",
  textAfter = "& Solutions",
  breakBehavior = "lg-hidden-xl-flex",
  as: HeadingComponent = "h2",
  wrapperClassName,
  className,
  from = "from-primary-600",
  via = "via-primary-600",
  to = "to-complementary-600",
  fontFamily = "font-unitea",
  uppercase = true,
  align = "center",
  maxWidth = "max-w-full",
  width = "full",
  subText,
  subClassName,
  subAs: SubComponent = "p",
}: GradientSplitHeadingProps) {
  const sizes = cx(
    "text-[28px] leading-[28px]",
    "md:text-[38px] md:leading-[38px]",
    "lg:text-[40px] lg:leading-[45px]",
    "xl:text-[50px] xl:leading-[50px]"
  );

  const br =
    breakBehavior === "always"
      ? <br />
      : breakBehavior === "never"
      ? null
      : <br className="lg:hidden xl:flex" />;

  const alignCls = (() => {
    switch (align) {
      case "start":
        return cx(
          "text-left text-start",
          "md:text-left md:text-start",
          "lg:text-left lg:text-start",
          "xl:text-left xl:text-start"
        );
      case "end":
        return cx(
          "text-right text-end",
          "md:text-right md:text-end",
          "lg:text-right lg:text-end",
          "xl:text-right xl:text-end"
        );
      case "center":
      default:
        return cx(
          "text-center",
          "md:text-center",
          "lg:text-center",
          "xl:text-center"
        );
    }
  })();

  const wrapperAlign = (() => {
    switch (align) {
      case "start":
        return "items-start md:items-start lg:items-start xl:items-start";
      case "end":
        return "items-end md:items-end lg:items-end xl:items-end";
      default:
        return "items-center md:items-center lg:items-center xl:items-center";
    }
  })();

  const widthClass = width === "auto" ? "w-auto" : "w-full";

  const HeadingTag = HeadingComponent as React.ElementType;
  const SubTag = SubComponent as React.ElementType;

  return (
    <div className={cx("py-[10vh] px-4 w-full", wrapperClassName)}>
      <div
        className={cx(
          "w-full mx-auto",
          maxWidth,
          width === "auto" && "flex flex-col",
          width === "auto" && wrapperAlign
        )}
      >
        <HeadingTag
          className={cx(
            widthClass,
            "font-black py-8 inline-block text-transparent bg-clip-text",
            sizes,
            fontFamily,
            uppercase && "uppercase",
            "bg-gradient-to-r",
            from,
            via,
            to,
            alignCls,
            className
          )}
        >
          {textBefore} {br} {textAfter}
        </HeadingTag>

        {subText ? (
          <SubTag
            className={cx(
              "mt-2 md:mt-3 text-sm md:text-base text-slate-500",
              alignCls,
              subClassName
            )}
          >
            {subText}
          </SubTag>
        ) : null}
      </div>
    </div>
  );
}

/* CTO/Lead notes:
- Grid dependencies removed. The component now uses a simple block wrapper + optional `maxWidth` container.
- `align` applies at all breakpoints and wins over any external utilities due to being placed last.
- Keep it drop-in: you can still position this component anywhere; it no longer assumes a 12-col layout.
- To place alongside other columns, wrap it in your grid at the page level and let this component remain layout-agnostic.

Examples:
<GradientSplitHeading />
<GradientSplitHeading align="start" />
<GradientSplitHeading align="end" maxWidth="max-w-3xl" />
*/

