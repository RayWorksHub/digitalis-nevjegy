import type { Profile } from "@/lib/types";

const ANDROID_USER_AGENT = /android/i;

function intentExtra(value: string, maxLength: number) {
  return encodeURIComponent(value.trim().slice(0, maxLength));
}

export function isAndroidUserAgent(userAgent: string) {
  return ANDROID_USER_AGENT.test(userAgent);
}

/**
 * Builds an Android ACTION_INSERT intent which asks the installed Contacts app
 * to open its editable new-contact screen with the known fields prefilled.
 * Every profile value is URI encoded so it cannot break the Intent URI.
 */
export function createAndroidContactIntent(profile: Profile, fallbackUrl: string) {
  const fallback = new URL(fallbackUrl);
  if (!["http:", "https:"].includes(fallback.protocol)) {
    throw new Error("A névjegy mentési tartalékcíme csak webes hivatkozás lehet.");
  }

  const notes = [
    profile.website ? `Weboldal: ${profile.website}` : "",
    profile.bio
  ].filter(Boolean).join("\n");

  const extras: Array<[string, string, number]> = [
    ["name", profile.display_name, 200],
    ["phone", profile.phone, 80],
    ["email", profile.public_email, 254],
    ["company", profile.company, 200],
    ["job_title", profile.job_title, 200],
    ["postal", profile.address, 500],
    ["notes", notes, 800]
  ];

  const encodedExtras = extras
    .filter(([, value]) => value.trim())
    .map(([key, value, maxLength]) => `S.${key}=${intentExtra(value, maxLength)}`);

  return [
    "intent:#Intent",
    "action=android.intent.action.INSERT",
    "type=vnd.android.cursor.dir/contact",
    ...encodedExtras,
    "S.phone_type=mobile",
    "S.email_type=work",
    "S.postal_type=work",
    `S.browser_fallback_url=${encodeURIComponent(fallback.toString())}`,
    "end"
  ].join(";");
}

export function createContactSummary(profile: Profile) {
  return [
    profile.display_name,
    profile.job_title,
    profile.company,
    profile.phone,
    profile.public_email,
    profile.website,
    profile.address
  ].filter(Boolean).join("\n");
}
