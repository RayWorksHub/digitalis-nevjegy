import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="legal-page container">
        <span className="eyebrow">Jogi információk</span>
        <h1>{title}</h1>
        <p className="legal-updated">Hatályos: {updated}</p>
        <div className="legal-content">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
