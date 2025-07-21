"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { asImageSrc, isFilled } from "@prismicio/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import { Content } from "@prismicio/client";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: Content.ProjectPostDocument[];
  fallbackItemImage: Content.ContentindexSlice["items"][0]["fallback_item_img"];
  viewMoreText?: string;
};

export default function ContentList({
  items,
  fallbackItemImage,
  viewMoreText = "Read More",
}: ContentListProps) {
  const component = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const revealRef = useRef<HTMLDivElement>(null);

  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const [hovering, setHovering] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const urlPrefix = "/project";

  // Animation for list items
  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, component);

    return () => ctx.revert();
  }, []);

  // Mouse movement handler with throttling
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!revealRef.current) return;

      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      const ctx = gsap.context(() => {
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 410),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 460),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.3,
          });

          gsap.to(revealRef.current, {
            opacity: hovering ? 1 : 0,
            visibility: "visible",
            ease: "power3.out",
            duration: 0.4,
          });
        }
        lastMousePos.current = mousePos;
      }, component);

      return () => ctx.revert();
    },
    [hovering, currentItem]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
    setHovering(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
    setCurrentItem(null);
  };

  // Prepare and preload images
  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_img)
      ? item.data.hover_img
      : fallbackItemImage;
    return image
      ? asImageSrc(image, {
          fit: "crop",
          w: 220,
          h: 320,
          exp: -10,
        })
      : null;
  });

  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <div className="relative">
      <ul
        ref={component}
        className="grid border-b border-b-slate-100"
        onMouseLeave={onMouseLeave}
      >
        {items.map((project, index) => (
          <li
            key={index}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            onMouseEnter={() => onMouseEnter(index)}
            className="list-item opacity-0"
          >
            <a
              href={`${urlPrefix}/${project.uid}`}
              className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
              aria-label={project.data.title || "Project"}
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold">
                  {project.data.title || "Untitled Project"}
                </span>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-3 text-yellow-400">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-lg font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                {viewMoreText} <MdArrowOutward />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Hover element */}
      <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null && contentImages[currentItem]
              ? `url(${contentImages[currentItem]})`
              : "",
        }}
        ref={revealRef}
      />
    </div>
  );
}
