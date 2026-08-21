import { AccountSettings } from "@/components/account-settings";
import { ShareTools } from "@/components/share-tools";
import { demoProfile } from "@/lib/constants";
import { getOwnedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { appUrl, isDemoMode } from "@/lib/utils";

export default async function SettingsPage() {
  const demo = isDemoMode();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const profile = demo ? demoProfile : data.user ? await getOwnedProfile(data.user.id) : null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header"><div><span className="dashboard-kicker">Beállítások</span><h1>Megosztás és fiók</h1><p>QR-kód, NFC-kártya és személyes adatok kezelése.</p></div></header>
      {profile ? <ShareTools profileUrl={appUrl(`/${profile.slug}`)} displayName={profile.display_name} /> : <section className="settings-panel"><p>Előbb hozd létre a névjegyedet a megosztási eszközök használatához.</p></section>}
      <AccountSettings />
    </div>
  );
}
