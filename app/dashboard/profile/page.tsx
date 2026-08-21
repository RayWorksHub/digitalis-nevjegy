import { ProfileEditor } from "@/components/profile-editor";
import { demoProfile } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getOwnedProfile } from "@/lib/supabase/profile";
import { isDemoMode } from "@/lib/utils";

export default async function ProfileEditorPage() {
  const demo = isDemoMode();
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const profile = demo ? demoProfile : data.user ? await getOwnedProfile(data.user.id) : null;
  const email = demo ? "info@rayworks.hu" : data.user?.email || "";
  const fullName = demo ? "Csukárdi Rajmund" : (data.user?.user_metadata.full_name as string | undefined) || "";

  return <div className="dashboard-page editor-page"><ProfileEditor initialProfile={profile} email={email} fullName={fullName} /></div>;
}
