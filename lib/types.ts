export type ThemeName = "midnight" | "ivory" | "forest" | "plum";

export type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "github"
  | "custom";

export type SocialLink = {
  id?: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  sort_order: number;
  enabled: boolean;
};

export type Profile = {
  id: string;
  owner_id: string | null;
  slug: string;
  display_name: string;
  job_title: string;
  company: string;
  bio: string;
  public_email: string;
  phone: string;
  website: string;
  address: string;
  avatar_url: string | null;
  theme: ThemeName;
  accent_color: string;
  is_public: boolean;
  views_count: number;
  saves_count: number;
  created_at: string;
  updated_at: string;
  social_links: SocialLink[];
};

export type AnalyticsSummary = {
  totalViews: number;
  totalSaves: number;
  totalClicks: number;
  last30Days: Array<{ day: string; views: number; clicks: number }>;
  topActions: Array<{ label: string; count: number }>;
};

export type ProfileInput = Pick<
  Profile,
  | "slug"
  | "display_name"
  | "job_title"
  | "company"
  | "bio"
  | "public_email"
  | "phone"
  | "website"
  | "address"
  | "avatar_url"
  | "theme"
  | "accent_color"
  | "is_public"
  | "social_links"
>;
