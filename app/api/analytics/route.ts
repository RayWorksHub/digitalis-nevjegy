import { analyticsEventSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const parsed = analyticsEventSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Érvénytelen esemény." }, { status: 400 });
    if (isDemoMode()) return new Response(null, { status: 204 });

    const supabase = await createClient();
    if (!supabase) return Response.json({ error: "A szolgáltatás nem érhető el." }, { status: 503 });

    const { error } = await supabase.from("profile_events").insert({
      profile_id: parsed.data.profileId,
      event_type: parsed.data.eventType,
      link_key: parsed.data.linkKey,
      referrer: request.headers.get("referer")?.slice(0, 500) || null,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) || null
    });
    if (error) return Response.json({ error: "Az esemény nem menthető." }, { status: 500 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Hibás kérés." }, { status: 400 });
  }
}
