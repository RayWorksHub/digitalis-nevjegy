"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound
} from "lucide-react";
import { isDemoMode } from "@/lib/utils";
import {
  registrationSchema,
  resetPasswordSchema,
  signInSchema,
  toFieldErrors,
  updatePasswordSchema
} from "@/lib/validation";

type Mode = "sign-in" | "sign-up" | "reset" | "update";
type FieldName = "name" | "email" | "password" | "confirmPassword" | "consent";
type FieldErrors = Partial<Record<FieldName, string>>;
type Props = {
  mode: Mode;
  initialMessage?: string;
  initialError?: string;
};
type ApiPayload = {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: FieldErrors;
};

const fieldOrder: FieldName[] = ["name", "email", "password", "confirmPassword", "consent"];

function authErrorMessage(caught: unknown) {
  if (caught instanceof TypeError) return "Nem sikerült kapcsolódni a szolgáltatáshoz. Ellenőrizd az internetkapcsolatot, majd próbáld újra.";
  const error = caught && typeof caught === "object" ? caught as { code?: string; message?: string } : null;
  const code = error?.code || "";

  if (code === "invalid_credentials") return "Hibás e-mail-cím vagy jelszó.";
  if (code === "email_not_confirmed") return "A fiók aktiválása nem fejeződött be.";
  if (["over_email_send_rate_limit", "over_request_rate_limit"].includes(code)) return "Túl sok kérés érkezett. Próbáld újra később.";
  return error?.message || "Váratlan hiba történt. Próbáld újra.";
}

function FieldError({ field, errors }: { field: FieldName; errors: FieldErrors }) {
  const error = errors[field];
  return error ? <span className="field-error" id={`auth-${field}-error`}>{error}</span> : null;
}

