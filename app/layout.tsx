import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Digitális névjegy",
  description: "Digitális névjegykártya szolgáltatás",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
