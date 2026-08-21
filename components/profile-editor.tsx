"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2
} from "lucide-react";
import { MiniProfilePreview } from "@/components/mini-profile-preview";
import { emptyProfileInput, PUBLIC_HOST } from "@/lib/constants";
import type { Profile, ProfileInput, SocialLink, SocialPlatform, ThemeName } from "@/lib/types";
import { isDemoMode, normalizeSlug, safeUrl } from "@/lib/utils";

const themes: Array<{ value: ThemeName; label: string; colors: string[] }> = [
  { value: "midnight", label: "Éjféli", colors: ["#10233a", "#087f73"] },
  { value: "ivory", label: "Elefántcsont", colors: ["#fffdf7", "#d5a84f"] },
  { value: "forest", label: "Erdő", colors: ["#17362f", "#55d6be"] },
  { value: "plum", label: "Szilva", colors: ["#3c2147", "#d69ad7"] }
];

const platforms: Array<{ value: SocialPlatform; label: string }> = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X" },
  { value: "github", label: "GitHub" },
  { value: "custom", label: "Egyéb" }
];

function toInput(profile: Profile | null): ProfileInput {
  if (!profile) return { ...emptyProfileInput, social_links: [] };
  return {
    slug: profile.slug,
    display_name: profile.display_name,
    job_title: profile.job_title,
    company: profile.company,
    bio: profile.bio,
    public_email: profile.public_email,
    phone: profile.phone,
    website: profile.website,
    address: profile.address,
    avatar_url: profile.avatar_url,
    theme: profile.theme,
    accent_color: profile.accent_color,
    is_public: profile.is_public,
    social_links: profile.social_links
  };
}

