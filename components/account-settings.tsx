"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { isDemoMode } from "@/lib/utils";

export function AccountSettings() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exportData = async () => {
    if (isDemoMode()) {
      setError("Az adatexport az éles fiókban aktiválódik.");
      return;
    }
    const response = await fetch("/api/account");
    if (!response.ok) return setError("Az adatok most nem tölthetők le.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "e-nevjegy-adataim.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (confirm !== "TÖRLÉS") return;
    if (isDemoMode()) return setError("A bemutató fiók nem törölhető.");
    setLoading(true);
    setError("");
    const response = await fetch("/api/account", { method: "DELETE" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "A fiók nem törölhető.");
      setLoading(false);
      return;
    }
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="account-settings-grid">
      <section className="settings-panel">
        <div className="settings-panel-heading"><span className="panel-icon"><ShieldCheck size={20} /></span><div><h2>Adataid kezelése</h2><p>Az Európai Unión belüli adatvédelmi elvek szerint.</p></div></div>
        <p className="settings-text">Töltsd le a profilodhoz és a statisztikáidhoz tartozó adatokat géppel olvasható JSON-formátumban.</p>
        <button className="button button-secondary" type="button" onClick={exportData}><Download size={17} /> Saját adatok letöltése</button>
      </section>
      <section className="settings-panel danger-panel">
        <div className="settings-panel-heading"><span className="panel-icon danger"><Trash2 size={20} /></span><div><h2>Fiók végleges törlése</h2><p>Ez a művelet nem vonható vissza.</p></div></div>
        <p className="settings-text">A profil, hivatkozások, látogatási események és feltöltött képek törlődnek.</p>
        <label className="field"><span>Megerősítésként írd be: TÖRLÉS</span><span className="input-wrap"><input value={confirm} onChange={(event) => setConfirm(event.target.value)} /></span></label>
        {error && <p className="form-message error">{error}</p>}
        <button className="button button-danger" type="button" disabled={confirm !== "TÖRLÉS" || loading} onClick={deleteAccount}>{loading ? <Loader2 className="spin" size={17} /> : <Trash2 size={17} />} Fiók végleges törlése</button>
      </section>
    </div>
  );
}
