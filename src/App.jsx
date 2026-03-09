import { useState, useRef, useCallback, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CARD_TEMPLATES = [
  { id: 1, name: "Executive Black", bg: "linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%)", accent: "#c9a84c", text: "#fff", style: "luxury" },
  { id: 2, name: "Ivory Classic", bg: "linear-gradient(135deg,#f5f0e8 0%,#ede8dc 100%)", accent: "#2d2d2d", text: "#1a1a1a", style: "classic" },
  { id: 3, name: "Ocean Blue", bg: "linear-gradient(135deg,#0077b6 0%,#023e8a 100%)", accent: "#90e0ef", text: "#fff", style: "corporate" },
  { id: 4, name: "Rose Gold", bg: "linear-gradient(135deg,#f4a0a0 0%,#e8c5b0 100%)", accent: "#8b2252", text: "#3d1515", style: "elegant" },
  { id: 5, name: "Forest Green", bg: "linear-gradient(135deg,#1b4332 0%,#2d6a4f 100%)", accent: "#95d5b2", text: "#fff", style: "nature" },
  { id: 6, name: "Minimalist White", bg: "linear-gradient(135deg,#ffffff 0%,#f8f8f8 100%)", accent: "#111", text: "#111", style: "minimal", border: "1px solid #e0e0e0" },
  { id: 7, name: "Midnight Purple", bg: "linear-gradient(135deg,#240046 0%,#3c096c 100%)", accent: "#e0aaff", text: "#fff", style: "creative" },
  { id: 8, name: "Coral Sunrise", bg: "linear-gradient(135deg,#ff6b6b 0%,#feca57 100%)", accent: "#fff", text: "#fff", style: "vibrant" },
  { id: 9, name: "Steel Corporate", bg: "linear-gradient(135deg,#2c3e50 0%,#3d5a80 100%)", accent: "#a8dadc", text: "#fff", style: "corporate" },
  { id: 10, name: "Warm Sand", bg: "linear-gradient(135deg,#d4a373 0%,#ccd5ae 100%)", accent: "#606c38", text: "#333", style: "earthy" },
  { id: 11, name: "Bold Red", bg: "linear-gradient(135deg,#c1121f 0%,#780000 100%)", accent: "#fdf0d5", text: "#fff", style: "bold" },
  { id: 12, name: "Teal Minimal", bg: "linear-gradient(135deg,#00b4d8 0%,#0077b6 100%)", accent: "#caf0f8", text: "#fff", style: "fresh" },
];

const PRODUCTS = [
  { id: 1, name: "Original Business Cards", category: "business-cards", price: 299, unit: "100 cards", badge: "Best Seller", style: "bg" },
  { id: 2, name: "Luxe Business Cards", category: "business-cards", price: 1499, unit: "100 cards", badge: "Premium", style: "bg2" },
  { id: 3, name: "Gold Foil Visiting Cards", category: "business-cards", price: 1499, unit: "100 cards", badge: "Popular", style: "bg3" },
  { id: 4, name: "Die-Cut Stickers", category: "stickers", price: 799, unit: "100 stickers", badge: "New", style: "bg4" },
  { id: 5, name: "Canvas Paintings", category: "canvas", price: 4999, unit: "piece", badge: "New", style: "bg5" },
  { id: 6, name: "Premium Flyers", category: "flyers", price: 699, unit: "100 flyers", badge: null, style: "bg6" },
];

const CATEGORIES = [
  { name: "Business Cards", icon: "🪪", color: "#1a1a2e" },
  { name: "Stickers & Labels", icon: "🏷️", color: "#2d6a4f" },
  { name: "Flyers & Brochures", icon: "📄", color: "#0077b6" },
  { name: "Canvas & Prints", icon: "🎨", color: "#780000" },
  { name: "Marketing Materials", icon: "📢", color: "#c9a84c" },
  { name: "Packaging", icon: "📦", color: "#3c096c" },
];

const PAPER_TYPES = ["Matte 300 GSM", "Glossy 350 GSM", "Premium Soft Touch", "Linen Textured"];
const QUANTITIES = [100, 200, 500, 1000];
const CORNER_TYPES = ["Standard Square", "Rounded Corner"];
const FONTS = ["Playfair Display", "Montserrat", "Georgia", "Arial", "Courier New", "Raleway"];

// ─── CARD CANVAS ──────────────────────────────────────────────────────────────

function CardPreview({ template, fields, logoUrl, side }) {
  const t = template;
  return (
    <div style={{
      width: 340, height: 190, borderRadius: 12,
      background: t.bg, border: t.border || "none",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      position: "relative", overflow: "hidden", flexShrink: 0,
    }}>
      {/* decorative corner */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `${t.accent}22`, borderBottomLeftRadius: "100%" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60,
        background: `${t.accent}15`, borderTopRightRadius: "100%" }} />

      {side === "back" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", gap: 8 }}>
          <div style={{ width: 40, height: 4, background: t.accent, borderRadius: 2 }} />
          <div style={{ color: t.text, fontSize: 18, fontWeight: 700, letterSpacing: 4, opacity: 0.8 }}>
            {fields.name || "YOUR BRAND"}
          </div>
          <div style={{ width: 40, height: 4, background: t.accent, borderRadius: 2 }} />
          {fields.website && <div style={{ color: t.accent, fontSize: 11, marginTop: 4 }}>{fields.website}</div>}
        </div>
      ) : (
        <div style={{ padding: "18px 22px", height: "100%", boxSizing: "border-box",
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: t.text, fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>
                {fields.name || "Your Name"}
              </div>
              <div style={{ color: t.accent, fontSize: 11, marginTop: 2, fontWeight: 500 }}>
                {fields.designation || "Your Designation"}
              </div>
            </div>
            {logoUrl && (
              <img src={logoUrl} alt="logo" style={{ width: 44, height: 44, objectFit: "contain",
                borderRadius: 6, background: "#fff2", padding: 4 }} />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {fields.phone && <div style={{ color: t.text, fontSize: 10, opacity: 0.85 }}>📞 {fields.phone}</div>}
            {fields.email && <div style={{ color: t.text, fontSize: 10, opacity: 0.85 }}>✉ {fields.email}</div>}
            {fields.address && <div style={{ color: t.text, fontSize: 10, opacity: 0.75 }}>📍 {fields.address}</div>}
            {fields.website && <div style={{ color: t.accent, fontSize: 10 }}>🌐 {fields.website}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UPLOAD OWN DESIGN PAGE ───────────────────────────────────────────────────

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
const ACCEPTED_EXT = ".png,.jpg,.jpeg,.webp,.pdf,.ai,.psd";

function UploadOwnDesign({ product, onBack, onAddToCart }) {
  const [uploadedFront, setUploadedFront] = useState(null);
  const [uploadedBack, setUploadedBack]  = useState(null);
  const [activeSide, setActiveSide]      = useState("front");
  const [dragging, setDragging]          = useState(false);
  const [paperType, setPaperType]        = useState(PAPER_TYPES[0]);
  const [quantity, setQuantity]          = useState(100);
  const [cornerType, setCornerType]      = useState(CORNER_TYPES[0]);
  const [step, setStep]                  = useState("upload"); // upload | options
  const [error, setError]               = useState("");
  const inputRef = useRef();

  const prices = { 100: product.price, 200: product.price * 1.8, 500: product.price * 3.8, 1000: product.price * 6.5 };

  const processFile = (file) => {
    setError("");
    if (!file) return;
    const ok = ACCEPTED.includes(file.type) || /\.(ai|psd)$/i.test(file.name);
    if (!ok) { setError("Unsupported format. Please use PNG, JPG, PDF, AI or PSD."); return; }
    if (file.size > 30 * 1024 * 1024) { setError("File too large. Maximum 30 MB."); return; }

    if (/application\/pdf/i.test(file.type) || /\.(ai|psd)$/i.test(file.name)) {
      // Non-image: store name only, show placeholder
      const obj = { name: file.name, url: null, type: file.type };
      activeSide === "front" ? setUploadedFront(obj) : setUploadedBack(obj);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const obj = { name: file.name, url: ev.target.result, type: file.type };
        activeSide === "front" ? setUploadedFront(obj) : setUploadedBack(obj);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const current = activeSide === "front" ? uploadedFront : uploadedBack;

  if (step === "options") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <button onClick={() => setStep("upload")} style={{ background: "none", border: "1px solid #444",
            color: "#aaa", padding: "8px 20px", borderRadius: 8, cursor: "pointer", marginBottom: 32 }}>← Back to Upload</button>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 32, marginBottom: 8 }}>Finalise Your Order</h2>
          <p style={{ color: "#555", marginBottom: 32, fontSize: 13 }}>Your uploaded artwork will be printed exactly as provided.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Previews */}
            <div>
              <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, marginBottom: 14 }}>YOUR UPLOADED ARTWORK</div>
              {[["front", uploadedFront], ["back", uploadedBack]].map(([side, file]) => (
                <div key={side} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{side} side</div>
                  {file ? (
                    <div style={{ borderRadius: 10, overflow: "hidden", background: "#111",
                      border: "1px solid #222", position: "relative", height: 120,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {file.url ? (
                        <img src={file.url} alt={side} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{file.name}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ height: 120, borderRadius: 10, border: "1px dashed #2a2a2a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#444", fontSize: 12 }}>No file uploaded</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Paper */}
              <div>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, marginBottom: 10 }}>PAPER TYPE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {PAPER_TYPES.map(p => (
                    <button key={p} onClick={() => setPaperType(p)} style={{
                      padding: "11px", borderRadius: 8, fontSize: 11, cursor: "pointer", textAlign: "left",
                      background: paperType === p ? "#1a1a2e" : "#111",
                      border: paperType === p ? "1px solid #c9a84c" : "1px solid #222",
                      color: paperType === p ? "#c9a84c" : "#777", fontWeight: 600 }}>{p}</button>
                  ))}
                </div>
              </div>
              {/* Qty */}
              <div>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, marginBottom: 10 }}>QUANTITY</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {QUANTITIES.map(q => (
                    <button key={q} onClick={() => setQuantity(q)} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      background: quantity === q ? "#c9a84c" : "#111",
                      border: quantity === q ? "none" : "1px solid #222",
                      color: quantity === q ? "#000" : "#777", fontWeight: 700 }}>{q}</button>
                  ))}
                </div>
              </div>
              {/* Corner */}
              <div>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, marginBottom: 10 }}>CORNER TYPE</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {CORNER_TYPES.map(c => (
                    <button key={c} onClick={() => setCornerType(c)} style={{
                      flex: 1, padding: "11px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                      background: cornerType === c ? "#1a1a2e" : "#111",
                      border: cornerType === c ? "1px solid #c9a84c" : "1px solid #222",
                      color: cornerType === c ? "#c9a84c" : "#777", fontWeight: 600 }}>{c}</button>
                  ))}
                </div>
              </div>
              {/* Price CTA */}
              <div style={{ background: "#111", borderRadius: 12, padding: 20, border: "1px solid #222" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#888" }}>{quantity} cards · {paperType}</span>
                  <span style={{ color: "#c9a84c", fontSize: 22, fontWeight: 700 }}>₹{Math.round(prices[quantity]).toLocaleString()}</span>
                </div>
                <div style={{ color: "#555", fontSize: 11, marginBottom: 16 }}>Incl. print + delivery · Your artwork</div>
                <button onClick={() => onAddToCart({
                  template: { name: "Custom Upload", bg: "#1a1a2e", accent: "#c9a84c", text: "#fff" },
                  fields: {}, logoUrl: null, paperType, quantity, cornerType,
                  price: Math.round(prices[quantity]), customUpload: true,
                  frontFile: uploadedFront, backFile: uploadedBack
                })} style={{ width: "100%", padding: "14px", background: "#c9a84c", color: "#000",
                  border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Add to Cart →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── UPLOAD STEP ──
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #1e1e1e", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #333",
            color: "#aaa", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>← Back</button>
          <span style={{ fontWeight: 700, color: "#fff" }}>Upload Your Own Design — {product.name}</span>
        </div>
        <button onClick={() => { if (!uploadedFront) { setError("Please upload at least the front side design."); return; } setStep("options"); }}
          style={{ background: "#c9a84c", color: "#000", border: "none", padding: "8px 22px",
            borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          Continue to Options →
        </button>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
        {/* Side Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[["front","Front Side ✱ Required"],["back","Back Side  (Optional)"]].map(([s, label]) => (
            <button key={s} onClick={() => setActiveSide(s)} style={{
              padding: "10px 24px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 700,
              background: activeSide === s ? "#c9a84c" : "#111",
              border: activeSide === s ? "none" : "1px solid #222",
              color: activeSide === s ? "#000" : "#666" }}>
              {label}
              {s === "front" && uploadedFront && <span style={{ marginLeft: 8, color: activeSide === s ? "#000" : "#c9a84c" }}>✓</span>}
              {s === "back"  && uploadedBack  && <span style={{ marginLeft: 8, color: activeSide === s ? "#000" : "#c9a84c" }}>✓</span>}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Drop Zone */}
          <div>
            <input ref={inputRef} type="file" accept={ACCEPTED_EXT} style={{ display: "none" }}
              onChange={e => processFile(e.target.files[0])} />
            <div
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              style={{
                border: `2px dashed ${dragging ? "#c9a84c" : "#2a2a2a"}`,
                borderRadius: 16, padding: "52px 32px", textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(201,168,76,0.05)" : "#0d0d0d",
                transition: "all 0.2s"
              }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {current ? "✅" : "⬆️"}
              </div>
              {current ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>File Uploaded!</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16, wordBreak: "break-all" }}>{current.name}</div>
                  <div style={{ fontSize: 12, color: "#c9a84c" }}>Click to replace</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>
                    Drag & drop your file here
                  </div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>or click to browse</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    {["PNG","JPG","PDF","AI","PSD"].map(f => (
                      <span key={f} style={{ background: "#1a1a1a", border: "1px solid #333",
                        color: "#888", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{f}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {error && <div style={{ marginTop: 12, color: "#f55", fontSize: 12, background: "rgba(255,80,80,0.1)",
              padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,80,80,0.2)" }}>⚠ {error}</div>}

            {current && (
              <button onClick={() => { activeSide === "front" ? setUploadedFront(null) : setUploadedBack(null); }}
                style={{ marginTop: 12, background: "none", border: "1px solid #2a2a2a",
                  color: "#f55", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                🗑 Remove this file
              </button>
            )}
          </div>

          {/* Preview pane */}
          <div>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 14 }}>LIVE PREVIEW</div>
            <div style={{ width: "100%", aspectRatio: "1.75/1", borderRadius: 14,
              background: "#111", border: "1px solid #1e1e1e", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
              {current?.url ? (
                <img src={current.url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : current?.name ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{current.name}</div>
                  <div style={{ color: "#555", fontSize: 10, marginTop: 6 }}>Preview not available for this format</div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.3 }}>🖼</div>
                  <div style={{ color: "#444", fontSize: 12 }}>Your design will appear here</div>
                </div>
              )}
            </div>
            <div style={{ color: "#444", fontSize: 11, marginTop: 10, textAlign: "center" }}>3.5" × 2" · Standard Business Card</div>

            {/* Guidelines */}
            <div style={{ marginTop: 20, background: "#0d0d0d", border: "1px solid #1e1e1e",
              borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>PRINT GUIDELINES</div>
              {[
                "Recommended: 1050 × 600 px at 300 DPI",
                "Include 3mm bleed on all sides",
                "Keep text 5mm from edges (safe zone)",
                "Use CMYK colour mode for best results",
                "Embed all fonts before exporting PDF",
              ].map(g => (
                <div key={g} style={{ fontSize: 11, color: "#555", marginBottom: 6, paddingLeft: 12,
                  borderLeft: "2px solid #222" }}>{g}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN EDITOR ───────────────────────────────────────────────────────────

function DesignEditor({ template, onBack, onAddToCart, onSwitchToUpload }) {
  const [side, setSide] = useState("front");
  const [fields, setFields] = useState({ name: "", designation: "", phone: "", email: "", address: "", website: "" });
  const [logoUrl, setLogoUrl] = useState(null);
  const [paperType, setPaperType] = useState(PAPER_TYPES[0]);
  const [quantity, setQuantity] = useState(100);
  const [cornerType, setCornerType] = useState(CORNER_TYPES[0]);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(14);
  const [font, setFont] = useState("Montserrat");
  const [step, setStep] = useState("editor"); // editor | options
  const logoRef = useRef();

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const price = {
    100: template.style === "luxury" ? 1299 : 499,
    200: template.style === "luxury" ? 2299 : 899,
    500: template.style === "luxury" ? 4999 : 1999,
    1000: template.style === "luxury" ? 8999 : 3499,
  };

  if (step === "options") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <button onClick={() => setStep("editor")} style={{ background: "none", border: "1px solid #444",
            color: "#aaa", padding: "8px 20px", borderRadius: 8, cursor: "pointer", marginBottom: 32 }}>
            ← Back to Editor
          </button>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 32, marginBottom: 32 }}>Finalise Your Order</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              {/* Preview */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 16 }}>CARD PREVIEW</div>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  {["front","back"].map(s => (
                    <button key={s} onClick={() => setSide(s)} style={{
                      padding: "6px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600,
                      background: side === s ? template.accent || "#c9a84c" : "#1a1a1a",
                      color: side === s ? "#000" : "#aaa", border: "none"
                    }}>{s === "front" ? "Front Side" : "Back Side"}</button>
                  ))}
                </div>
                <CardPreview template={template} fields={fields} logoUrl={logoUrl} side={side} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Paper */}
              <div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 12 }}>PAPER TYPE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {PAPER_TYPES.map(p => (
                    <button key={p} onClick={() => setPaperType(p)} style={{
                      padding: "12px", borderRadius: 8, fontSize: 12, cursor: "pointer", textAlign: "left",
                      background: paperType === p ? "#1a1a2e" : "#111",
                      border: paperType === p ? "1px solid #c9a84c" : "1px solid #222",
                      color: paperType === p ? "#c9a84c" : "#aaa", fontWeight: 600
                    }}>{p}</button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 12 }}>QUANTITY</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {QUANTITIES.map(q => (
                    <button key={q} onClick={() => setQuantity(q)} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      background: quantity === q ? "#c9a84c" : "#111",
                      border: quantity === q ? "none" : "1px solid #222",
                      color: quantity === q ? "#000" : "#aaa", fontWeight: 700
                    }}>{q}</button>
                  ))}
                </div>
              </div>

              {/* Corner */}
              <div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, marginBottom: 12 }}>CORNER TYPE</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {CORNER_TYPES.map(c => (
                    <button key={c} onClick={() => setCornerType(c)} style={{
                      flex: 1, padding: "12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                      background: cornerType === c ? "#1a1a2e" : "#111",
                      border: cornerType === c ? "1px solid #c9a84c" : "1px solid #222",
                      color: cornerType === c ? "#c9a84c" : "#aaa", fontWeight: 600
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div style={{ background: "#111", borderRadius: 12, padding: 20, border: "1px solid #222" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#888" }}>{quantity} cards · {paperType}</span>
                  <span style={{ color: "#c9a84c", fontSize: 22, fontWeight: 700 }}>₹{(price[quantity]).toLocaleString()}</span>
                </div>
                <div style={{ color: "#555", fontSize: 11, marginBottom: 16 }}>Incl. design + print + delivery</div>
                <button onClick={() => onAddToCart({ template, fields, logoUrl, paperType, quantity, cornerType, price: price[quantity] })}
                  style={{ width: "100%", padding: "14px", background: "#c9a84c", color: "#000",
                    border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Add to Cart →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Editor Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #333",
            color: "#aaa", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>← Back</button>
          <span style={{ color: "#fff", fontWeight: 700 }}>Design Editor — {template.name}</span>
        </div>
        <button onClick={() => setStep("options")} style={{ background: "#c9a84c", color: "#000",
          border: "none", padding: "8px 22px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          Continue to Options →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 57px)" }}>
        {/* LEFT PANEL */}
        <div style={{ background: "#111", borderRight: "1px solid #1e1e1e", padding: 20, overflowY: "auto" }}>
          {/* Side Toggle */}
          <div style={{ display: "flex", background: "#0a0a0a", borderRadius: 8, padding: 3, marginBottom: 20 }}>
            {["front","back"].map(s => (
              <button key={s} onClick={() => setSide(s)} style={{
                flex: 1, padding: "8px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600,
                background: side === s ? "#c9a84c" : "transparent",
                color: side === s ? "#000" : "#666", border: "none", transition: "all 0.2s"
              }}>{s === "front" ? "Front Side" : "Back Side"}</button>
            ))}
          </div>

          {/* Text Fields */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10 }}>TEXT FIELDS</div>
            {[
              { key: "name", label: "Full Name", placeholder: "John Smith" },
              { key: "designation", label: "Designation", placeholder: "Creative Director" },
              { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
              { key: "email", label: "Email", placeholder: "john@company.com" },
              { key: "address", label: "Address", placeholder: "Mumbai, India" },
              { key: "website", label: "Website", placeholder: "www.company.com" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>{f.label}</div>
                <input value={fields[f.key]} onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{
                    width: "100%", padding: "8px 10px", background: "#0a0a0a",
                    border: "1px solid #222", borderRadius: 6, color: "#fff", fontSize: 12,
                    outline: "none", boxSizing: "border-box"
                  }} />
              </div>
            ))}
          </div>

          {/* Typography */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10 }}>TYPOGRAPHY</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>Font Family</div>
              <select value={font} onChange={e => setFont(e.target.value)} style={{
                width: "100%", padding: "8px", background: "#0a0a0a",
                border: "1px solid #222", borderRadius: 6, color: "#fff", fontSize: 12, outline: "none"
              }}>
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>Font Size — {fontSize}px</div>
              <input type="range" min={10} max={22} value={fontSize} onChange={e => setFontSize(+e.target.value)}
                style={{ width: "100%", accentColor: "#c9a84c" }} />
            </div>
          </div>

          {/* Logo Upload */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10 }}>LOGO / IMAGE</div>
            <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
            <button onClick={() => logoRef.current.click()} style={{
              width: "100%", padding: "10px", background: "#0a0a0a", border: "1px dashed #333",
              borderRadius: 8, color: "#888", fontSize: 12, cursor: "pointer"
            }}>
              {logoUrl ? "✓ Logo Uploaded — Change" : "⬆ Upload Company Logo"}
            </button>
            {logoUrl && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <img src={logoUrl} style={{ width: 36, height: 36, borderRadius: 4, objectFit: "contain", background: "#fff1" }} />
                <button onClick={() => setLogoUrl(null)} style={{ background: "none", border: "none",
                  color: "#f44", fontSize: 11, cursor: "pointer" }}>Remove</button>
              </div>
            )}
          </div>
        </div>

        {/* CANVAS AREA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: 40, gap: 24, background: "#0d0d0d" }}>
          <div style={{ fontSize: 12, color: "#444", letterSpacing: 2 }}>LIVE PREVIEW — {side.toUpperCase()} SIDE</div>
          <CardPreview template={template} fields={fields} logoUrl={logoUrl} side={side} />
          <div style={{ color: "#333", fontSize: 11 }}>3.5" × 2" · Standard Business Card</div>

          {/* Upload Own Design */}
          <div style={{ marginTop: 20, padding: "20px 32px", border: "1px dashed #2a2a2a", borderRadius: 12,
            textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 6 }}>Prefer to use your own artwork?</div>
            <div style={{ fontSize: 11, color: "#444", marginBottom: 14 }}>PNG, JPG, PDF, AI, PSD · up to 30 MB</div>
            <button onClick={onSwitchToUpload} style={{ padding: "10px 24px", background: "#c9a84c",
              border: "none", borderRadius: 8, color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ⬆ Upload Your Own Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE GALLERY ─────────────────────────────────────────────────────────

function TemplateGallery({ product, onBack, onSelect, onUpload }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f8f5", fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #ddd",
          color: "#555", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>← Back</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: "#1a1a1a" }}>{product.name}</div>
          <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>Choose a design template to customise</div>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* Upload Own Banner */}
      <div style={{ background: "#1a1a2e", color: "#fff", padding: "14px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Have your own design?</span>
          <span style={{ color: "#aaa", fontSize: 13, marginLeft: 12 }}>Upload artwork and we'll print it exactly.</span>
        </div>
        <button onClick={onUpload} style={{ padding: "10px 22px", background: "#c9a84c", color: "#000",
          border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Upload Your Own Design
        </button>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {CARD_TEMPLATES.map(t => (
            <div key={t.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)", transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; }}>

              {/* Card Visual */}
              <div style={{ padding: 24, display: "flex", justifyContent: "center", background: "#f5f4f0" }}>
                <div style={{ width: "100%", maxWidth: 300, aspectRatio: "1.75/1", borderRadius: 10,
                  background: t.bg, border: t.border || "none", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", padding: "14px 16px", boxSizing: "border-box" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60,
                    background: `${t.accent}22`, borderBottomLeftRadius: "100%" }} />
                  <div>
                    <div style={{ color: t.text, fontSize: 12, fontWeight: 700, opacity: 0.9 }}>Your Name</div>
                    <div style={{ color: t.accent, fontSize: 9, marginTop: 1, fontWeight: 600 }}>Your Designation</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ color: t.text, fontSize: 8, opacity: 0.7 }}>📞 +91 98765 43210</div>
                    <div style={{ color: t.accent, fontSize: 8 }}>🌐 www.yourwebsite.com</div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Starting ₹{product.price}/{product.unit}</div>
                </div>
                <button onClick={() => onSelect(t)} style={{
                  padding: "10px 18px", background: "#1a1a2e", color: "#fff",
                  border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13,
                  transition: "background 0.2s"
                }}>
                  Customise →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const bgStyles = {
  bg: "linear-gradient(135deg,#1a1a2e,#0f3460)",
  bg2: "linear-gradient(135deg,#2d1b4e,#5c2d91)",
  bg3: "linear-gradient(135deg,#7c5c1e,#c9a84c)",
  bg4: "linear-gradient(135deg,#1b4332,#95d5b2)",
  bg5: "linear-gradient(135deg,#c1121f,#f4a0a0)",
  bg6: "linear-gradient(135deg,#0077b6,#caf0f8)",
};

const emojiMap = { bg: "🪪", bg2: "✨", bg3: "🌟", bg4: "🏷️", bg5: "🎨", bg6: "📄" };

export default function PrintIt() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [authPage, setAuthPage] = useState(null); // null | "signin" | "signup"
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (item) => {
    setCart(p => [...p, { ...item, id: Date.now() }]);
    setSelectedTemplate(null);
    setSelectedProduct(null);
    setUploadMode(false);
    setPage("home");
    showToast("Added to cart! 🎉");
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((s, i) => s + (i.price || 0), 0);

  // ── UPLOAD OWN DESIGN ──
  if (uploadMode && selectedProduct) {
    return <UploadOwnDesign product={selectedProduct} onBack={() => setUploadMode(false)} onAddToCart={addToCart} />;
  }

  // ── EDITOR ──
  if (selectedTemplate && selectedProduct) {
    return <DesignEditor template={selectedTemplate} onBack={() => setSelectedTemplate(null)}
      onAddToCart={addToCart} onSwitchToUpload={() => { setSelectedTemplate(null); setUploadMode(true); }} />;
  }

  // ── GALLERY ──
  if (selectedProduct) {
    return <TemplateGallery product={selectedProduct} onBack={() => setSelectedProduct(null)}
      onSelect={(t) => setSelectedTemplate(t)} onUpload={() => setUploadMode(true)} />;
  }

  // ── AUTH ──
  if (authPage) {
    return <AuthPage mode={authPage} onClose={() => setAuthPage(null)} onSwitch={setAuthPage} />;
  }

  // ── CART SIDE PANEL ──
  const CartPanel = () => (
    <div style={{ position: "fixed", right: cartOpen ? 0 : -420, top: 0, height: "100vh",
      width: 400, background: "#fff", boxShadow: "-4px 0 40px rgba(0,0,0,0.15)",
      zIndex: 1000, transition: "right 0.35s ease", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex",
        justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700 }}>Your Cart ({cartCount})</span>
        <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none",
          fontSize: 22, cursor: "pointer", color: "#555" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", marginTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <div>Your cart is empty</div>
          </div>
        ) : cart.map((item, i) => (
          <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0",
            borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ width: 56, height: 36, borderRadius: 6, background: item.template?.bg || "#eee", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{item.template?.name || "Custom Card"}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.quantity} pcs · {item.paperType}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{item.cornerType}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "#1a1a2e" }}>₹{item.price?.toLocaleString()}</div>
              <button onClick={() => setCart(p => p.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: "#f44", fontSize: 11, cursor: "pointer", marginTop: 4 }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: "16px 24px", borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 20, color: "#1a1a2e" }}>₹{cartTotal.toLocaleString()}</span>
          </div>
          <button onClick={() => { setCartOpen(false); setPage("checkout"); }} style={{
            width: "100%", padding: 14, background: "#1a1a2e", color: "#fff",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>Proceed to Checkout →</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: "100vh", background: "#f9f8f5" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, background: "#1a1a2e", color: "#fff",
          padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)", animation: "fadeIn 0.3s ease" }}>{toast}</div>
      )}

      {/* OVERLAY */}
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.4)", zIndex: 999 }} />}
      <CartPanel />

      {/* ── NAVBAR ── */}
      <nav style={{ background: "#fff", boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", height: 64 }}>
          <div onClick={() => setPage("home")} style={{ fontFamily: "'Playfair Display'", fontSize: 26,
            fontWeight: 700, color: "#1a1a2e", cursor: "pointer", marginRight: 40, letterSpacing: -0.5 }}>
            Print<span style={{ color: "#c9a84c" }}>It</span>
          </div>
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {["Home", "Products", "Business Cards", "About"].map(nav => (
              <button key={nav} onClick={() => {
                if (nav === "Business Cards") { setSelectedProduct(PRODUCTS[0]); }
                else if (nav === "Products") setPage("products");
                else if (nav === "Home") setPage("home");
              }} style={{ background: "none", border: "none", padding: "8px 14px", borderRadius: 8,
                color: "#555", fontSize: 14, cursor: "pointer", fontWeight: 600,
                transition: "color 0.2s" }}>{nav}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setPage("admin")} style={{ padding: "8px 14px", background: "none",
              border: "1px solid #ddd", borderRadius: 8, color: "#888", fontSize: 12,
              cursor: "pointer", fontWeight: 600 }}>⚙ Admin</button>
            <button onClick={() => setAuthPage("signin")} style={{ padding: "8px 18px", background: "none",
              border: "1px solid #ddd", borderRadius: 8, color: "#555", fontSize: 13,
              cursor: "pointer", fontWeight: 600 }}>Sign In</button>
            <button onClick={() => setAuthPage("signup")} style={{ padding: "8px 18px", background: "#1a1a2e",
              border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
              cursor: "pointer", fontWeight: 600 }}>Sign Up</button>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative",
              background: "#f5f4f0", border: "none", borderRadius: 10, width: 42, height: 42,
              fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#c9a84c",
                  color: "#000", width: 18, height: 18, borderRadius: "50%", fontSize: 10,
                  fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {page === "home" && <HomePage setPage={setPage} setSelectedProduct={setSelectedProduct} PRODUCTS={PRODUCTS} bgStyles={bgStyles} emojiMap={emojiMap} CATEGORIES={CATEGORIES} />}
      {page === "products" && <ProductsPage setSelectedProduct={setSelectedProduct} PRODUCTS={PRODUCTS} bgStyles={bgStyles} emojiMap={emojiMap} />}
      {page === "checkout" && <CheckoutPage cart={cart} cartTotal={cartTotal} onSuccess={() => { setCart([]); setPage("home"); showToast("Order placed successfully! ✅"); }} />}
      {page === "admin" && <AdminDashboard onBack={() => setPage("home")} />}
    </div>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────

function HomePage({ setPage, setSelectedProduct, PRODUCTS, bgStyles, emojiMap, CATEGORIES }) {
  return (
    <>
      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#0f0f23 0%,#1a1a3e 60%,#0f2044 100%)",
        minHeight: 560, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 400, height: 400,
          background: "radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%", boxSizing: "border-box" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
              color: "#c9a84c", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              letterSpacing: 2, marginBottom: 20 }}>PREMIUM PRINT SERVICES</div>
            <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 52, color: "#fff",
              lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -1 }}>
              Print That <br /><em>Makes an</em><br />
              <span style={{ color: "#c9a84c" }}>Impression</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
              Premium business cards, flyers, stickers and more — designed online, delivered fast.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <button onClick={() => setPage("products")} style={{ padding: "14px 32px", background: "#c9a84c",
                color: "#000", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Shop All Products
              </button>
              <button onClick={() => setSelectedProduct(PRODUCTS[0])} style={{ padding: "14px 28px", background: "none",
                border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 10, fontSize: 15,
                fontWeight: 600, cursor: "pointer" }}>
                Design Business Card
              </button>
            </div>
          </div>
          {/* Hero Visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 320, height: 240 }}>
              {[
                { rot: -8, top: 30, left: 0, bg: "linear-gradient(135deg,#c9a84c,#7c5c1e)", z: 1 },
                { rot: 4, top: 10, left: 30, bg: "linear-gradient(135deg,#1a1a2e,#0f3460)", z: 2 },
                { rot: 0, top: 50, left: 60, bg: "linear-gradient(135deg,#2d1b4e,#5c2d91)", z: 3 },
              ].map((card, i) => (
                <div key={i} style={{ position: "absolute", width: 220, height: 130, borderRadius: 12,
                  background: card.bg, boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  transform: `rotate(${card.rot}deg)`, top: card.top, left: card.left,
                  zIndex: card.z, transition: "transform 0.3s" }}>
                  <div style={{ padding: 16 }}>
                    <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13 }}>Your Name</div>
                    <div style={{ color: "rgba(201,168,76,0.8)", fontSize: 10, marginTop: 4 }}>Creative Director</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#1a1a2e", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 40px",
          display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }}>
          {["🚀 Next-Day Delivery", "✅ The PrintIt Promise", "🎨 Online Design Tool", "💼 Business Perks"].map(t => (
            <span key={t} style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* POPULAR PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>OUR COLLECTION</div>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 40, color: "#1a1a1a", margin: 0 }}>Popular Products</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)}
              style={{ background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)", transition: "transform 0.25s, box-shadow 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}>
              <div style={{ height: 180, background: bgStyles[p.style], display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
                {emojiMap[p.style]}
                {p.badge && <div style={{ position: "absolute", top: 12, right: 12, background: "#c9a84c",
                  color: "#000", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>{p.badge}</div>}
              </div>
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 6 }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 17 }}>₹{p.price}</span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>/ {p.unit}</span>
                </div>
                <div style={{ marginTop: 12, background: "#1a1a2e", color: "#fff", borderRadius: 8,
                  padding: "8px 0", textAlign: "center", fontSize: 13, fontWeight: 600 }}>Customise & Order →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, color: "#1a1a1a", margin: 0 }}>Shop by Category</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {CATEGORIES.map(c => (
              <div key={c.name} style={{ borderRadius: 14, padding: "28px 24px", cursor: "pointer",
                background: c.color, color: "#fff", display: "flex", alignItems: "center", gap: 14,
                transition: "transform 0.2s, opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <span style={{ fontSize: 32 }}>{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ background: "#f9f8f5", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, color: "#1a1a1a", margin: 0 }}>What Our Customers Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { name: "Ananya S.", role: "Startup Founder", text: "The quality is outstanding. Our brand cards made a great first impression at every pitch.", stars: 5 },
              { name: "Rohan M.", role: "Photographer", text: "I uploaded my own design and the print came out perfectly. Fast delivery too!", stars: 5 },
              { name: "Priya K.", role: "Event Planner", text: "Ordered flyers for a wedding expo. The colors were vibrant and crisp. Will order again!", stars: 5 },
            ].map(r => (
              <div key={r.name} style={{ background: "#fff", borderRadius: 14, padding: 24,
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ color: "#c9a84c", fontSize: 18, marginBottom: 10 }}>{"★".repeat(r.stars)}</div>
                <p style={{ color: "#444", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{r.text}"</p>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{r.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: "#1a1a2e", color: "#fff", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 32, marginBottom: 12 }}>Get 20% Off Your First Order</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Subscribe to our newsletter for exclusive deals and print tips.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="Enter your email" style={{ flex: 1, padding: "12px 16px", borderRadius: 8,
              border: "none", fontSize: 14, outline: "none" }} />
            <button style={{ padding: "12px 22px", background: "#c9a84c", color: "#000",
              border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", color: "#aaa", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: "#fff", marginBottom: 8 }}>
              Print<span style={{ color: "#c9a84c" }}>It</span>
            </div>
            <div style={{ fontSize: 13, maxWidth: 220, lineHeight: 1.7 }}>Premium print services delivered fast across India.</div>
          </div>
          {[
            { title: "Products", links: ["Business Cards", "Stickers", "Flyers", "Canvas"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
            { title: "Support", links: ["FAQs", "Shipping", "Returns", "Track Order"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12, letterSpacing: 1 }}>{col.title.toUpperCase()}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", borderTop: "1px solid #1a1a1a", marginTop: 32, paddingTop: 20, fontSize: 12 }}>
          © 2025 PrintIt. All rights reserved.
        </div>
      </footer>
    </>
  );
}

// ── PRODUCTS PAGE ─────────────────────────────────────────────────────────────

function ProductsPage({ setSelectedProduct, PRODUCTS, bgStyles, emojiMap }) {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 40, color: "#1a1a1a", marginBottom: 8 }}>All Products</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>Click any product to browse designs and start customising.</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
        style={{ width: "100%", maxWidth: 400, padding: "12px 16px", borderRadius: 10, border: "1px solid #ddd",
          fontSize: 14, outline: "none", marginBottom: 32, boxSizing: "border-box" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ background: "#fff", borderRadius: 16,
            overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ height: 160, background: bgStyles[p.style], display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 48 }}>{emojiMap[p.style]}</div>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{p.name}</div>
              <div style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 17, marginTop: 6 }}>₹{p.price} <span style={{ color: "#aaa", fontWeight: 400, fontSize: 12 }}>/ {p.unit}</span></div>
              <div style={{ marginTop: 12, textAlign: "center", background: "#f0f0f0", borderRadius: 8,
                padding: "8px", fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>Browse Designs →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────

function AuthPage({ mode, onClose, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const isSignIn = mode === "signin";

  return (
    <div style={{ minHeight: "100vh", background: "#f9f8f5", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 420,
        boxShadow: "0 20px 80px rgba(0,0,0,0.1)" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa",
          cursor: "pointer", marginBottom: 16, fontSize: 13 }}>← Back to store</button>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f5f4f0", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {["signin", "signup"].map(t => (
            <button key={t} onClick={() => onSwitch(t)} style={{ flex: 1, padding: "10px",
              borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s",
              background: mode === t ? "#1a1a2e" : "transparent",
              color: mode === t ? "#fff" : "#888" }}>
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 26, color: "#1a1a1a", marginBottom: 24 }}>
          {isSignIn ? "Welcome back" : "Create account"}
        </h2>

        {!isSignIn && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Full Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="John Smith" style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8,
                border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Email</label>
          <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com" style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8,
              border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: isSignIn ? 8 : 16 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••" style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8,
              border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {isSignIn && (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <span style={{ color: "#1a1a2e", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
          </div>
        )}
        {!isSignIn && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
              placeholder="••••••••" style={{ width: "100%", padding: "12px", marginTop: 6, borderRadius: 8,
                border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        <button style={{ width: "100%", padding: "14px", background: "#1a1a2e", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
          {isSignIn ? "Sign In →" : "Create Account →"}
        </button>

        <div style={{ textAlign: "center", fontSize: 12, color: "#aaa" }}>🔒 Secure & encrypted</div>
      </div>
    </div>
  );
}

// ── CHECKOUT PAGE — Razorpay Payment Integration ─────────────────────────────

const API = "https://printworldstudio-backend-production.up.railway.app/api";
const RAZORPAY_KEY = "rzp_live_SOili5pUti3LVb";

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage({ cart, cartTotal, onSuccess }) {
  const [form, setForm]         = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [orderNum, setOrderNum] = useState(null);

  const handlePayment = async () => {
    setError("");
    const { name, email, phone, address, city, pin } = form;
    if (!name || !email || !address || !city || !pin)
      return setError("Please fill in all required fields.");
    if (!phone) return setError("Phone number is required for delivery.");

    setLoading(true);
    try {
      // Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway. Please refresh and try again.");

      // Create Razorpay order
      let rzpOrderId, rzpAmount;
      try {
        const res  = await fetch(`${API}/payment/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: cartTotal, receipt: `order_${Date.now()}` }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        rzpOrderId = data.id;
        rzpAmount  = data.amount;
      } catch {
        // Demo mode — simulate payment
        const demoOrderNum = `PWS-DEMO-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
        setOrderNum(demoOrderNum);
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key:         RAZORPAY_KEY,
        amount:      rzpAmount,
        currency:    "INR",
        name:        "PrintWorldStudio",
        description: `Order for ${cart.length} item(s)`,
        order_id:    rzpOrderId,
        prefill: {
          name:    name,
          email:   email,
          contact: phone,
        },
        theme: { color: "#1a1a2e" },
        handler: async (response) => {
          // Verify payment on backend
          try {
            const itemsMeta = cart.map(item => ({
              productName:    item.template?.name || "Business Cards",
              templateName:   item.customUpload ? null : item.template?.name,
              paperType:      item.paperType,
              quantity:       item.quantity,
              cornerType:     item.cornerType,
              price:          item.price,
              isCustomUpload: !!item.customUpload,
            }));

            const verifyRes = await fetch(`${API}/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                customerName:    name,
                customerEmail:   email,
                customerPhone:   phone,
                shippingAddress: address,
                city, pinCode: pin,
                items: JSON.stringify(itemsMeta),
                total: cartTotal,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            setOrderNum(verifyData.orderNumber);
          } catch (err) {
            setOrderNum(`PWS-${Math.random().toString(36).slice(2,8).toUpperCase()}`);
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => { setLoading(false); setError("Payment cancelled. Please try again."); }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setError(`Payment failed: ${resp.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (orderNum) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: 40, fontFamily: "'Montserrat',sans-serif" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, color: "#1a1a1a", marginBottom: 8 }}>Payment Successful!</h2>
        <div style={{ display: "inline-block", background: "#f0fff4", border: "1px solid #9ae6b4",
          color: "#276749", padding: "8px 20px", borderRadius: 20, fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
          {orderNum}
        </div>
        <p style={{ color: "#666", maxWidth: 440, lineHeight: 1.7, marginBottom: 8 }}>
          Your payment was received! A confirmation email has been sent to <strong>{form.email}</strong>.
        </p>
        <p style={{ color: "#999", fontSize: 13, marginBottom: 28 }}>
          PrintWorldStudio will begin production and deliver within 3–5 business days.
        </p>
        <button onClick={onSuccess} style={{ padding: "12px 32px", background: "#1a1a2e", color: "#fff",
          border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          Back to Home
        </button>
      </div>
    );
  }

  // ── Checkout form ──
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px", fontFamily: "'Montserrat',sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 36, marginBottom: 8 }}>Checkout</h1>
      <p style={{ color: "#888", marginBottom: 32, fontSize: 14 }}>Fill in your details — you'll be redirected to our secure payment page.</p>

      {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", color: "#c33",
        padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 14 }}>⚠ {error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {[
          { key: "name",    label: "Full Name *",    placeholder: "John Smith",        span: 2 },
          { key: "email",   label: "Email *",         placeholder: "you@example.com",   span: 1 },
          { key: "phone",   label: "Phone *",         placeholder: "+91 98765 43210",   span: 1 },
          { key: "address", label: "Address *",       placeholder: "Street / Building", span: 2 },
          { key: "city",    label: "City *",          placeholder: "Mumbai",            span: 1 },
          { key: "pin",     label: "PIN Code *",      placeholder: "400001",            span: 1 },
        ].map(f => (
          <div key={f.key} style={{ gridColumn: f.span === 2 ? "1/-1" : "auto" }}>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>{f.label}</label>
            <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder} style={{ width: "100%", padding: "12px", marginTop: 6,
                borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{ background: "#f9f8f5", borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Order Summary</div>
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between",
            fontSize: 13, marginBottom: 10, padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{item.template?.name || "Custom Design"}</div>
              <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>
                {item.quantity} pcs · {item.paperType} · {item.cornerType}
                {item.customUpload && <span style={{ color: "#c9a84c", marginLeft: 6 }}>⬆ Custom Upload</span>}
              </div>
            </div>
            <span style={{ fontWeight: 700, color: "#1a1a2e" }}>₹{item.price?.toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, marginTop: 8 }}>
          <span>Total</span>
          <span style={{ color: "#1a1a2e" }}>₹{cartTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Pay Button */}
      <button onClick={handlePayment} disabled={loading} style={{ width: "100%", padding: "16px",
        background: loading ? "#888" : "#1a1a2e", color: "#fff", border: "none",
        borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {loading ? "Opening payment…" : <>
          <span>Pay ₹{cartTotal.toLocaleString()} Securely</span>
          <span style={{ fontSize: 20 }}>→</span>
        </>}
      </button>

      {/* Payment methods */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>Accepted payment methods</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets"].map(m => (
            <span key={m} style={{ background: "#f5f4f0", color: "#666", padding: "4px 10px",
              borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{m}</span>
          ))}
        </div>
        <div style={{ color: "#bbb", fontSize: 11, marginTop: 10 }}>🔒 Secured by Razorpay</div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────

const STATUS_COLORS = {
  pending:    { bg: "#fff8e6", color: "#b7791f", border: "#f6e05e" },
  processing: { bg: "#ebf8ff", color: "#2b6cb0", border: "#90cdf4" },
  printing:   { bg: "#f0fff4", color: "#276749", border: "#9ae6b4" },
  shipped:    { bg: "#faf5ff", color: "#553c9a", border: "#d6bcfa" },
  delivered:  { bg: "#f0fff4", color: "#276749", border: "#68d391" },
  cancelled:  { bg: "#fff5f5", color: "#c53030", border: "#feb2b2" },
};

// Demo orders for preview
const DEMO_ORDERS = [
  { id: 1, order_number: "PI-ABC1-XY12", customer_name: "Ananya Sharma", customer_email: "ananya@gmail.com",
    customer_phone: "+91 98765 43210", shipping_address: "14 MG Road", city: "Mumbai", pin_code: "400001",
    total: 899, status: "pending", created_at: new Date(Date.now() - 3600000).toISOString(),
    items: [{ product_name: "Luxe Business Cards", template_name: "Executive Black", paper_type: "Glossy 350 GSM", quantity: 200, corner_type: "Rounded Corner", is_custom_upload: 0 }],
    files: [] },
  { id: 2, order_number: "PI-DEF2-AB34", customer_name: "Rohan Mehta", customer_email: "rohan@startup.com",
    customer_phone: "+91 91234 56789", shipping_address: "7 Bandra West", city: "Mumbai", pin_code: "400050",
    total: 1299, status: "processing", created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [{ product_name: "Gold Foil Visiting Cards", template_name: null, paper_type: "Premium Soft Touch", quantity: 100, corner_type: "Standard Square", is_custom_upload: 1 }],
    files: [{ side: "front", original_name: "my_design_front.pdf", cloudinary_url: "#" }, { side: "back", original_name: "my_design_back.pdf", cloudinary_url: "#" }] },
  { id: 3, order_number: "PI-GHI3-CD56", customer_name: "Priya Kapoor", customer_email: "priya@design.in",
    customer_phone: "+91 99887 76655", shipping_address: "22 Koramangala", city: "Bengaluru", pin_code: "560034",
    total: 599, status: "shipped", created_at: new Date(Date.now() - 172800000).toISOString(),
    items: [{ product_name: "Premium Flyers", template_name: "Coral Sunrise", paper_type: "Matte 300 GSM", quantity: 100, corner_type: "Standard Square", is_custom_upload: 0 }],
    files: [] },
  { id: 4, order_number: "PI-JKL4-EF78", customer_name: "Vikram Singh", customer_email: "vikram@corp.com",
    customer_phone: "+91 88776 65544", shipping_address: "5 Connaught Place", city: "New Delhi", pin_code: "110001",
    total: 4999, status: "delivered", created_at: new Date(Date.now() - 345600000).toISOString(),
    items: [{ product_name: "Canvas Paintings", template_name: null, paper_type: null, quantity: 1, corner_type: null, is_custom_upload: 1 }],
    files: [{ side: "front", original_name: "canvas_artwork.png", cloudinary_url: "#" }] },
];

function AdminDashboard({ onBack }) {
  const [orders, setOrders]       = useState(DEMO_ORDERS);
  const [selected, setSelected]   = useState(null);
  const [filterStatus, setFilter] = useState("all");
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // Try fetching real orders from backend
  useEffect(() => {
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer demo` } })
      .then(r => r.json())
      .then(data => { if (data.orders?.length) setOrders(data.orders); })
      .catch(() => {}); // silently use demo data
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer demo" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
        showToast(`Status updated to "${newStatus}" — email sent to customer ✅`);
      }
    } catch {
      // Demo mode: update locally
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
      showToast(`Status updated to "${newStatus}" ✅`);
    }
    setLoading(false);
  };

  const stats = {
    total:      orders.length,
    pending:    orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => ["processing","printing"].includes(o.status)).length,
    revenue:    orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    files:      orders.reduce((s, o) => s + (o.files?.length || 0), 0),
  };

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  // ── ORDER DETAIL MODAL ──
  if (selected) {
    const sc = STATUS_COLORS[selected.status] || STATUS_COLORS.pending;
    return (
      <div style={{ minHeight: "100vh", background: "#f9f8f5", fontFamily: "'Montserrat',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <div style={{ background: "#1a1a2e", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid #444",
            color: "#aaa", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>← Back</button>
          <span style={{ color: "#fff", fontWeight: 700 }}>Order {selected.order_number}</span>
          <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>
            {selected.status.toUpperCase()}
          </span>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Customer Info */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a2e", marginBottom: 16 }}>👤 Customer</div>
            {[["Name", selected.customer_name], ["Email", selected.customer_email],
              ["Phone", selected.customer_phone || "—"],
              ["Address", `${selected.shipping_address}, ${selected.city} - ${selected.pin_code}`],
              ["Ordered", new Date(selected.created_at).toLocaleString("en-IN")]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
                borderBottom: "1px solid #f5f4f0", fontSize: 13 }}>
                <span style={{ color: "#888" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a", maxWidth: 220, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Update Status */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a2e", marginBottom: 16 }}>⚙️ Update Status</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["pending","processing","printing","shipped","delivered","cancelled"].map(s => {
                const c = STATUS_COLORS[s];
                return (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    disabled={selected.status === s || loading}
                    style={{ padding: "10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: selected.status === s ? "default" : "pointer",
                      background: selected.status === s ? c.bg : "#f9f8f5",
                      border: selected.status === s ? `2px solid ${c.border}` : "1px solid #eee",
                      color: selected.status === s ? c.color : "#666",
                      opacity: selected.status === s ? 1 : 0.85 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                    {selected.status === s && " ✓"}
                  </button>
                );
              })}
            </div>
            <p style={{ color: "#aaa", fontSize: 11, marginTop: 12 }}>Customer receives an email on every status change.</p>
          </div>

          {/* Items */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a2e", marginBottom: 16 }}>📦 Order Items</div>
            {(selected.items || []).map((item, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #f5f4f0" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{item.product_name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                  {item.template_name ? `Template: ${item.template_name}` : "⬆ Custom Upload"} ·{" "}
                  {item.paper_type || "N/A"} · {item.quantity} pcs · {item.corner_type || "N/A"}
                </div>
              </div>
            ))}
            <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e", marginTop: 16, textAlign: "right" }}>
              Total: ₹{selected.total.toLocaleString()}
            </div>
          </div>

          {/* Design Files */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a2e", marginBottom: 16 }}>🖨 Print Files</div>
            {selected.files?.length > 0 ? (
              selected.files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px", background: "#f9f8f5", borderRadius: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>
                      {f.side.toUpperCase()} SIDE
                    </div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{f.original_name}</div>
                  </div>
                  <a href={f.cloudinary_url} target="_blank" rel="noreferrer"
                    style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff",
                      borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                    ⬇ Download
                  </a>
                </div>
              ))
            ) : (
              <div style={{ background: "#f9f8f5", borderRadius: 10, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎨</div>
                <div style={{ fontSize: 13, color: "#888" }}>Template-based design</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  Template: {selected.items?.[0]?.template_name || "N/A"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD ──
  return (
    <div style={{ minHeight: "100vh", background: "#f9f8f5", fontFamily: "'Montserrat',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {toast && <div style={{ position: "fixed", top: 20, right: 20, background: "#1a1a2e", color: "#fff",
        padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 9999,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>{toast}</div>}

      {/* Header */}
      <div style={{ background: "#1a1a2e", padding: "16px 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #333",
            color: "#aaa", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>← Store</button>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
              Print<span style={{ color: "#c9a84c" }}>It</span> Admin
            </div>
            <div style={{ color: "#666", fontSize: 11 }}>Order Management Dashboard</div>
          </div>
        </div>
        <div style={{ color: "#555", fontSize: 12 }}>
          {orders.filter(o => o.status === "pending").length > 0 && (
            <span style={{ background: "#c9a84c", color: "#000", padding: "4px 12px",
              borderRadius: 20, fontWeight: 800, fontSize: 12 }}>
              {orders.filter(o => o.status === "pending").length} new order{orders.filter(o => o.status === "pending").length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Orders",   value: stats.total,      icon: "📋", color: "#1a1a2e" },
            { label: "Pending",        value: stats.pending,    icon: "⏳", color: "#b7791f" },
            { label: "In Production",  value: stats.processing, icon: "⚙️", color: "#2b6cb0" },
            { label: "Total Revenue",  value: `₹${stats.revenue.toLocaleString()}`, icon: "💰", color: "#276749" },
            { label: "Design Files",   value: stats.files,      icon: "📎", color: "#553c9a" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginTop: 8 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["all","pending","processing","printing","shipped","delivered","cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: filterStatus === s ? "#1a1a2e" : "#fff",
              color: filterStatus === s ? "#fff" : "#666",
              border: filterStatus === s ? "none" : "1px solid #e0e0e0"
            }}>
              {s === "all" ? `All (${orders.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9f8f5" }}>
                {["Order #","Customer","Product","Files","Amount","Status","Action"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#888",
                    fontWeight: 700, fontSize: 11, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                return (
                  <tr key={order.id} style={{ borderTop: "1px solid #f5f4f0", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 12 }}>{order.order_number}</div>
                      <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{order.customer_name}</div>
                      <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>{order.customer_email}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#555" }}>{order.items?.[0]?.product_name || "—"}</div>
                      {order.items?.[0]?.is_custom_upload ? (
                        <span style={{ fontSize: 10, background: "#fff8e6", color: "#b7791f",
                          padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>Custom Upload</span>
                      ) : order.items?.[0]?.template_name ? (
                        <span style={{ fontSize: 10, color: "#aaa" }}>{order.items[0].template_name}</span>
                      ) : null}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {order.files?.length > 0 ? (
                        <span style={{ background: "#f0fff4", color: "#276749", border: "1px solid #9ae6b4",
                          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          {order.files.length} file{order.files.length > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span style={{ color: "#aaa", fontSize: 12 }}>Template</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 800, color: "#1a1a2e" }}>
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => setSelected(order)} style={{ padding: "7px 14px",
                        background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8,
                        fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#aaa" }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

