import type { Profile } from "@/lib/types";

export const APP_NAME = "E-névjegy";
export const PUBLIC_HOST = (
  process.env.NEXT_PUBLIC_APP_URL || "https://e-nevjegy.vercel.app"
)
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");
export const APP_DESCRIPTION =
  "Digitális névjegykártya QR-kóddal, NFC-megosztással és azonnal menthető kapcsolati adatokkal.";

export const demoProfile: Profile = {
  id: "00000000-0000-4000-8000-000000000001",
  owner_id: null,
  slug: "rajmund",
  display_name: "Csukárdi Rajmund",
  job_title: "Fejlesztő · tanácsadó",
  company: "RayWorks | IT Solutions",
  bio: "Emberközpontú digitális megoldásokat készítek vállalkozásoknak – az ötlettől a működő rendszerig.",
  public_email: "info@rayworks.hu",
  phone: "+36 70 298 0003",
  website: "https://rayworks.hu",
  address: "Budapest, Magyarország",
  avatar_url: null,
  theme: "midnight",
  accent_color: "#55d6be",
  is_public: true,
  views_count: 1284,
  saves_count: 317,
  created_at: "2026-08-20T12:00:00.000Z",
  updated_at: "2026-08-20T12:00:00.000Z",
  social_links: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com",
      sort_order: 0,
      enabled: true
    },
    {
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com",
      sort_order: 1,
      enabled: true
    }
  ]
};

export const emptyProfileInput = {
  slug: "",
  display_name: "",
  job_title: "",
  company: "",
  bio: "",
  public_email: "",
  phone: "",
  website: "",
  address: "",
  avatar_url: null,
  theme: "midnight" as const,
  accent_color: "#55d6be",
  is_public: true,
  social_links: []
};
