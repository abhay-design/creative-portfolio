import React from "react";
import { createClient } from "@prismicio/client";
import NavBar from "./Navbar";

export default async function Header() {
  const client = createClient("mycreative-portfolio1");
  const settings = await client.getSingle("settings");

  console.log(settings);

  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}
