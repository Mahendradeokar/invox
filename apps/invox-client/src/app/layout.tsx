import { Toaster } from "~/components/ui/sonner";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Invox",
    template: "%s | Invox",
  },
  description:
    "Invox is an AI-powered tool for customizing invoice templates. It supports project management, intelligent template customization, versioning, and real-time previews—all within a Turbo monorepo setup.",
  applicationName: "Invox",
  generator: "Next.js",
  keywords: [
    "Invox AI",
    "AI invoice customizer",
    "AI template",
    "AI template generator",
    "AI template builder",
    "AI invoice generator",
    "AI invoice template generator",
    "invoice templates",
    "template customization",
    "downloadable templates",
    "invoice generator",
    "invoice builder",
  ],
  authors: [
    { name: "Mahendra Devkar", url: "http://mahendra-devkar.vercel.app/me" },
  ],
  creator: "Mahendra Devkar",
  publisher: "Invox",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Invox",
    description:
      "Invox is an AI-powered tool for customizing invoice templates. It supports project management, intelligent template customization, versioning, and real-time previews—all within a Turbo monorepo setup.",
    url: "https://invox-ai.vercel.app/",
    siteName: "Invox",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Invox Logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invox",
    description:
      "Invox is an AI-powered tool for customizing invoice templates. It supports project management, intelligent template customization, versioning, and real-time previews—all within a Turbo monorepo setup.",
    images: ["/android-chrome-512x512.png"],
    creator: "@MSDeokar",
  },
  metadataBase: new URL("https://invox-ai.vercel.app/"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
