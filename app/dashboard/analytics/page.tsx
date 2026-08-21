import { BarChart3, Download, MousePointerClick, UserRound, UsersRound } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { demoProfile } from "@/lib/constants";
import { getAnalytics, getOwnedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/utils";

export default async function AnalyticsPage() {
  const demo = isDemoMode();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const profile = demo ? demoProfile : data.user ? await getOwnedProfile(data.user.id) : null;
  const analytics = profile ? await getAnalytics(profile.id) : { totalViews: 0, totalSaves: 0, totalClicks: 0, last30Days: [], topActions: [] };
  const max = Math.max(...analytics.last30Days.map((item) => Math.max(item.views, item.clicks)), 1);

  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header"><div><span className="dashboard-kicker">Statisztikák</span><h1>Kapcsolódási adatok</h1><p>Az elmúlt 30 nap összesített, személyazonosításra nem alkalmas eseményei.</p></div><button className="button button-secondary" disabled><Download size={17} /> CSV-export hamarosan</button></header>
      <section className="stats-grid"><DashboardStatCard icon={UsersRound} label="Profilmegtekintés" value={analytics.totalViews} note="30 nap" /><DashboardStatCard icon={UserRound} label="Kapcsolatmentés" value={analytics.totalSaves} note="vCard" /><DashboardStatCard icon={MousePointerClick} label="Kattintások" value={analytics.totalClicks} note="összes" /></section>
      <section className="dashboard-panel analytics-large-panel">
        <div className="panel-heading"><div><span className="panel-icon"><BarChart3 size={19} /></span><h2>Napi aktivitás</h2></div><div className="chart-legend"><span><i className="legend-view" /> Megtekintés</span><span><i className="legend-click" /> Kattintás</span></div></div>
        <div className="dual-chart">
          {analytics.last30Days.length ? analytics.last30Days.map((item) => <div className="dual-column" key={item.day}><div className="dual-bars"><i className="views" style={{ height: `${Math.max(8, (item.views / max) * 190)}px` }} title={`${item.views} megtekintés`} /><i className="clicks" style={{ height: `${Math.max(5, (item.clicks / max) * 190)}px` }} title={`${item.clicks} kattintás`} /></div><span>{item.day}</span></div>) : <p className="empty-chart">Még nincs megjeleníthető aktivitás.</p>}
        </div>
      </section>
      <section className="dashboard-panel actions-table-panel">
        <div className="panel-heading"><div><span className="panel-icon"><MousePointerClick size={19} /></span><h2>Leggyakoribb műveletek</h2></div></div>
        <div className="actions-table"><div className="actions-table-row header"><span>Művelet</span><span>Darabszám</span><span>Arány</span></div>{analytics.topActions.map((item) => { const ratio = analytics.totalClicks + analytics.totalSaves ? Math.round((item.count / (analytics.totalClicks + analytics.totalSaves)) * 100) : 0; return <div className="actions-table-row" key={item.label}><strong>{item.label}</strong><span>{item.count}</span><span><i style={{ width: `${ratio}%` }} />{ratio}%</span></div>; })}</div>
      </section>
    </div>
  );
}
