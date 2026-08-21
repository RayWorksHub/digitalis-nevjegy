import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Új jelszó" };
export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const cookieStore = await cookies();
  const recoveryUserId = cookieStore.get("e-nevjegy-recovery")?.value;
  if (!data.user || recoveryUserId !== data.user.id) redirect("/auth/reset-password?error=invalid-link");

  return (
    <AuthShell title="Állíts be új jelszót" lead="Az új jelszót kétszer kell megadnod. Sikeres módosítás után minden eszközről kijelentkeztetünk.">
      <AuthForm mode="update" />
    </AuthShell>
  );
}
