import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { DashboardMobileHeaderAction, DashboardMobileNav, DashboardNav } from "@/components/dashboard-nav";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const demo = isDemoMode();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!demo && !data.user) redirect("/auth/sign-in");

  const displayName = demo ? "Csukárdi Rajmund" : (data.user?.user_metadata.full_name as string | undefined) || data.user?.email || "Felhasználó";
  const email = demo ? "info@rayworks.hu" : data.user?.email || "";

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Logo />
        <div className="dashboard-account"><span>{displayName.slice(0, 1).toUpperCase()}</span><div><strong>{displayName}</strong><small>{email}</small></div></div>
        <DashboardNav />
        <div className="dashboard-plan"><strong>Ingyenes csomag</strong><p>Minden alapfunkció aktív.</p><span>0 Ft / hó</span></div>
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-mobile-header"><Logo /><DashboardMobileHeaderAction /></header>
        {demo && <div className="demo-banner">Bemutató mód – az éles mentés az adatbázis összekötése után aktiválódik.</div>}
        {children}
      </section>
      <DashboardMobileNav />
    </main>
  );
}
