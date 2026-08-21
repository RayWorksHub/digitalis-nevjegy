import type { Profile } from "@/lib/types";

export function appUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function safeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function escapeVCard(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function createVCard(profile: Profile) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(profile.display_name)}`,
    `N:${escapeVCard(profile.display_name)};;;;`,
    profile.company ? `ORG:${escapeVCard(profile.company)}` : "",
    profile.job_title ? `TITLE:${escapeVCard(profile.job_title)}` : "",
    profile.phone ? `TEL;TYPE=CELL:${escapeVCard(profile.phone)}` : "",
    profile.public_email
      ? `EMAIL;TYPE=INTERNET:${escapeVCard(profile.public_email)}`
      : "",
    profile.website ? `URL:${escapeVCard(safeUrl(profile.website))}` : "",
    profile.address ? `ADR;TYPE=WORK:;;${escapeVCard(profile.address)};;;;` : "",
    profile.bio ? `NOTE:${escapeVCard(profile.bio)}` : "",
    `REV:${new Date(profile.updated_at).toISOString()}`,
    "END:VCARD"
  ];
  return lines.filter(Boolean).join("\r\n");
}

export function isDemoMode() {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("hu-HU").format(value);
}
