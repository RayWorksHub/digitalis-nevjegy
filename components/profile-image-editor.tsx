"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type CSSProperties, type SyntheticEvent } from "react";
import { Check, Crop, Loader2, RotateCcw, X } from "lucide-react";

export type ProfileImageEditSettings = {
  fit: "contain" | "cover";
  positionX: number;
  positionY: number;
  zoom: number;
  background: string;
};

type Dimensions = { width: number; height: number };

type ProfileImageEditorProps = {
  file: File;
  uploading: boolean;
  onCancel: () => void;
  onApply: (settings: ProfileImageEditSettings) => void;
};

const DEFAULT_LOGO_SETTINGS: ProfileImageEditSettings = {
  fit: "contain",
  positionX: 50,
  positionY: 50,
  zoom: 88,
  background: "#ffffff"
};

const DEFAULT_PHOTO_SETTINGS: ProfileImageEditSettings = {
  fit: "cover",
  positionX: 50,
  positionY: 50,
  zoom: 100,
  background: "#ffffff"
};

function calculatePlacement(dimensions: Dimensions, settings: ProfileImageEditSettings, frameSize: number) {
  const widthScale = frameSize / dimensions.width;
  const heightScale = frameSize / dimensions.height;
  const baseScale = settings.fit === "cover" ? Math.max(widthScale, heightScale) : Math.min(widthScale, heightScale);
  const scale = baseScale * (settings.zoom / 100);
  const width = dimensions.width * scale;
  const height = dimensions.height * scale;

  return {
    width,
    height,
    left: (frameSize - width) * (settings.positionX / 100),
    top: (frameSize - height) * (settings.positionY / 100)
  };
}

export async function createSquareProfileImage(file: File, settings: ProfileImageEditSettings) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = document.createElement("img");
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("A kiválasztott kép nem olvasható."));
      image.src = sourceUrl;
    });

    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("A képszerkesztő nem indítható el ebben a böngészőben.");

    context.fillStyle = settings.background;
    context.fillRect(0, 0, size, size);

    const placement = calculatePlacement(
      { width: source.naturalWidth, height: source.naturalHeight },
      settings,
      size
    );
    context.drawImage(source, placement.left, placement.top, placement.width, placement.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error("A szerkesztett kép nem készíthető el.")),
        "image/webp",
        0.92
      );
    });

    const outputType = blob.type === "image/webp" ? "image/webp" : "image/png";
    const extension = outputType === "image/webp" ? "webp" : "png";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "profilkep";
    return new File([blob], `${baseName}-nevjegy.${extension}`, { type: outputType });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export function ProfileImageEditor({ file, uploading, onCancel, onApply }: ProfileImageEditorProps) {
  const [sourceUrl] = useState(() => URL.createObjectURL(file));
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 1, height: 1 });
  const [settings, setSettings] = useState<ProfileImageEditSettings>(DEFAULT_LOGO_SETTINGS);
  const [autoConfigured, setAutoConfigured] = useState(false);

  useEffect(() => {
    return () => URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !uploading) onCancel();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onCancel, uploading]);

  const placement = useMemo(
    () => calculatePlacement(dimensions, settings, 100),
    [dimensions, settings]
  );

  const imageStyle = {
    width: `${placement.width}%`,
    height: `${placement.height}%`,
    left: `${placement.left}%`,
    top: `${placement.top}%`
  } as CSSProperties;

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const nextDimensions = { width: image.naturalWidth, height: image.naturalHeight };
    setDimensions(nextDimensions);
    if (!autoConfigured) {
      const ratio = nextDimensions.width / nextDimensions.height;
      setSettings(ratio >= 0.88 && ratio <= 1.12 ? DEFAULT_PHOTO_SETTINGS : DEFAULT_LOGO_SETTINGS);
      setAutoConfigured(true);
    }
  };

  const setPreset = (fit: ProfileImageEditSettings["fit"]) => {
    setSettings(fit === "contain" ? DEFAULT_LOGO_SETTINGS : DEFAULT_PHOTO_SETTINGS);
  };

  const updateNumber = (key: "positionX" | "positionY" | "zoom", value: number) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="image-editor-backdrop" role="presentation" onMouseDown={() => !uploading && onCancel()}>
      <section
        className="image-editor-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-editor-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close image-editor-close" type="button" onClick={onCancel} disabled={uploading} aria-label="Képszerkesztő bezárása">
          <X size={20} />
        </button>

        <div className="image-editor-heading">
          <span className="panel-icon"><Crop size={20} /></span>
          <div>
            <h2 id="image-editor-title">Profilkép vagy logó igazítása</h2>
            <p>A mentett kép négyzetes lesz, ezért minden telefonon azonos módon jelenik meg.</p>
          </div>
        </div>

        <div className="image-editor-layout">
          <div>
            <div className="image-editor-preview" style={{ background: settings.background }}>
              {sourceUrl ? (
                <Image
                  src={sourceUrl}
                  alt="A szerkesztett kép előnézete"
                  width={dimensions.width}
                  height={dimensions.height}
                  unoptimized
                  onLoad={handleImageLoad}
                  style={imageStyle}
                />
              ) : null}
            </div>
            <p className="image-editor-preview-note">A körön belüli rész jelenik meg a nyilvános névjegyen.</p>
          </div>

          <div className="image-editor-controls">
            <fieldset className="image-preset-picker">
              <legend>Megjelenítési mód</legend>
              <button type="button" className={settings.fit === "contain" ? "selected" : ""} onClick={() => setPreset("contain")}>
                <span>Teljes logó</span><small>A teljes kép látszik, vágás nélkül.</small>
              </button>
              <button type="button" className={settings.fit === "cover" ? "selected" : ""} onClick={() => setPreset("cover")}>
                <span>Keret kitöltése</span><small>Portréhoz, a szélek levághatók.</small>
              </button>
            </fieldset>

            <label className="image-range-field">
              <span>Vízszintes igazítás <strong>{settings.positionX}%</strong></span>
              <input type="range" min="0" max="100" value={settings.positionX} onChange={(event) => updateNumber("positionX", Number(event.target.value))} />
            </label>
            <label className="image-range-field">
              <span>Függőleges igazítás <strong>{settings.positionY}%</strong></span>
              <input type="range" min="0" max="100" value={settings.positionY} onChange={(event) => updateNumber("positionY", Number(event.target.value))} />
            </label>
            <label className="image-range-field">
              <span>Nagyítás <strong>{settings.zoom}%</strong></span>
              <input type="range" min="70" max="200" value={settings.zoom} onChange={(event) => updateNumber("zoom", Number(event.target.value))} />
            </label>
            <label className="image-background-field">
              <span>Háttérszín</span>
              <span><input type="color" value={settings.background} onChange={(event) => setSettings((current) => ({ ...current, background: event.target.value }))} /><code>{settings.background.toUpperCase()}</code></span>
            </label>

            <button className="button button-secondary button-small image-reset-button" type="button" onClick={() => setPreset(settings.fit)}>
              <RotateCcw size={16} /> Beállítások visszaállítása
            </button>
          </div>
        </div>

        <div className="image-editor-actions">
          <button className="button button-secondary" type="button" onClick={onCancel} disabled={uploading}>Mégse</button>
          <button className="button button-primary" type="button" onClick={() => onApply(settings)} disabled={uploading}>
            {uploading ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
            {uploading ? "Kép feldolgozása és feltöltése…" : "Kép használata"}
          </button>
        </div>
      </section>
    </div>
  );
}
