import Image from "next/image";
import { Globe2, Mail, Phone } from "lucide-react";
import type { Profile } from "@/lib/types";
import { APP_NAME } from "@/lib/constants";
import { initials } from "@/lib/utils";

export function MiniProfilePreview({ profile }: { profile: Profile }) {
  return (
    <div className={`mini-profile theme-${profile.theme}`} style={{ "--preview-accent": profile.accent_color } as React.CSSProperties}>
      <div className="mini-top"><span>{APP_NAME}</span><span>•••</span></div>
      {profile.avatar_url ? <Image src={profile.avatar_url} alt="" width={82} height={82} className="mini-avatar" /> : <div className="mini-avatar avatar-fallback">{initials(profile.display_name)}</div>}
      <h3>{profile.display_name || "A te neved"}</h3>
      <p>{profile.job_title || "Beosztás"}</p>
      <small>{profile.company || "Vállalkozás"}</small>
      <div className="mini-actions"><span><Phone size={16} /></span><span><Mail size={16} /></span><span><Globe2 size={16} /></span></div>
      <div className="mini-save">Kapcsolat mentése</div>
    </div>
  );
}
