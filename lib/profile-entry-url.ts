export type ProfileEntrySource = "qr" | "nfc";

/**
 * Builds an explicit web-page URL for QR and NFC entry points.
 *
 * The defensive path cleanup prevents an accidentally supplied vCard URL from
 * ever becoming the encoded payload. On the client, currentOrigin keeps links
 * on the domain that the visitor is actually using (including custom domains).
 */
export function createProfileEntryUrl(
  profileUrl: string,
  source: ProfileEntrySource,
  currentOrigin?: string
) {
  const target = new URL(profileUrl);

  if (!["http:", "https:"].includes(target.protocol)) {
    throw new Error("A profil megosztási címe csak webes hivatkozás lehet.");
  }

  const segments = target.pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1)?.toLowerCase();
  if (segments.length > 1 && lastSegment === "vcard") {
    segments.pop();
  } else if (lastSegment?.endsWith(".vcf")) {
    segments[segments.length - 1] = segments[segments.length - 1].slice(0, -4);
  }

  target.pathname = `/${segments.join("/")}`;
  target.search = "";
  target.hash = "";

  if (currentOrigin) {
    const origin = new URL(currentOrigin);
    if (["http:", "https:"].includes(origin.protocol)) {
      target.protocol = origin.protocol;
      target.host = origin.host;
    }
  }

  target.searchParams.set("open", "profile");
  target.searchParams.set("source", source);
  return target.toString();
}
