import { ImageResponse } from "next/og";

export const alt = "E-névjegy – egy érintés, és megjegyeznek";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "70px 82px",
        background: "linear-gradient(135deg, #f7f7f2 0%, #dff5ef 100%)",
        color: "#10233a"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, marginRight: 16, background: "#087f73" }} />
          E-névjegy
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.05, marginTop: 54 }}>
          Egy érintés, és megjegyeznek.
        </div>
        <div style={{ fontSize: 25, color: "#4e6074", marginTop: 24 }}>
          Digitális névjegykártya QR-kóddal és NFC-megosztással.
        </div>
      </div>
      <div
        style={{
          width: 280,
          height: 440,
          borderRadius: 42,
          padding: 18,
          display: "flex",
          background: "#10233a",
          boxShadow: "0 30px 70px rgba(16,35,58,.25)",
          transform: "rotate(5deg)"
        }}
      >
        <div style={{ width: "100%", borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: "linear-gradient(160deg,#10233a,#087f73)", color: "white" }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "#55d6be", color: "#10233a", fontSize: 32, fontWeight: 800 }}>EN</div>
          <div style={{ marginTop: 24, fontSize: 25, fontWeight: 800 }}>A te neved</div>
          <div style={{ marginTop: 10, fontSize: 16, color: "rgba(255,255,255,.7)" }}>A te vállalkozásod</div>
        </div>
      </div>
    </div>,
    size
  );
}
