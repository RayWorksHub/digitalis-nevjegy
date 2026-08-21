import { Check } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-inner">
          <Logo />
          <div className="auth-quote">
            <span className="eyebrow" style={{ color: "#55d6be" }}>Professzionális első benyomás</span>
            <h2>Az adataid változhatnak. A névjegyed nem avul el.</h2>
            <ul>
              <li><Check size={18} /> QR-kód és fizikai NFC-kártya</li>
              <li><Check size={18} /> Egy kattintásos kapcsolatmentés</li>
              <li><Check size={18} /> Mobilon és asztali gépen is működik</li>
            </ul>
          </div>
          <p className="auth-copyright">E-névjegy</p>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-mobile-logo"><Logo /></div>
          <div className="auth-copy">
            <h1>{title}</h1>
            <p>{lead}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
