/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Html5Qrcode } from "html5-qrcode";
import './App.css';

// ── Styles de points disponibles ─────────────────────────
const DOT_STYLES = [
  { id: "square",        label: "Carré" },
  { id: "dots",          label: "Rond" },
  { id: "rounded",       label: "Arrondi" },
  { id: "classy",        label: "Classy" },
  { id: "classy-rounded",label: "Classy +" },
  { id: "extra-rounded", label: "Extra" },
];

const CORNER_STYLES = [
  { id: "square",  label: "Carré" },
  { id: "dot",     label: "Rond" },
  { id: "extra-rounded", label: "Arrondi" },
];

// ── Presets inspirés d'apps populaires ───────────────────
const PRESETS = [
  {
    name: "Telegram",
    dotColor: "#2AABEE", cornerColor: "#1a8cc1",
    bg: "#ffffff", dotStyle: "rounded", cornerStyle: "extra-rounded",
  },
  {
    name: "WhatsApp",
    dotColor: "#25D366", cornerColor: "#128C7E",
    bg: "#ffffff", dotStyle: "dots", cornerStyle: "extra-rounded",
  },
  {
    name: "Instagram",
    dotColor: "#E1306C", cornerColor: "#833AB4",
    bg: "#ffffff", dotStyle: "classy-rounded", cornerStyle: "extra-rounded",
  },
  {
    name: "Sombre",
    dotColor: "#a78bfa", cornerColor: "#7c3aed",
    bg: "#1a1a2e", dotStyle: "extra-rounded", cornerStyle: "dot",
  },
  {
    name: "Classique",
    dotColor: "#000000", cornerColor: "#000000",
    bg: "#ffffff", dotStyle: "square", cornerStyle: "square",
  },
];

