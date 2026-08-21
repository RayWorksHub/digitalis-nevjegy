import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Adatkezelési tájékoztató" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Adatkezelési tájékoztató" updated="2026. augusztus 20.">
      <section><h2>1. Az adatkezelő</h2><p>Az alkalmazás adatkezelője: <strong>Csukárdi Rajmund Olivér egyéni vállalkozó (RayWorks)</strong>. Kapcsolat: <a href="mailto:info@rayworks.hu">info@rayworks.hu</a>, telefon: <a href="tel:+36702980003">+36 70 298 0003</a>.</p><p>A hivatalos székhely, adószám és egyéni vállalkozói nyilvántartási szám a végleges szolgáltatói adatok megadásakor kerül feltüntetésre.</p></section>
      <section><h2>2. A kezelt adatok köre</h2><p>A regisztrációhoz e-mail-címet, jelszóhoz tartozó biztonságos hitelesítési adatot, valamint a felhasználó által megadott nevet kezeljük. A digitális névjegyben kizárólag a felhasználó által közzétett adatok jelennek meg: név, beosztás, szervezet, bemutatkozás, telefonszám, nyilvános e-mail, weboldal, hely, profilkép és közösségi hivatkozások.</p></section>
      <section><h2>3. Az adatkezelés célja és jogalapja</h2><p>A fiók és a szolgáltatás működtetésének jogalapja a felhasználási szerződés teljesítése. A regisztrációkor rögzített tájékoztató-elfogadás és a nyilvánosság kapcsolói a felhasználó döntésének igazolását szolgálják. Jogszabályi kötelezettség esetén az adatkezelés jogalapja az adott kötelezettség teljesítése.</p></section>
      <section><h2>4. Statisztikai események</h2><p>A nyilvános profil megnyitását, a kapcsolatmentést és az elérhetőségi gombokra történő kattintást összesített statisztika készítéséhez rögzítjük. A rendszer az esemény típusát, időpontját, a profil azonosítóját, a hivatkozó oldalt és a böngésző technikai azonosítóját kezelheti. Ezeket nem használjuk látogatói profilalkotásra.</p></section>
      <section><h2>5. Adatfeldolgozók és adattárolás</h2><p>A webalkalmazás kiszolgálását a Vercel, a hitelesítést, adatbázist és képtárolást a Supabase infrastruktúrája végzi. Az éles projekt európai régióban kerül beállításra. A szolgáltatók saját adatvédelmi és biztonsági feltételeik szerint adatfeldolgozóként működnek.</p></section>
      <section><h2>6. Megőrzési idő</h2><p>A fiók- és profiladatokat a fiók fennállásáig kezeljük. A felhasználó a profilját bármikor elrejtheti, adatait letöltheti vagy fiókját törölheti. Törléskor a profil, hivatkozások, statisztikai események és feltöltött fájlok törlődnek, kivéve ha jogszabály hosszabb megőrzést ír elő.</p></section>
      <section><h2>7. Az érintett jogai</h2><p>A felhasználó tájékoztatást, hozzáférést, helyesbítést, törlést, korlátozást és adathordozhatóságot kérhet, valamint tiltakozhat a jogos érdeken alapuló adatkezelés ellen. Kérelem a fenti e-mail-címen nyújtható be. Panasz a Nemzeti Adatvédelmi és Információszabadság Hatósághoz is benyújtható.</p></section>
      <section><h2>8. Sütik</h2><p>A rendszer kizárólag a biztonságos bejelentkezéshez és a munkamenet fenntartásához szükséges technikai sütiket használ. Marketingcélú vagy harmadik féltől származó reklámsüti nincs beépítve.</p></section>
      <section><h2>9. Biztonság</h2><p>Az adatátvitel titkosított HTTPS-kapcsolaton történik. A hozzáférést szerveroldali azonosítás és adatbázis-szintű jogosultsági szabályok korlátozzák. A jelszavakat az alkalmazás nem tárolja olvasható formában.</p></section>
    </LegalLayout>
  );
}
