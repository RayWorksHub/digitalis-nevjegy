import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Impresszum" };

export default function ImprintPage() {
  return (
    <LegalLayout title="Impresszum" updated="2026. augusztus 20.">
      <section><h2>Szolgáltató</h2><dl className="imprint-list"><div><dt>Név</dt><dd>Csukárdi Rajmund Olivér egyéni vállalkozó</dd></div><div><dt>Márkanév</dt><dd>RayWorks | IT Solutions</dd></div><div><dt>E-mail</dt><dd><a href="mailto:info@rayworks.hu">info@rayworks.hu</a></dd></div><div><dt>Telefon</dt><dd><a href="tel:+36702980003">+36 70 298 0003</a></dd></div><div><dt>Web</dt><dd><a href="https://www.rayworks.hu">www.rayworks.hu</a></dd></div><div><dt>Székhely</dt><dd>Az élesítéshez megadandó</dd></div><div><dt>Adószám</dt><dd>Az élesítéshez megadandó</dd></div><div><dt>Nyilvántartási szám</dt><dd>Az élesítéshez megadandó</dd></div></dl></section>
      <section><h2>Tárhely és infrastruktúra</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Amerikai Egyesült Államok; Supabase, Inc., 970 Toa Payoh North #07-04, Singapore 318992. Az adatkezelésre vonatkozó részleteket az adatkezelési tájékoztató tartalmazza.</p></section>
      <section><h2>Kapcsolat</h2><p>Technikai vagy tartalmi kérdés esetén írj az <a href="mailto:info@rayworks.hu">info@rayworks.hu</a> címre.</p></section>
    </LegalLayout>
  );
}
