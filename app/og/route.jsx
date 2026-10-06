import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Pakistan House Construction Cost Estimation & Prediction").slice(0, 80);
  const sub = (searchParams.get("sub") || "AI-powered grey structure, semi-finished and fully finished estimates").slice(0, 90);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F7F8F7", color: "#14231E", padding: 64 }}>
        <div style={{ display: "flex", height: 8, width: "100%", background: "#0B4A38" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#0B4A38", marginTop: 22 }}>{sub}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5F6E67" }}>Pakistan House Cost AI · AI-Powered Estimation</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
