import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E-névjegy – digitális névjegykártya",
    short_name: "E-névjegy",
    description: "QR- és NFC-kompatibilis digitális névjegykártya.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f7f2",
    theme_color: "#087f73",
    lang: "hu",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
