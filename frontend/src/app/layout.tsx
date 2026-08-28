import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSettings } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.site_name} — Mongolia Tours & Travel`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Header settings={settings} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
