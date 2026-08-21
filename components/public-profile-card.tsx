"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Facebook,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Share2,
  X,
  Youtube
} from "lucide-react";
import type { Profile, SocialLink } from "@/lib/types";
import { APP_NAME } from "@/lib/constants";
import { initials, safeUrl } from "@/lib/utils";

const socialIcons = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  github: Github,
  x: AtSign,
  tiktok: AtSign,
  custom: ExternalLink
};

async function track(profileId: string, eventType: string, linkKey = "") {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileId, eventType, linkKey }),
      keepalive: true
    });
  } catch {
    // Analytics must never interrupt a contact action.
  }
}

function SocialButton({ link, profileId }: { link: SocialLink; profileId: string }) {
  const Icon = socialIcons[link.platform] ?? ExternalLink;
  return (
    <a
      className="public-social"
      href={link.url}
      target="_blank"
      rel="noreferrer"
      aria-label={link.label}
      onClick={() => track(profileId, "social", link.label)}
    >
      <Icon size={19} />
    </a>
  );
}

export function PublicProfileCard({ profile, profileUrl, ownerView = false }: { profile: Profile; profileUrl: string; ownerView?: boolean }) {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const visibleSocials = useMemo(
    () => profile.social_links.filter((link) => link.enabled).sort((a, b) => a.sort_order - b.sort_order),
    [profile.social_links]
  );

  useEffect(() => {
    if (!ownerView) track(profile.id, "view");
  }, [ownerView, profile.id]);

  useEffect(() => {
    if (!qrOpen || qrUrl) return;
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(profileUrl, {
          width: 720,
          margin: 2,
          color: { dark: "#10233a", light: "#ffffff" },
          errorCorrectionLevel: "H"
        })
      )
      .then(setQrUrl)
      .catch(() => undefined);
  }, [profileUrl, qrOpen, qrUrl]);

  const share = async () => {
    track(profile.id, "share");
    if (navigator.share) {
      await navigator.share({ title: profile.display_name, text: `${profile.display_name} digitális névjegye`, url: profileUrl }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <article className="public-card">
        <div className="public-card-topbar">
          <span className="public-brand">{APP_NAME}</span>
          <div className="public-tools">
            {ownerView ? <Link className="public-owner-link" href="/dashboard"><ArrowLeft size={17} /><span>Fiókom</span></Link> : null}
            <button type="button" onClick={() => setQrOpen(true)} aria-label="QR-kód megjelenítése"><QrCode size={19} /></button>
            <button type="button" onClick={share} aria-label="Névjegy megosztása"><Share2 size={19} /></button>
          </div>
        </div>

        <div className="public-avatar-wrap">
          {profile.avatar_url ? (
            <Image className="public-avatar" src={profile.avatar_url} alt={`${profile.display_name} profilképe`} width={132} height={132} priority />
          ) : (
            <div className="public-avatar avatar-fallback" aria-hidden="true">{initials(profile.display_name)}</div>
          )}
        </div>

        <div className="public-identity">
          <h1>{profile.display_name}</h1>
          {profile.job_title && <p className="public-role">{profile.job_title}</p>}
          {profile.company && <p className="public-company">{profile.company}</p>}
        </div>

        <div className="public-primary-actions">
          {profile.phone && <a href={`tel:${profile.phone.replace(/\s/g, "")}`} onClick={() => track(profile.id, "phone", "Telefon")}><Phone size={20} /><span>Hívás</span></a>}
          {profile.public_email && <a href={`mailto:${profile.public_email}`} onClick={() => track(profile.id, "email", "E-mail")}><Mail size={20} /><span>E-mail</span></a>}
          {profile.website && <a href={safeUrl(profile.website)} target="_blank" rel="noreferrer" onClick={() => track(profile.id, "website", "Weboldal")}><Globe2 size={20} /><span>Weboldal</span></a>}
        </div>

        <a className="public-save-button" href={`/${profile.slug}/vcard`} onClick={() => track(profile.id, "save", "Kapcsolat mentése")}>
          <Download size={19} /> Kapcsolat mentése
        </a>

        {profile.bio && <p className="public-bio">{profile.bio}</p>}

        <div className="public-details">
          {profile.phone && <a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone size={18} /><span><small>Telefon</small>{profile.phone}</span></a>}
          {profile.public_email && <a href={`mailto:${profile.public_email}`}><Mail size={18} /><span><small>E-mail</small>{profile.public_email}</span></a>}
          {profile.website && <a href={safeUrl(profile.website)} target="_blank" rel="noreferrer"><Globe2 size={18} /><span><small>Weboldal</small>{profile.website.replace(/^https?:\/\//, "")}</span></a>}
          {profile.address && <div><MapPin size={18} /><span><small>Hely</small>{profile.address}</span></div>}
        </div>

        {visibleSocials.length > 0 && (
          <div className="public-socials" aria-label="Közösségi oldalak">
            {visibleSocials.map((link) => <SocialButton key={`${link.platform}-${link.url}`} link={link} profileId={profile.id} />)}
          </div>
        )}

        <div className="public-card-footer">
          <span>Digitális névjegy az E-névjeggyel</span>
          <Link href="/">Sajátot készítek</Link>
        </div>
      </article>

      {qrOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setQrOpen(false)}>
          <section className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setQrOpen(false)} aria-label="Bezárás"><X size={20} /></button>
            <span className="eyebrow">Beolvasás telefonnal</span>
            <h2 id="qr-title">{profile.display_name} névjegye</h2>
            <div className="qr-image-wrap">
              {qrUrl ? <Image src={qrUrl} alt="A névjegy QR-kódja" width={280} height={280} unoptimized /> : <div className="qr-loading">QR-kód készül…</div>}
            </div>
            <button className="button button-secondary button-full" type="button" onClick={copy}>
              {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Hivatkozás másolva" : "Hivatkozás másolása"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