export function ProfileEditor({ initialProfile, email, fullName }: { initialProfile: Profile | null; email: string; fullName: string }) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(initialProfile);
  const [form, setForm] = useState<ProfileInput>(() => {
    const value = toInput(initialProfile);
    if (!value.display_name) value.display_name = fullName;
    if (!value.public_email) value.public_email = email;
    if (!value.slug) value.slug = normalizeSlug(fullName);
    return value;
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const saveComplete = message.startsWith("A névjegyed frissítése") || message.startsWith("A bemutató nézet frissült");

  const preview = useMemo<Profile>(() => ({
    id: currentProfile?.id || "00000000-0000-4000-8000-000000000000",
    owner_id: currentProfile?.owner_id || null,
    views_count: currentProfile?.views_count || 0,
    saves_count: currentProfile?.saves_count || 0,
    created_at: currentProfile?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...form
  }), [currentProfile, form]);

  const update = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => {
    setMessage("");
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addSocial = () => {
    const next: SocialLink = { platform: "linkedin", label: "LinkedIn", url: "", sort_order: form.social_links.length, enabled: true };
    update("social_links", [...form.social_links, next]);
  };

  const updateSocial = (index: number, changes: Partial<SocialLink>) => {
    update("social_links", form.social_links.map((link, position) => position === index ? { ...link, ...changes } : link));
  };

  const removeSocial = (index: number) => {
    update("social_links", form.social_links.filter((_, position) => position !== index).map((link, position) => ({ ...link, sort_order: position })));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    if (isDemoMode()) {
      setTimeout(() => {
        setSaving(false);
        setMessage("A bemutató nézet frissült. Az éles adatmentés a szolgáltatás összekötése után működik.");
      }, 500);
      return;
    }

    try {
      const socialLinks = form.social_links.flatMap((link) => {
        const rawUrl = link.url.trim();
        if (!rawUrl || /^(https?:\/\/)?$/i.test(rawUrl)) return [];
        return [{ ...link, url: safeUrl(rawUrl) }];
      });
      const normalized = {
        ...form,
        slug: normalizeSlug(form.slug),
        website: form.website ? safeUrl(form.website) : "",
        social_links: socialLinks
      };
      const response = await fetch("/api/profile", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(normalized) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "A profil nem menthető.");
      const savedProfile = payload.profile as Profile;
      setCurrentProfile(savedProfile);
      setForm(toInput(savedProfile));
      setMessage("A névjegyed frissítése sikeresen mentve.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A profil nem menthető.");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (isDemoMode()) {
      setError("A képfeltöltés az éles tárhely összekötése után aktiválódik.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/avatar", { method: "POST", body: data });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "A kép nem tölthető fel.");
      update("avatar_url", payload.url);
      setMessage("A profilkép feltöltve. A teljes profil mentéséhez kattints a Mentés gombra.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A kép nem tölthető fel.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <form onSubmit={save}>
      <header className="dashboard-page-header editor-header">
        <div><span className="dashboard-kicker">{currentProfile ? "Névjegy szerkesztése" : "Névjegy létrehozása"}</span><h1>A digitális profilod</h1><p>Töltsd ki az adatokat, majd mentsd el a névjegyedet.</p></div>
        <div className="inline-actions">
          {currentProfile && <a className="button button-secondary" href={`/${form.slug}`} target="_blank" rel="noreferrer"><Eye size={17} /> Profil megnyitása</a>}
          <button className="button button-primary editor-save-main" type="submit" disabled={saving}>{saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />} {currentProfile ? "Módosítások mentése" : "Profil létrehozása"}</button>
        </div>
      </header>

      {error && <div className="form-message error" role="alert">{error}</div>}
      {message && <div className="form-message success" role="status"><Check size={18} /> {message}</div>}

      <div className="editor-layout">
        <div className="editor-sections">
          <section className="editor-panel">
            <div className="editor-panel-heading"><div><span>1</span><h2>Alapadatok</h2></div><p>Ezek jelennek meg legfelül a névjegyeden.</p></div>
            <div className="avatar-editor">
              <div className="avatar-editor-image">
                {form.avatar_url ? <Image src={form.avatar_url} alt="Profilkép" width={88} height={88} /> : <ImagePlus size={28} />}
              </div>
              <div><strong>Profilkép</strong><p>JPG, PNG vagy WebP, legfeljebb 3 MB.</p><button className="button button-secondary button-small" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? <Loader2 className="spin" size={16} /> : <ImagePlus size={16} />} Kép feltöltése</button><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} hidden /></div>
            </div>
            <div className="form-grid two">
              <label className="field"><span>Név *</span><span className="input-wrap"><input name="display_name" autoComplete="name" value={form.display_name} onChange={(e) => update("display_name", e.target.value)} maxLength={80} required /></span></label>
              <label className="field"><span>Beosztás</span><span className="input-wrap"><input name="job_title" autoComplete="organization-title" value={form.job_title} onChange={(e) => update("job_title", e.target.value)} maxLength={100} placeholder="pl. ügyvezető" /></span></label>
              <label className="field"><span>Vállalkozás / szervezet</span><span className="input-wrap"><input name="company" autoComplete="organization" value={form.company} onChange={(e) => update("company", e.target.value)} maxLength={100} /></span></label>
              <label className="field"><span>Egyedi profilcím *</span><span className="slug-input"><span>{PUBLIC_HOST}/</span><input name="slug" autoCapitalize="none" autoCorrect="off" value={form.slug} onChange={(e) => update("slug", e.target.value)} onBlur={() => update("slug", normalizeSlug(form.slug))} minLength={3} maxLength={48} required /></span></label>
            </div>
            <label className="field"><span>Rövid bemutatkozás <small>{form.bio.length}/420</small></span><span className="input-wrap"><textarea name="bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} maxLength={420} placeholder="Mivel foglalkozol és miben tudsz segíteni?" /></span></label>
          </section>

          <section className="editor-panel">
            <div className="editor-panel-heading"><div><span>2</span><h2>Kapcsolati adatok</h2></div><p>Csak azt add meg, amit nyilvánosan is megosztanál.</p></div>
            <div className="form-grid two">
              <label className="field"><span>Nyilvános e-mail</span><span className="input-wrap"><input name="public_email" type="email" inputMode="email" autoComplete="email" value={form.public_email} onChange={(e) => update("public_email", e.target.value)} /></span></label>
              <label className="field"><span>Telefonszám</span><span className="input-wrap"><input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+36 30 123 4567" /></span></label>
              <label className="field"><span>Weboldal</span><span className="input-wrap"><input name="website" type="url" inputMode="url" autoCapitalize="none" autoCorrect="off" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." /></span></label>
              <label className="field"><span>Hely / cím</span><span className="input-wrap"><input name="address" autoComplete="street-address" value={form.address} onChange={(e) => update("address", e.target.value)} /></span></label>
            </div>
          </section>

          <section className="editor-panel">
            <div className="editor-panel-heading inline"><div><span>3</span><h2>Közösségi hivatkozások</h2></div><button className="button button-secondary button-small" type="button" onClick={addSocial} disabled={form.social_links.length >= 10}><Plus size={16} /> Új hivatkozás</button></div>
            <div className="social-editor-list">
              {form.social_links.length === 0 && <p className="editor-empty">Még nincs közösségi hivatkozásod.</p>}
              {form.social_links.map((link, index) => (
                <div className="social-editor-row" key={index}>
                  <GripVertical size={17} className="drag-icon" />
                  <select value={link.platform} onChange={(e) => { const platform = e.target.value as SocialPlatform; updateSocial(index, { platform, label: platforms.find((item) => item.value === platform)?.label || link.label }); }}>{platforms.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select>
                  <input type="url" inputMode="url" autoCapitalize="none" autoCorrect="off" aria-label="Hivatkozás címe" value={link.url} onChange={(e) => updateSocial(index, { url: e.target.value })} placeholder="https://..." />
                  <button type="button" className="icon-button" onClick={() => updateSocial(index, { enabled: !link.enabled })} aria-label={link.enabled ? "Elrejtés" : "Megjelenítés"}>{link.enabled ? <Eye size={17} /> : <EyeOff size={17} />}</button>
                  <button type="button" className="icon-button danger" onClick={() => removeSocial(index)} aria-label="Törlés"><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="editor-panel">
            <div className="editor-panel-heading"><div><span>4</span><h2>Megjelenés és láthatóság</h2></div><p>Válassz hangulatot, majd finomítsd a kiemelőszínt.</p></div>
            <div className="theme-picker">
              {themes.map((theme) => <button type="button" key={theme.value} className={form.theme === theme.value ? "selected" : ""} onClick={() => update("theme", theme.value)}><span className="theme-swatch" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />{theme.label}{form.theme === theme.value && <Check size={15} />}</button>)}
            </div>
            <div className="appearance-row">
              <label><span>Kiemelőszín</span><input type="color" value={form.accent_color} onChange={(e) => update("accent_color", e.target.value)} /></label>
              <label className="visibility-toggle"><input type="checkbox" checked={form.is_public} onChange={(e) => update("is_public", e.target.checked)} /><span className="toggle-track" /><span><strong>{form.is_public ? "Nyilvános profil" : "Rejtett profil"}</strong><small>{form.is_public ? "A névjegy hivatkozással megnyitható." : "A névjegyet csak te látod."}</small></span></label>
            </div>
          </section>
        </div>

        <aside className="editor-preview-column">
          <div className="sticky-preview"><span className="dashboard-kicker">Élő előnézet</span><MiniProfilePreview profile={preview} /><p>A végleges mobilnézet ennél részletesebb lesz.</p></div>
        </aside>
      </div>

      <div className="mobile-save-bar">
        {(error || message) && <span className={error ? "error" : "success"} aria-live="polite">{error || (saveComplete ? "Sikeresen mentve" : message)}</span>}
        <button className="button button-primary button-full" type="submit" disabled={saving}>
          {saving ? <Loader2 className="spin" size={18} /> : saveComplete ? <Check size={18} /> : <Save size={18} />}
          {saving ? "Mentés folyamatban…" : saveComplete ? "Mentve" : currentProfile ? "Módosítások mentése" : "Profil létrehozása és mentése"}
        </button>
      </div>
    </form>
  );
}
