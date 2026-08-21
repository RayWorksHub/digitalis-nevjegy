import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Logo />
          <p className="muted" style={{ margin: "12px 0 0", fontSize: 13 }}>
            © {new Date().getFullYear()} RayWorks. Minden jog fenntartva.
          </p>
        </div>
        <nav className="footer-links" aria-label="Jogi navigáció">
          <Link href="/adatvedelem">Adatkezelési tájékoztató</Link>
          <Link href="/felhasznalasi-feltetelek">Felhasználási feltételek</Link>
          <Link href="/impresszum">Impresszum</Link>
          <a href="mailto:info@rayworks.hu">Kapcsolat</a>
        </nav>
      </div>
    </footer>
  );
}
