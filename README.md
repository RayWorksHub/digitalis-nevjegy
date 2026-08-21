# E-névjegy

Élesítésre kész, Vercelre tervezett digitális névjegykártya webalkalmazás.

## Fő szolgáltatások

- azonnali, megerősítő e-mail nélküli regisztráció és biztonságos belépés;
- e-mailes jelszó-helyreállítás egyszer használható, lejáró hivatkozással;
- saját, egyedi URL-en elérhető nyilvános profil;
- QR-kód letöltés és böngészőből indítható Web NFC-írás, minden esetben a nyilvános profiloldalra mutató webcímmel;
- Androidon közvetlen Névjegyek-létrehozó képernyő, fájlletöltés nélküli natív megosztási tartalékkal;
- vCard kapcsolatmentés, telefon-, e-mail- és webes gyorsműveletek;
- profilkép- és logószerkesztő teljes-kép/kitöltés móddal, igazítással, nagyítással és háttérszínnel;
- nem négyzetes korábbi képek automatikus, vágásmentes megjelenítése, közösségi hivatkozások és négy megjelenési téma;
- profilmegtekintés, mentés és kattintás analitika;
- telepíthető PWA mobilos felülettel;
- adatexport, profilrejtés és fióktörlés;
- Row Level Security szabályok és GDPR-alapú hozzájárulás-napló.

## Technológia

- Next.js 16 App Router;
- Vercel;
- Supabase Auth, Postgres és Storage;
- TypeScript;
- saját reszponzív felület külső UI-keretrendszer nélkül.

## Helyi indítás

1. Másold le a `.env.example` fájlt `.env.local` néven.
2. Töltsd ki a Supabase-adatokat.
3. Futtasd a `supabase/migrations/202608200001_initial_e_nevjegy.sql` migrációt a Supabase SQL Editorban.
4. Telepítsd a csomagokat: `npm install`.
5. Indítsd el: `npm run dev`.

Ha a Supabase-változók hiányoznak, az alkalmazás bemutató módban indul el. Az élő minta a `/rajmund`, a vezérlőpult a `/dashboard` címen látható.

## Éles környezeti változók

| Név | Hely | Megjegyzés |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Vercel | A végleges https URL, perjel nélkül |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase / Vercel | Nyilvános projekt URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase / Vercel | Nyilvános anon kulcs |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel, csak szerver | Kizárólag a teljes fióktörléshez |
| `NEXT_PUBLIC_DEMO_MODE` | Vercel | Élesben `false` |

## Supabase Auth beállítás

- Site URL: az éles Vercel-domain.
- Redirect URL-ek: `http://localhost:3000/auth/callback` és `https://SAJAT-DOMAIN/auth/callback`.
- Az ingyenes regisztráció szerveroldali admin hívással, automatikus aktiválással működik, ezért nem használja a Supabase alapértelmezett e-mail-kvótáját.
- A jelszó-helyreállító levelek megbízható production kézbesítéséhez ellenőrzött E-névjegy domain és saját SMTP szükséges. A Supabase alapértelmezett SMTP-je csak korlátozott tesztelésre való.
- Nyilvános, nagyobb forgalmú szolgáltatásnál CAPTCHA használata javasolt a visszaélések megelőzéséhez.
- A helyreállítás mindig azonos választ ad létező és nem létező e-mail-címre, így nem árulja el, hogy ki regisztrált a szolgáltatásba.
- A service role kulcsot tilos kliensoldali vagy Git-adatként tárolni.

## Vercel telepítés

Az alkalmazás gyökérkönyvtára ez a mappa. A build parancs `npm run build`, a framework preset Next.js. Frankfurt régió van beállítva.
