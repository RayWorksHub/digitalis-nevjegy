import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ContactRound,
  Globe2,
  Mail,
  Nfc,
  Phone,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRoundPlus,
  Zap
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const features = [
  {
    icon: QrCode,
    title: "Saját QR-kód",
    text: "A kód azonnal a mindig aktuális névjegyedre visz. Kinyomtatható, elküldhető és bárhol elhelyezhető."
  },
  {
    icon: Nfc,
    title: "NFC-kompatibilis",
    text: "Írd a profilcímedet bármely szabványos NFC-kártyára vagy matricára, és oszd meg egyetlen érintéssel."
  },
  {
    icon: ContactRound,
    title: "Mentés a telefonba",
    text: "A látogató egy gombbal, vCard formátumban mentheti a telefonszámodat, e-mail-címedet és céges adataidat."
  },
  {
    icon: Smartphone,
    title: "Mobilra tervezve",
    text: "Gyors, telepíthető webalkalmazás, amely iPhone-on és Androidon is alkalmazásszerű élményt ad."
  },
  {
    icon: BarChart3,
    title: "Átlátható statisztika",
    text: "Lásd, hányan nézték meg a névjegyedet, mentették el a kapcsolatot vagy kattintottak a hivatkozásaidra."
  },
  {
    icon: ShieldCheck,
    title: "Te irányítod az adatokat",
    text: "Bármikor frissítheted, elrejtheted vagy törölheted a profilodat. A nyilvános adatokat te választod ki."
  }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">A névjegy, ami veled változik</span>
              <h1>
                Egy érintés, és <span>megjegyeznek.</span>
              </h1>
              <p className="hero-lead">
                Hozd létre saját digitális névjegyedet, oszd meg QR-kóddal vagy NFC-vel,
                és hagyd, hogy az új kapcsolataid egy mozdulattal elmentsenek.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/auth/sign-up">
                  Ingyenes névjegy készítése <ArrowRight size={18} />
                </Link>
                <Link className="button button-secondary" href="/rajmund">
                  Élő minta megnyitása
                </Link>
              </div>
              <div className="hero-notes">
                <span className="hero-note"><Check size={15} /> Bankkártya nélkül</span>
                <span className="hero-note"><Check size={15} /> 3 perc alatt kész</span>
                <span className="hero-note"><Check size={15} /> Bármikor módosítható</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Digitális névjegykártya bemutató">
              <div className="float-card float-card-left">
                <span className="float-icon"><QrCode size={20} /></span>
                <div><strong>Azonnal megosztható</strong><span>QR és NFC</span></div>
              </div>
              <div className="phone-shell">
                <div className="phone-screen">
                  <div className="phone-notch" />
                  <div className="phone-card-content">
                    <div className="mock-avatar">CSR</div>
                    <h3>Csukárdi Rajmund</h3>
                    <p className="phone-role">Fejlesztő · tanácsadó</p>
                    <p className="phone-role">RayWorks | IT Solutions</p>
                    <div className="mock-actions">
                      <div className="mock-action"><Phone size={18} />Hívás</div>
                      <div className="mock-action"><Mail size={18} />E-mail</div>
                      <div className="mock-action"><Globe2 size={18} />Web</div>
                    </div>
                    <div className="mock-save">Kapcsolat mentése</div>
                  </div>
                </div>
              </div>
              <div className="float-card float-card-right">
                <span className="float-icon"><Zap size={20} /></span>
                <div><strong>Mindig naprakész</strong><span>Újranyomtatás nélkül</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Előnyök röviden">
          <div className="container trust-inner">
            <span className="trust-label">Környezetbarát, egyszerű és professzionális</span>
            <div className="trust-items">
              <span className="trust-item"><Sparkles size={17} /> Modern megjelenés</span>
              <span className="trust-item"><ShieldCheck size={17} /> Biztonságos profil</span>
              <span className="trust-item"><Smartphone size={17} /> Minden telefonon működik</span>
            </div>
          </div>
        </section>

        <section className="section section-white" id="funkciok">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Minden, ami a kapcsolódáshoz kell</span>
              <h2>Nem csak névjegy. Egy okos kapcsolati felület.</h2>
              <p>
                Egyetlen linken minden elérhetőséged, mindig naprakészen – külön alkalmazás
                telepítése nélkül a másik fél telefonján.
              </p>
            </div>
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, text }) => (
                <article className="feature-card" key={title}>
                  <span className="feature-icon"><Icon size={23} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="mukodes">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow" style={{ color: "#55d6be" }}>Három egyszerű lépés</span>
              <h2>Ma elkészíted, ma használod.</h2>
              <p>Nincs technikai beállítás, nincs nyomdai várakozás, nincs elavult névjegy.</p>
            </div>
            <div className="steps-grid">
              <article className="step">
                <h3>Regisztrálj</h3>
                <p>Hozd létre a fiókodat biztonságos e-mailes belépéssel.</p>
              </article>
              <article className="step">
                <h3>Töltsd ki a profilod</h3>
                <p>Add meg a kapcsolati adataidat, válassz stílust és állítsd be a hivatkozásaidat.</p>
              </article>
              <article className="step">
                <h3>Oszd meg</h3>
                <p>Mutasd fel a QR-kódot, írd NFC-kártyára a linket, vagy küldd el közvetlenül.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="arak">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">Egyszerű indulás</span>
              <h2>Az alap névjegy ingyenes.</h2>
              <p>A cél most az, hogy bárki gyorsan használható digitális névjegyet készíthessen.</p>
            </div>
            <div className="pricing-card">
              <div className="pricing-main">
                <span className="eyebrow">Ingyenes csomag</span>
                <div className="price">0 Ft <small>/ hó</small></div>
                <p className="muted">Nincs próbaidőszak és nincs bankkártya.</p>
                <Link className="button button-primary button-full" href="/auth/sign-up">
                  Saját profil létrehozása <ArrowRight size={18} />
                </Link>
              </div>
              <div className="pricing-side">
                <strong>Minden alapfunkció benne van:</strong>
                <ul className="check-list">
                  <li><Check size={18} /> Nyilvános, egyedi profilcím</li>
                  <li><Check size={18} /> QR-kód és NFC-link</li>
                  <li><Check size={18} /> vCard kapcsolatmentés</li>
                  <li><Check size={18} /> Közösségi hivatkozások</li>
                  <li><Check size={18} /> Alap látogatottsági statisztika</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-white" id="gyik">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">Gyakori kérdések</span>
              <h2>Mielőtt belevágsz.</h2>
            </div>
            <div className="faq-list">
              <details className="faq-item">
                <summary>Kell alkalmazást telepíteni a névjegy megnyitásához?</summary>
                <p>Nem. A profil bármely korszerű mobilböngészőben megnyílik, a másik félnek semmit sem kell telepítenie.</p>
              </details>
              <details className="faq-item">
                <summary>Hogyan működik az NFC-kártya?</summary>
                <p>A saját profilcímedet ráírhatod egy szabványos, írható NFC-kártyára. Érintéskor a telefon ezt a webcímet nyitja meg.</p>
              </details>
              <details className="faq-item">
                <summary>Mi történik, ha megváltozik a telefonszámom?</summary>
                <p>Egyszerűen frissíted a vezérlőpulton. A QR-kód és az NFC-kártya változatlanul működik, mert mindig az aktuális profilodra mutat.</p>
              </details>
              <details className="faq-item">
                <summary>Elrejthetem vagy törölhetem a profilomat?</summary>
                <p>Igen. Egy kattintással priváttá teheted, és a fiókbeállításoknál véglegesen törölheted az adataidat.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-card">
              <h2>A következő kapcsolatod már vár.</h2>
              <p>Készítsd el a digitális névjegyedet néhány perc alatt, és oszd meg még ma.</p>
              <Link className="button button-primary" href="/auth/sign-up">
                Ingyenesen elkészítem <UserRoundPlus size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
