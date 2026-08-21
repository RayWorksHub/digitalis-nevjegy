import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Belépés" };

type Props = { searchParams: Promise<{ status?: string; error?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (data.user) redirect("/dashboard");

  const { status, error } = await searchParams;
  const initialMessage = status === "password-updated" ? "A jelszavad megváltozott. Most már beléphetsz az új jelszóval." : "";
  const initialError = error === "callback" ? "A belépési hivatkozás érvénytelen vagy lejárt. Próbáld újra." : "";

  return (
    <AuthShell title="Üdv újra!" lead="Lépj be, és kezeld a digitális névjegyedet.">
      <AuthForm mode="sign-in" initialMessage={initialMessage} initialError={initialError} />
    </AuthShell>
  );
}
