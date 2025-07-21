import React from "react";
import { Content, createClient } from "@prismicio/client";
import { SliceComponentProps, JSXMapSerializer } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { PrismicRichText } from "@prismicio/react";
import ContentList from "./ContentList";

const components: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="text-[20px] font-normal leading-[36px] text-[rgb(203, 213, 225)]">
      {children}
    </p>
  ),
};

export type ContentindexProps = SliceComponentProps<Content.ContentindexSlice>;

const ContentIndex = async ({
  slice,
}: ContentindexProps): Promise<React.JSX.Element> => {
  const client = createClient("mycreative-portfolio1");
  const projects = await client.getAllByType("project_post");
  console.log(projects);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>
      <div>
        <PrismicRichText
          field={slice.primary.description}
          components={components}
        />
      </div>
      <ContentList
        items={projects}
        viewMoreText={slice.items[0]?.view_more_text ?? "Read More"}
        fallbackItemImage={slice.items[0]?.fallback_item_img ?? null}
      />
    </Bounded>
  );
};

export default ContentIndex;
