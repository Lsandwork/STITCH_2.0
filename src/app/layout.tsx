import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.tagline,
  applicationName: BRAND.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/assets/stitch/brand/png/stitch-mark.png", type: "image/png" },
    ],
    apple: [{ url: "/assets/stitch/brand/png/stitch-mark.png" }],
  },
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    siteName: BRAND.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#f46f61",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-stitch-cream font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
