import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Felhasználási feltételek" };

export default function TermsPage() {
  return (
    <LegalLayout title="Felhasználási feltételek" updated="2026. augusztus 20.">
      <section><h2>1. A szolgáltatás</h2><p>Az E-névjegy lehetőséget ad digitális névjegy létrehozására, szerkesztésére és hivatkozás, QR-kód vagy NFC-címke útján történő megosztására. A fogadó félnek nem szükséges fiókot vagy külön alkalmazást létrehoznia.</p></section>
      <section><h2>2. Fiók és felelősség</h2><p>A felhasználó köteles valós, jogszerűen közzétehető adatokat megadni, a belépési adatait bizalmasan kezelni, és az esetleges jogosulatlan hozzáférést haladéktalanul jelezni. Más személy adatainak engedély nélküli közzététele tilos.</p></section>
      <section><h2>3. Tiltott tartalom és használat</h2><p>Tilos jogsértő, megtévesztő, gyűlöletkeltő, fenyegető, kártékony vagy mások jogait sértő tartalmat elhelyezni; kéretlen üzenetküldéshez, adathalászathoz vagy informatikai rendszer elleni tevékenységhez használni a szolgáltatást; illetve a működést automatizált vagy túlzott kérésekkel akadályozni.</p></section>
      <section><h2>4. Ingyenes csomag</h2><p>Az induló csomag díjmentesen tartalmaz egy nyilvános profilt, QR-kódot, NFC-kompatibilis hivatkozást, vCard-letöltést, közösségi hivatkozásokat és alap statisztikát. A szolgáltató a csomag tartalmának jövőbeli változásáról ésszerű időben tájékoztatást ad.</p></section>
      <section><h2>5. Rendelkezésre állás</h2><p>A szolgáltató törekszik a folyamatos működésre, de karbantartás, biztonsági esemény vagy külső infrastruktúra hibája miatt átmeneti kiesés előfordulhat. A profil adatait a felhasználó bármikor exportálhatja.</p></section>
      <section><h2>6. Szellemi tulajdon</h2><p>Az E-névjegy név, arculat és alkalmazáskód a szolgáltató tulajdona. A felhasználó megtartja a saját feltöltött tartalmához fűződő jogait, és a szolgáltatás működtetéséhez szükséges, visszavonható felhasználási engedélyt ad.</p></section>
      <section><h2>7. Felfüggesztés és megszüntetés</h2><p>Jogellenes vagy a feltételeket súlyosan sértő használat esetén a szolgáltató a profilt elrejtheti vagy a fiókot felfüggesztheti. A felhasználó a fiókját a vezérlőpulton bármikor véglegesen törölheti.</p></section>
      <section><h2>8. Kapcsolat</h2><p>A szolgáltatással kapcsolatos kérdés vagy bejelentés az <a href="mailto:info@rayworks.hu">info@rayworks.hu</a> címen küldhető.</p></section>
    </LegalLayout>
  );
}
