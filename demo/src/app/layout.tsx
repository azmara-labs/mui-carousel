import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import Providers from "./providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "React Material UI Carousel Demo",
  description:
    "MUI Carousel React - A Generic, extendible Carousel UI component for React using Material UI",
  icons: {
    icon: "/A.png",
    apple: "/A.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