export function AuthForm({ mode, initialMessage = "", initialError = "" }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState(initialError);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isSignUp = mode === "sign-up";
  const isSignIn = mode === "sign-in";
  const isReset = mode === "reset";
  const isUpdate = mode === "update";
  const needsEmail = !isUpdate;
  const needsPassword = !isReset;

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setError("");
  };

  const focusFirstInvalid = (errors: FieldErrors) => {
    const first = fieldOrder.find((field) => errors[field]);
    if (first) requestAnimationFrame(() => document.getElementById(`auth-${first}`)?.focus());
  };

  const validate = () => {
    let errors: FieldErrors = {};

    if (isSignUp) {
      const result = registrationSchema.safeParse({ name, email, password, consent, website });
      if (!result.success) errors = toFieldErrors(result.error) as FieldErrors;
    } else if (isSignIn) {
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) errors = toFieldErrors(result.error) as FieldErrors;
    } else if (isReset) {
      const result = resetPasswordSchema.safeParse({ email });
      if (!result.success) errors = toFieldErrors(result.error) as FieldErrors;
    } else {
      const result = updatePasswordSchema.safeParse({ password, confirmPassword });
      if (!result.success) errors = toFieldErrors(result.error) as FieldErrors;
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setError("Ellenőrizd a pirossal jelölt mezőket.");
      focusFirstInvalid(errors);
      return false;
    }
    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setFieldErrors({});

    if (!validate()) return;
    if (isDemoMode()) {
      setError("Az éles fiókkezelés az adatbázis összekötése után aktiválódik.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp
        ? "/api/auth/register"
        : isSignIn
          ? "/api/auth/sign-in"
          : isReset
            ? "/api/auth/reset-password"
            : "/api/auth/update-password";
      const body = isSignUp
        ? { name, email, password, consent, website }
        : isSignIn
          ? { email, password }
          : isReset
            ? { email }
            : { password, confirmPassword };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const payload = await response.json().catch(() => ({})) as ApiPayload;

      if (!response.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
          focusFirstInvalid(payload.fieldErrors);
        }
        throw new Error(payload.error || "A művelet most nem hajtható végre.");
      }

      if (isSignUp) {
        router.replace("/dashboard/profile");
        router.refresh();
      } else if (isSignIn) {
        router.replace("/dashboard");
        router.refresh();
      } else if (isReset) {
        setMessage(payload.message || "Ha az e-mail-címhez tartozik fiók, elküldtük a helyreállító hivatkozást.");
      } else {
        setCompleted(true);
        setMessage("A jelszavad sikeresen megváltozott. Biztonsági okból minden eszközről kijelentkeztettünk.");
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = isSignIn
    ? "Belépés"
    : isSignUp
      ? "Fiók létrehozása"
      : isReset
        ? message
          ? "Hivatkozás újrakérése"
          : "Helyreállító levél küldése"
        : "Új jelszó mentése";
  const loadingLabel = isSignIn
    ? "Belépés folyamatban…"
    : isSignUp
      ? "Fiók létrehozása…"
      : isReset
        ? "Küldés folyamatban…"
        : "Jelszó mentése…";

  return (
    <form className="auth-form" onSubmit={submit} noValidate aria-busy={loading}>
      {error ? <div className="form-message error" role="alert" aria-live="assertive">{error}</div> : null}
      {message ? <div className="form-message success" role="status" aria-live="polite"><CheckCircle2 size={18} /> <span>{message}</span></div> : null}

      {isSignUp ? (
        <>
          <div className="field">
            <label className="field-label" htmlFor="auth-name">Név</label>
            <span className={`input-wrap${fieldErrors.name ? " invalid" : ""}`}>
              <UserRound size={18} />
              <input
                id="auth-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => { setName(event.target.value); clearFieldError("name"); }}
                placeholder="Teljes neved"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "auth-name-error" : undefined}
              />
            </span>
            <FieldError field="name" errors={fieldErrors} />
          </div>
          <label className="auth-honeypot" aria-hidden="true">
            <span>Weboldal</span>
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </label>
        </>
      ) : null}

      {needsEmail ? (
        <div className="field">
          <label className="field-label" htmlFor="auth-email">E-mail-cím</label>
          <span className={`input-wrap${fieldErrors.email ? " invalid" : ""}`}>
            <Mail size={18} />
            <input
              id="auth-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(event) => { setEmail(event.target.value); clearFieldError("email"); }}
              placeholder="nev@vallalkozas.hu"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "auth-email-error" : undefined}
            />
          </span>
          <FieldError field="email" errors={fieldErrors} />
        </div>
      ) : null}

      {needsPassword ? (
        <div className="field">
          <label className="field-label" htmlFor="auth-password">{isUpdate ? "Új jelszó" : "Jelszó"}</label>
          <span className={`input-wrap${fieldErrors.password ? " invalid" : ""}`}>
            <LockKeyhole size={18} />
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp || isUpdate ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); clearFieldError("password"); }}
              placeholder={isSignIn ? "A jelszavad" : "Legalább 8 karakter"}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={[fieldErrors.password ? "auth-password-error" : "", !isSignIn ? "auth-password-hint" : ""].filter(Boolean).join(" ") || undefined}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
          {!isSignIn ? <span className="field-hint" id="auth-password-hint">Legalább 8, legfeljebb 72 karakter.</span> : null}
          <FieldError field="password" errors={fieldErrors} />
        </div>
      ) : null}

      {isUpdate ? (
        <div className="field">
          <label className="field-label" htmlFor="auth-confirmPassword">Új jelszó ismét</label>
          <span className={`input-wrap${fieldErrors.confirmPassword ? " invalid" : ""}`}>
            <LockKeyhole size={18} />
            <input
              id="auth-confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => { setConfirmPassword(event.target.value); clearFieldError("confirmPassword"); }}
              placeholder="Írd be újra"
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={fieldErrors.confirmPassword ? "auth-confirmPassword-error" : undefined}
            />
          </span>
          <FieldError field="confirmPassword" errors={fieldErrors} />
        </div>
      ) : null}

      {isSignUp ? (
        <div className={`consent-field${fieldErrors.consent ? " invalid" : ""}`}>
          <div className="consent-row">
            <input
              id="auth-consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => { setConsent(event.target.checked); clearFieldError("consent"); }}
              aria-invalid={Boolean(fieldErrors.consent)}
              aria-describedby={fieldErrors.consent ? "auth-consent-error" : undefined}
            />
            <div className="consent-copy">
              <label htmlFor="auth-consent">Elolvastam és elfogadom a kapcsolódó dokumentumokat:</label>
              <span><Link href="/adatvedelem" target="_blank" rel="noreferrer">Adatkezelési tájékoztató</Link> és <Link href="/felhasznalasi-feltetelek" target="_blank" rel="noreferrer">Felhasználási feltételek</Link>.</span>
            </div>
          </div>
          <FieldError field="consent" errors={fieldErrors} />
          <p className="auth-note">A fiók azonnal aktiválódik; megerősítő e-mailt jelenleg nem küldünk.</p>
        </div>
      ) : null}

      {isSignIn ? <div className="form-meta"><Link href="/auth/reset-password">Elfelejtetted a jelszavad?</Link></div> : null}

      {completed ? (
        <Link className="button button-primary button-full" href="/auth/sign-in">Tovább a belépéshez <ArrowRight size={18} /></Link>
      ) : (
        <button className="button button-primary button-full" type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : null}
          {loading ? loadingLabel : submitLabel}
          {!loading ? <ArrowRight size={18} /> : null}
        </button>
      )}

      <p className="auth-switch">
        {isSignIn
          ? <>Még nincs fiókod? <Link href="/auth/sign-up">Regisztrálj ingyen</Link></>
          : isSignUp
            ? <>Már van fiókod? <Link href="/auth/sign-in">Lépj be</Link></>
            : <Link href="/auth/sign-in">Vissza a belépéshez</Link>}
      </p>
    </form>
  );
}
