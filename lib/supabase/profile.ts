import { cache } from "react";
import { demoProfile } from "@/lib/constants";
import { isDemoMode } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsSummary, Profile } from "@/lib/types";

export const getPublicProfile = cache(async (slug: string): Promise<Profile | null> => {
  if (isDemoMode()) return slug === demoProfile.slug ? demoProfile : null;

  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*, social_links(*)")
    .eq("slug", slug)
    .eq("is_public", true)
    .order("sort_order", { referencedTable: "social_links", ascending: true })
    .maybeSingle();

  return (data as Profile | null) ?? null;
});

export async function getOwnedProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*, social_links(*)")
    .eq("owner_id", userId)
    .order("sort_order", { referencedTable: "social_links", ascending: true })
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export async function getAnalytics(profileId: string): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      totalViews: 1284,
      totalSaves: 317,
      totalClicks: 492,
      last30Days: [
        { day: "Aug. 15.", views: 32, clicks: 9 },
        { day: "Aug. 16.", views: 41, clicks: 13 },
        { day: "Aug. 17.", views: 38, clicks: 11 },
        { day: "Aug. 18.", views: 55, clicks: 17 },
        { day: "Aug. 19.", views: 63, clicks: 22 },
        { day: "Aug. 20.", views: 76, clicks: 28 }
      ],
      topActions: [
        { label: "Kapcsolat mentése", count: 112 },
        { label: "Weboldal", count: 86 },
        { label: "Telefon", count: 64 },
        { label: "LinkedIn", count: 51 }
      ]
    };
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data } = await supabase
    .from("profile_events")
    .select("event_type, link_key, occurred_at")
    .eq("profile_id", profileId)
    .gte("occurred_at", since.toISOString())
    .order("occurred_at", { ascending: true });

  const events = data ?? [];
  const totalViews = events.filter((event) => event.event_type === "view").length;
  const totalSaves = events.filter((event) => event.event_type === "save").length;
  const totalClicks = events.filter((event) => !["view", "save"].includes(event.event_type)).length;
  const byDay = new Map<string, { views: number; clicks: number }>();
  const byAction = new Map<string, number>();

  events.forEach((event) => {
    const day = new Intl.DateTimeFormat("hu-HU", { month: "short", day: "numeric" }).format(
      new Date(event.occurred_at)
    );
    const current = byDay.get(day) ?? { views: 0, clicks: 0 };
    if (event.event_type === "view") current.views += 1;
    else if (event.event_type !== "save") current.clicks += 1;
    byDay.set(day, current);
    const action = event.link_key || event.event_type;
    byAction.set(action, (byAction.get(action) ?? 0) + 1);
  });

  return {
    totalViews,
    totalSaves,
    totalClicks,
    last30Days: Array.from(byDay, ([day, values]) => ({ day, ...values })),
    topActions: Array.from(byAction, ([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  };
}
