import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ingyenes regisztráció" };

export default async function SignUpPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (data.user) redirect("/dashboard");

  return <AuthShell title="Készíts saját névjegyet" lead="Néhány adat, és máris megosztható leszel."><AuthForm mode="sign-up" /></AuthShell>;
}
