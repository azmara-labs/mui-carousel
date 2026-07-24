import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "React Material UI Carousel Demo",
    short_name: "MUI Carousel",
    description:
      "MUI Carousel React - A Generic, extendible Carousel UI component for React using Material UI",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/A.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
