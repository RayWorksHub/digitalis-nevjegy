import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileCard } from "@/components/public-profile-card";
import { getPublicProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { appUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) return { title: "A profil nem található", robots: { index: false } };
  const description = profile.bio || `${profile.display_name} digitális névjegye.`;
  return {
    title: profile.display_name,
    description,
    alternates: { canonical: appUrl(`/${profile.slug}`) },
    openGraph: { title: profile.display_name, description, type: "profile", images: [] },
    twitter: { title: profile.display_name, description, images: [] }
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) notFound();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const ownerView = Boolean(profile.owner_id && profile.owner_id === data.user?.id);

  const style = { "--profile-accent": profile.accent_color } as CSSProperties;
  return (
    <main className={`public-profile-page theme-${profile.theme}`} style={style}>
      <div className="public-profile-backdrop" />
      <PublicProfileCard profile={profile} profileUrl={appUrl(`/${profile.slug}`)} ownerView={ownerView} />
    </main>
  );
}
