import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { appUrl } from "@/lib/utils";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: { default: `${APP_NAME} – digitális névjegykártya`, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ["digitális névjegykártya", "QR névjegy", "NFC névjegy", "vCard"],
  openGraph: {
    title: `${APP_NAME} – egy érintés, és megjegyeznek`,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "hu_HU"
  },
  twitter: { card: "summary_large_image", title: APP_NAME, description: APP_DESCRIPTION },
  icons: { icon: "/icon.svg", apple: "/icon.svg" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#087f73"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
