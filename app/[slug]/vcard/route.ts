import { getPublicProfile } from "@/lib/supabase/profile";
import { createVCard, normalizeSlug } from "@/lib/utils";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) return new Response("A profil nem található.", { status: 404 });

  return new Response(createVCard(profile), {
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      "content-disposition": `attachment; filename="${normalizeSlug(profile.display_name) || "kapcsolat"}.vcf"`,
      "cache-control": "public, max-age=300"
    }
  });
}
