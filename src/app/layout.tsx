import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Manrope, Tiro_Devanagari_Hindi } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { PageTransitionProvider } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { brand, siteUrl } from "@/content/brand";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Only used for small Devanagari accents — not worth a preload.
const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.fullName} — ${brand.tagline}`,
    template: `%s · ${brand.fullName}`,
  },
  description: brand.description,
  applicationName: brand.fullName,
  keywords: ["Himalayan coffee", "specialty coffee India", "Nagaland coffee", "single origin", "Pahari", "Mahvé"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.fullName,
    title: `${brand.fullName} — ${brand.tagline}`,
    description: brand.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.fullName} — ${brand.tagline}`,
    description: brand.description,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0907",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${manrope.variable} ${tiro.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-gold px-5 py-3 text-sm text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <PageTransitionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </PageTransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
