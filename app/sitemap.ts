import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: appUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: appUrl("/rajmund"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: appUrl("/adatvedelem"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: appUrl("/felhasznalasi-feltetelek"), lastModified: now, changeFrequency: "yearly", priority: 0.2 }
  ];
}
