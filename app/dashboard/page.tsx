import Link from "next/link";
import { BarChart3, ContactRound, ExternalLink, MousePointerClick, QrCode, UserRound, UsersRound } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { MiniProfilePreview } from "@/components/mini-profile-preview";
import { demoProfile, PUBLIC_HOST } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getAnalytics, getOwnedProfile } from "@/lib/supabase/profile";
import { isDemoMode } from "@/lib/utils";

export default async function DashboardPage() {
  const demo = isDemoMode();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const profile = demo ? demoProfile : data.user ? await getOwnedProfile(data.user.id) : null;
  const analytics = profile ? await getAnalytics(profile.id) : { totalViews: 0, totalSaves: 0, totalClicks: 0, last30Days: [], topActions: [] };

  if (!profile) {
    return (
      <div className="dashboard-page empty-dashboard">
        <span className="empty-icon"><ContactRound size={36} /></span>
        <h1>Készítsd el az első névjegyedet</h1>
        <p>Add meg a kapcsolati adataidat, válassz egyedi címet és máris megoszthatod QR-kóddal.</p>
        <Link className="button button-primary" href="/dashboard/profile">Névjegy létrehozása</Link>
      </div>
    );
  }

  const max = Math.max(...analytics.last30Days.map((item) => item.views), 1);
  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header">
        <div><span className="dashboard-kicker">Áttekintés</span><h1>Jó napot, {profile.display_name.split(" ").slice(-1)[0]}!</h1><p>Így teljesít a digitális névjegyed.</p></div>
        <div className="inline-actions"><Link className="button button-secondary" href={`/${profile.slug}`} target="_blank">Profil megnyitása <ExternalLink size={17} /></Link><Link className="button button-primary" href="/dashboard/profile">Szerkesztés</Link></div>
      </header>

      <section className="stats-grid" aria-label="Fő statisztikák">
        <DashboardStatCard icon={UsersRound} label="Profilmegtekintés" value={analytics.totalViews} note="elmúlt 30 nap" />
        <DashboardStatCard icon={UserRound} label="Kapcsolatmentés" value={analytics.totalSaves} note="vCard letöltés" />
        <DashboardStatCard icon={MousePointerClick} label="Hivatkozáskattintás" value={analytics.totalClicks} note="összes művelet" />
      </section>

      <div className="dashboard-two-column">
        <section className="dashboard-panel analytics-panel">
          <div className="panel-heading"><div><span className="panel-icon"><BarChart3 size={19} /></span><h2>Megtekintések</h2></div><Link href="/dashboard/analytics">Részletek</Link></div>
          <div className="bar-chart" aria-label="Profilmegtekintések az elmúlt napokban">
            {analytics.last30Days.length ? analytics.last30Days.map((item) => <div className="bar-column" key={item.day}><div className="bar-value">{item.views}</div><div className="bar" style={{ height: `${Math.max(10, (item.views / max) * 160)}px` }} /><span>{item.day}</span></div>) : <p className="empty-chart">Még nincs elegendő adat a grafikonhoz.</p>}
          </div>
        </section>
        <section className="dashboard-panel profile-preview-panel">
          <div className="panel-heading"><div><span className="panel-icon"><QrCode size={19} /></span><h2>A névjegyed</h2></div></div>
          <MiniProfilePreview profile={profile} />
          <p className="profile-url">{PUBLIC_HOST}/<strong>{profile.slug}</strong></p>
        </section>
      </div>
    </div>
  );
}
