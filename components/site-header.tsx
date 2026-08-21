import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="header-nav" aria-label="Fő navigáció">
          <Link href="/#funkciok">Funkciók</Link>
          <Link href="/#mukodes">Hogyan működik?</Link>
          <Link href="/#arak">Árak</Link>
          <Link href="/#gyik">GYIK</Link>
        </nav>
        <div className="header-actions">
          {data.user ? (
            <Link className="button button-primary button-small" href="/dashboard">
              <LayoutDashboard size={16} /> Vezérlőpult
            </Link>
          ) : (
            <>
              <Link className="button button-secondary button-small" href="/auth/sign-in">
                Belépés
              </Link>
              <Link className="button button-primary button-small" href="/auth/sign-up">
                Saját névjegyet kérek
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
