"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Copy, Download, Loader2, Nfc, QrCode, Smartphone } from "lucide-react";
import { isDemoMode } from "@/lib/utils";

type NDEFWriterLike = { write: (message: string) => Promise<void> };
type WindowWithNfc = Window & { NDEFWriter?: new () => NDEFWriterLike };

export function ShareTools({ profileUrl, displayName }: { profileUrl: string; displayName: string }) {
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [nfcStatus, setNfcStatus] = useState("");
  const [nfcLoading, setNfcLoading] = useState(false);

  useEffect(() => {
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(profileUrl, { width: 900, margin: 2, errorCorrectionLevel: "H", color: { dark: "#10233a", light: "#ffffff" } })
      )
      .then(setQrUrl)
      .catch(() => undefined);
  }, [profileUrl]);

  const copy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    const anchor = document.createElement("a");
    anchor.href = qrUrl;
    anchor.download = `${displayName.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    anchor.click();
  };

  const writeNfc = async () => {
    setNfcLoading(true);
    setNfcStatus("");
    try {
      const NDEFWriter = (window as WindowWithNfc).NDEFWriter;
      if (!NDEFWriter) throw new Error("Ezen az eszközön a böngészőből történő NFC-írás nem támogatott. Androidon Chrome böngészőt használj.");
      const writer = new NDEFWriter();
      await writer.write(profileUrl);
      setNfcStatus("Sikeres írás. Érintsd a kártyát egy másik telefonhoz a teszteléshez.");
    } catch (caught) {
      setNfcStatus(caught instanceof Error ? caught.message : "Az NFC-kártya nem írható.");
    } finally {
      setNfcLoading(false);
    }
  };

  return (
    <div className="share-tools-grid">
      <section className="settings-panel share-tool-panel">
        <div className="settings-panel-heading"><span className="panel-icon"><QrCode size={20} /></span><div><h2>Saját QR-kód</h2><p>Nyomtatáshoz vagy digitális megosztáshoz.</p></div></div>
        <div className="settings-qr">{qrUrl ? <Image src={qrUrl} width={220} height={220} alt="A profil QR-kódja" unoptimized /> : <Loader2 className="spin" size={28} />}</div>
        <div className="share-url"><span>{profileUrl}</span><button type="button" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div>
        <button className="button button-primary button-full" type="button" onClick={downloadQr} disabled={!qrUrl}><Download size={18} /> QR-kód letöltése</button>
      </section>

      <section className="settings-panel share-tool-panel">
        <div className="settings-panel-heading"><span className="panel-icon"><Nfc size={20} /></span><div><h2>NFC-kártya beállítása</h2><p>A profilcímedet írd egy szabványos NTAG-kártyára.</p></div></div>
        <div className="nfc-illustration"><Smartphone size={44} /><span className="nfc-waves">)))</span><div>NFC</div></div>
        <ol className="nfc-steps"><li>Androidos telefonon nyisd meg ezt az oldalt Chrome-ban.</li><li>Kattints az írás gombra, majd érintsd a kártyát a telefon hátuljához.</li><li>Teszteld egy másik telefonon.</li></ol>
        {isDemoMode() && <p className="form-message error">Bemutató módban az NFC-írás csak szemléltetés.</p>}
        {nfcStatus && <p className={`form-message ${nfcStatus.startsWith("Sikeres") ? "success" : "error"}`}>{nfcStatus}</p>}
        <button className="button button-primary button-full" type="button" onClick={writeNfc} disabled={nfcLoading}>{nfcLoading ? <Loader2 className="spin" size={18} /> : <Nfc size={18} />} Írás NFC-kártyára</button>
      </section>
    </div>
  );
}
