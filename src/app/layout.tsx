import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/seo";
import { Toaster } from "sonner";
import { TrackingProvider } from "@/components/TrackingProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: { title: siteConfig.name, description: siteConfig.description, type: "website" },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <TrackingProvider>
          <Navbar />
          <main className="container-main py-8 md:py-12">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </TrackingProvider>
      </body>
    </html>
  );
}

