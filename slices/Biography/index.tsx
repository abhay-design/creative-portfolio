import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, JSXMapSerializer } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { PrismicRichText } from "@prismicio/react";
import Button from "../../app/components/Button";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Biography`.
 */
const components: JSXMapSerializer = {
  heading1: ({ children }) => (
    <Heading as="h1" size="xl" className="text-[20px!important]">
      {children}
    </Heading>
  ),
  paragraph: ({ children }) => (
    <p className="text-[20px] font-normal leading-[36px] text-[rgb(203, 213, 225)]">
      {children}
    </p>
  ),
};

export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography: FC<BiographyProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading as="h1" size="xl" className="col-start-1">
          {slice.primary.heading}
        </Heading>
        <div
          className="col-start-1 max-w-[744px]
  "
        >
          <PrismicRichText
            field={slice.primary.description}
            components={components}
          ></PrismicRichText>
        </div>
        <Button
          linkField={slice.primary.button_link}
          label={slice.primary.button_text}
        />
        <PrismicNextImage
          field={slice.primary.avtar}
          className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
      </div>
    </Bounded>
  );
};

export default Biography;
