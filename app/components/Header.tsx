import React from "react";
import { createClient } from "@prismicio/client";
import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";

export default async function Header() {
  const client = createClient("mycreative-portfolio1");
  const settings = await client.getSingle("settings");

  console.log(settings);

  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <nav>
        <ul>
          <li>
            <Link href="/" aria-label="homepage">
              {settings.data.name}
            </Link>
          </li>
          {settings.data.nav_item.map(({ link, label }, index) => (
            <li key={index}>
              <PrismicNextLink field={link}>{label}</PrismicNextLink>
            </li>
          ))}

          <li></li>
        </ul>
      </nav>
    </header>
  );
}
