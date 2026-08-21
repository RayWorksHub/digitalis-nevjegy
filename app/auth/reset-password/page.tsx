import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Jelszó helyreállítása" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const initialError = error === "invalid-link" ? "A helyreállító hivatkozás érvénytelen vagy lejárt. Kérj új hivatkozást." : "";

  return (
    <AuthShell title="Elfelejtetted a jelszavad?" lead="Add meg az e-mail-címedet. Ha tartozik hozzá fiók, biztonságos helyreállító hivatkozást küldünk.">
      <AuthForm mode="reset" initialError={initialError} />
    </AuthShell>
  );
}