function App() {
  const [mode, setMode]             = useState("generate");
  const [scanMode, setScanMode]     = useState("camera");
  const [text, setText]             = useState("");
  const [qrVisible, setQrVisible]   = useState(false);
  const [status, setStatus]         = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [cameraActive, setCameraActive]   = useState(false);
  const [logo, setLogo]             = useState(null);        // data URL du logo
  const [showCustom, setShowCustom] = useState(false);

  // Options de style
  const [dotColor,     setDotColor]     = useState("#2AABEE");
  const [cornerColor,  setCornerColor]  = useState("#1a8cc1");
  const [bgColor,      setBgColor]      = useState("#ffffff");
  const [dotStyle,     setDotStyle]     = useState("rounded");
  const [cornerStyle,  setCornerStyle]  = useState("extra-rounded");

  const qrContainerRef = useRef(null);
  const qrCodeRef      = useRef(null);
  const fileInputRef   = useRef(null);
  const logoInputRef   = useRef(null);
  const html5QrRef     = useRef(null);

  // ── Init QRCodeStyling ──────────────────────────────────
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 260, height: 260,
      data: " ",
      dotsOptions:    { type: dotStyle,    color: dotColor },
      cornersSquareOptions: { type: cornerStyle, color: cornerColor },
      cornersDotOptions:    { type: "dot",       color: cornerColor },
      backgroundOptions: { color: bgColor },
      imageOptions: { crossOrigin: "anonymous", margin: 6, imageSize: 0.3 },
      qrOptions: { errorCorrectionLevel: "H" },
    });
  }, []);

  // ── Re-render QR quand options changent ─────────────────
  useEffect(() => {
    if (!qrCodeRef.current || !qrVisible) return;
    qrCodeRef.current.update({
      data: text || " ",
      dotsOptions:    { type: dotStyle,    color: dotColor },
      cornersSquareOptions: { type: cornerStyle, color: cornerColor },
      cornersDotOptions:    { type: "dot",       color: cornerColor },
      backgroundOptions: { color: bgColor },
      image: logo || undefined,
    });
  }, [dotColor, cornerColor, bgColor, dotStyle, cornerStyle, logo, qrVisible, text]);

  // ── Attacher le QR au DOM dès qu'il est visible ─────────
  useEffect(() => {
    if (qrVisible && qrContainerRef.current) {
      qrContainerRef.current.innerHTML = "";
      qrCodeRef.current.append(qrContainerRef.current);
    }
  }, [qrVisible]);

  // ── Générer ─────────────────────────────────────────────
  const generateQrCode = () => {
    if (text.trim() === "") {
      setStatus({ type: "error", msg: "Veuillez entrer un texte avant de générer." });
      return;
    }
    qrCodeRef.current.update({
      data: text,
      dotsOptions:    { type: dotStyle,    color: dotColor },
      cornersSquareOptions: { type: cornerStyle, color: cornerColor },
      cornersDotOptions:    { type: "dot",       color: cornerColor },
      backgroundOptions: { color: bgColor },
      image: logo || undefined,
    });
    setQrVisible(true);
    setStatus({ type: "success", msg: "QR Code généré !" });
  };

  const saveQrCode = () => {
    qrCodeRef.current.download({ name: "qr-code", extension: "png" });
    setStatus({ type: "success", msg: "QR Code enregistré." });
  };

  const clearAll = () => {
    setText(""); setQrVisible(false); setStatus(null); setLogo(null);
  };

  // ── Preset ──────────────────────────────────────────────
  const applyPreset = (p) => {
    setDotColor(p.dotColor); setCornerColor(p.cornerColor);
    setBgColor(p.bg); setDotStyle(p.dotStyle); setCornerStyle(p.cornerStyle);
  };

  // ── Logo upload ─────────────────────────────────────────
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Scanner ─────────────────────────────────────────────
  const stopCamera = async () => {
    if (html5QrRef.current && cameraActive) {
      try { await html5QrRef.current.stop(); html5QrRef.current.clear(); } catch (_) {}
      setCameraActive(false);
    }
  };

  useEffect(() => { return () => stopCamera(); }, []);

  const startCamera = async () => {
    try {
      const qr = new Html5Qrcode("qr-reader-container");
      html5QrRef.current = qr;
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          setScannedResult(decoded);
          setStatus({ type: "success", msg: "QR Code détecté !" });
          stopCamera();
        },
        () => {}
      );
      setCameraActive(true); setStatus(null);
    } catch {
      setStatus({ type: "error", msg: "Impossible d'accéder à la caméra." });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; e.target.value = "";
    try {
      const qr = new Html5Qrcode("qr-reader-container");
      const result = await qr.scanFile(file, true);
      setScannedResult(result);
      setStatus({ type: "success", msg: "QR Code lu depuis l'image !" });
    } catch {
      setStatus({ type: "error", msg: "Aucun QR Code trouvé dans cette image." });
    }
  };

  const handleModeSwitch = async (m) => {
    await stopCamera();
    setMode(m); setScanMode("camera"); setScannedResult(null);
    setStatus(null); setText(""); setQrVisible(false); setShowCustom(false);
  };

  const handleScanModeSwitch = async (m) => {
    await stopCamera(); setScanMode(m); setScannedResult(null); setStatus(null);
  };

  const clearScan = async () => {
    await stopCamera(); setScannedResult(null); setStatus(null);
  };

  // ── Copier dans le presse-papiers (HTTP + HTTPS) ───────
  const copyToClipboard = (txt) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(() =>
        setStatus({ type: "success", msg: "Copié dans le presse-papiers !" })
      );
    } else {
      const el = document.createElement("textarea");
      el.value = txt;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setStatus({ type: "success", msg: "Copié dans le presse-papiers !" });
      } catch {
        setStatus({ type: "error", msg: "Copie échouée — copiez manuellement." });
      }
      document.body.removeChild(el);
    }
  };

  // ── Rendu ───────────────────────────────────────────────
  return (
    <div className="app">
      <h1 className="title">QR Code Studio</h1>

      {/* Onglets */}
      <div className="tabs">
        <button className={`tab ${mode==="generate"?"active":""}`} onClick={()=>handleModeSwitch("generate")}>✏️ Générer</button>
        <button className={`tab ${mode==="scan"?"active":""}`}     onClick={()=>handleModeSwitch("scan")}>🔍 Scanner</button>
      </div>

      {/* ── GÉNÉRER ── */}
      {mode === "generate" && (
        <div className="panel">
          <p className="panel-desc">Entrez un texte ou une URL pour créer votre QR Code.</p>

          <input
            type="text" className="input" placeholder="https://exemple.com"
            value={text}
            onChange={(e)=>{ setText(e.target.value); setQrVisible(false); setStatus(null); }}
            onKeyDown={(e)=>e.key==="Enter"&&generateQrCode()}
          />

          {/* ── Personnalisation ── */}
          <button className="toggle-custom-btn" onClick={()=>setShowCustom(v=>!v)}>
            🎨 Personnaliser {showCustom ? "▲" : "▼"}
          </button>

          {showCustom && (
            <div className="custom-panel">

              {/* Presets */}
              <div className="custom-section">
                <span className="custom-label">Presets</span>
                <div className="presets-row">
                  {PRESETS.map(p => (
                    <button key={p.name} className="preset-btn" onClick={()=>applyPreset(p)}
                      style={{ background: `linear-gradient(135deg, ${p.dotColor}, ${p.cornerColor})` }}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleurs */}
              <div className="custom-section">
                <span className="custom-label">Couleurs</span>
                <div className="color-row">
                  <label className="color-item">
                    <span>Points</span>
                    <input type="color" value={dotColor} onChange={e=>setDotColor(e.target.value)} />
                  </label>
                  <label className="color-item">
                    <span>Coins</span>
                    <input type="color" value={cornerColor} onChange={e=>setCornerColor(e.target.value)} />
                  </label>
                  <label className="color-item">
                    <span>Fond</span>
                    <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} />
                  </label>
                </div>
              </div>

              {/* Style des points */}
              <div className="custom-section">
                <span className="custom-label">Style des points</span>
                <div className="style-grid">
                  {DOT_STYLES.map(s => (
                    <button key={s.id}
                      className={`style-btn ${dotStyle===s.id?"active":""}`}
                      onClick={()=>setDotStyle(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style des coins */}
              <div className="custom-section">
                <span className="custom-label">Style des coins</span>
                <div className="style-grid">
                  {CORNER_STYLES.map(s => (
                    <button key={s.id}
                      className={`style-btn ${cornerStyle===s.id?"active":""}`}
                      onClick={()=>setCornerStyle(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo */}
              <div className="custom-section">
                <span className="custom-label">Logo au centre</span>
                <div className="logo-row">
                  <button className="button clear logo-btn" onClick={()=>logoInputRef.current.click()}>
                    📁 Choisir un logo
                  </button>
                  {logo && (
                    <button className="button clear logo-btn" onClick={()=>setLogo(null)}>
                      ✕ Supprimer
                    </button>
                  )}
                  {logo && <img src={logo} alt="logo preview" className="logo-preview" />}
                  <input ref={logoInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoUpload} />
                </div>
              </div>
            </div>
          )}

          <div className="btn-row">
            <button className="button generate" onClick={generateQrCode}>Générer</button>
            <button className="button clear"    onClick={clearAll}>Effacer</button>
          </div>

          {qrVisible && (
            <div className="qr-box">
              <div ref={qrContainerRef} className="qr-canvas-wrapper" />
              <button className="button save" onClick={saveQrCode}>⬇ Enregistrer (.png)</button>
            </div>
          )}
        </div>
      )}

      {/* ── SCANNER ── */}
      {mode === "scan" && (
        <div className="panel">
          <div className="sub-tabs">
            <button className={`sub-tab ${scanMode==="camera"?"active":""}`} onClick={()=>handleScanModeSwitch("camera")}>📷 Caméra</button>
            <button className={`sub-tab ${scanMode==="file"?"active":""}`}   onClick={()=>handleScanModeSwitch("file")}>🖼️ Joindre une photo</button>
          </div>

          <div id="qr-reader-container" style={{display:"none"}} />

          {scanMode==="camera" && !scannedResult && (
            <div className="camera-section">
              {!cameraActive
                ? <button className="button generate camera-start-btn" onClick={startCamera}>📷 Démarrer la caméra</button>
                : <><p className="panel-desc scanning-label">🔄 Scan en cours…</p><button className="button clear" onClick={stopCamera}>Arrêter</button></>
              }
            </div>
          )}

          {scanMode==="file" && !scannedResult && (
            <div className="file-upload-zone" onClick={()=>fileInputRef.current.click()}>
              <span className="upload-icon">📂</span>
              <p className="upload-text">Cliquez pour choisir une image</p>
              <span className="upload-hint">PNG, JPG, WEBP…</span>
              <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFileUpload} />
            </div>
          )}

          {scannedResult && (
            <div className="scan-result">
              <span className="result-label">Résultat :</span>
              <p className="result-text">{scannedResult}</p>
              <div className="btn-row">
                <button className="button generate"
                  onClick={()=>copyToClipboard(scannedResult)}
                >Copier</button>
                <button className="button clear" onClick={clearScan}>Nouveau scan</button>
              </div>
            </div>
          )}
        </div>
      )}

      {status && (
        <div className={`status ${status.type}`}>
          {status.type==="success"?"✅":"⚠️"} {status.msg}
        </div>
      )}

      <footer className="signature">
        <a href="https://github.com/VoaybeDev" target="_blank" rel="noopener noreferrer">
          🐙 github.com/VoaybeDev
        </a>
      </footer>
    </div>
  );
}

export default App;