import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import './App.css';

function App() {
  const [mode, setMode] = useState("generate");
  const [scanMode, setScanMode] = useState("camera");
  const [text, setText] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [status, setStatus] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // ── Nettoyage caméra au démontage ─────────────────────
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (_) {}
      setCameraActive(false);
    }
  };

  // ── Démarrage caméra ──────────────────────────────────
  const startCamera = async () => {
    try {
      const qrCode = new Html5Qrcode("qr-reader-container");
      html5QrCodeRef.current = qrCode;

      await qrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          setScannedResult(decodedText);
          setStatus({ type: "success", msg: "QR Code détecté !" });
          stopCamera();
        },
        () => {} // erreur silencieuse (frame sans QR)
      );
      setCameraActive(true);
      setStatus(null);
    } catch (err) {
      setStatus({ type: "error", msg: "Impossible d'accéder à la caméra." });
    }
  };

  // ── Scan depuis fichier image ─────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    try {
      const qrCode = new Html5Qrcode("qr-reader-container");
      const result = await qrCode.scanFile(file, true);
      setScannedResult(result);
      setStatus({ type: "success", msg: "QR Code lu depuis l'image !" });
    } catch {
      setStatus({ type: "error", msg: "Aucun QR Code trouvé dans cette image." });
    }
  };

  // ── Changement de mode global ─────────────────────────
  const handleModeSwitch = async (newMode) => {
    await stopCamera();
    setMode(newMode);
    setScanMode("camera");
    setScannedResult(null);
    setStatus(null);
    setText("");
    setQrVisible(false);
  };

  // ── Changement caméra ↔ fichier ───────────────────────
  const handleScanModeSwitch = async (newScanMode) => {
    await stopCamera();
    setScanMode(newScanMode);
    setScannedResult(null);
    setStatus(null);
  };

  // ── Générer ───────────────────────────────────────────
  const generateQrCode = () => {
    if (text.trim() === "") {
      setStatus({ type: "error", msg: "Veuillez entrer un texte avant de générer." });
      return;
    }
    setQrVisible(true);
    setStatus({ type: "success", msg: "QR Code généré avec succès !" });
  };

  const clearAll = () => {
    setText("");
    setQrVisible(false);
    setStatus(null);
  };

  const saveQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
    setStatus({ type: "success", msg: "QR Code enregistré avec succès." });
  };

  const clearScan = async () => {
    await stopCamera();
    setScannedResult(null);
    setStatus(null);
  };

  // ── Rendu ─────────────────────────────────────────────
  return (
    <div className="app">
      <h1 className="title">QR Code Studio</h1>

      {/* Onglets principaux */}
      <div className="tabs">
        <button
          className={`tab ${mode === "generate" ? "active" : ""}`}
          onClick={() => handleModeSwitch("generate")}
        >
          ✏️ Générer
        </button>
        <button
          className={`tab ${mode === "scan" ? "active" : ""}`}
          onClick={() => handleModeSwitch("scan")}
        >
          🔍 Scanner
        </button>
      </div>

      {/* ── MODE GÉNÉRER ── */}
      {mode === "generate" && (
        <div className="panel">
          <p className="panel-desc">Entrez un texte ou une URL pour créer votre QR Code.</p>
          <input
            type="text"
            className="input"
            placeholder="https://exemple.com"
            value={text}
            onChange={(e) => { setText(e.target.value); setQrVisible(false); setStatus(null); }}
            onKeyDown={(e) => e.key === "Enter" && generateQrCode()}
          />
          <div className="btn-row">
            <button className="button generate" onClick={generateQrCode}>Générer</button>
            <button className="button clear" onClick={clearAll}>Effacer</button>
          </div>
          {qrVisible && (
            <div className="qr-box">
              <QRCodeCanvas value={text} size={220} ref={canvasRef} />
              <button className="button save" onClick={saveQrCode}>⬇ Enregistrer (.png)</button>
            </div>
          )}
        </div>
      )}

      {/* ── MODE SCANNER ── */}
      {mode === "scan" && (
        <div className="panel">
          {/* Sous-onglets */}
          <div className="sub-tabs">
            <button
              className={`sub-tab ${scanMode === "camera" ? "active" : ""}`}
              onClick={() => handleScanModeSwitch("camera")}
            >
              📷 Caméra
            </button>
            <button
              className={`sub-tab ${scanMode === "file" ? "active" : ""}`}
              onClick={() => handleScanModeSwitch("file")}
            >
              🖼️ Joindre une photo
            </button>
          </div>

          {/* Conteneur requis par html5-qrcode (toujours présent dans le DOM) */}
          <div id="qr-reader-container" style={{ display: "none" }} />

          {/* Caméra */}
          {scanMode === "camera" && !scannedResult && (
            <div className="camera-section">
              {!cameraActive ? (
                <button className="button generate camera-start-btn" onClick={startCamera}>
                  📷 Démarrer la caméra
                </button>
              ) : (
                <>
                  <p className="panel-desc scanning-label">🔄 Scan en cours…</p>
                  <button className="button clear" onClick={stopCamera}>Arrêter</button>
                </>
              )}
            </div>
          )}

          {/* Fichier */}
          {scanMode === "file" && !scannedResult && (
            <div
              className="file-upload-zone"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="upload-icon">📂</span>
              <p className="upload-text">Cliquez pour choisir une image</p>
              <span className="upload-hint">PNG, JPG, WEBP…</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Résultat du scan */}
          {scannedResult && (
            <div className="scan-result">
              <span className="result-label">Résultat :</span>
              <p className="result-text">{scannedResult}</p>
              <div className="btn-row">
                <button
                  className="button generate"
                  onClick={() =>
                    navigator.clipboard.writeText(scannedResult).then(() =>
                      setStatus({ type: "success", msg: "Copié dans le presse-papiers !" })
                    )
                  }
                >
                  Copier
                </button>
                <button className="button clear" onClick={clearScan}>Nouveau scan</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barre de statut */}
      {status && (
        <div className={`status ${status.type}`}>
          {status.type === "success" ? "✅" : "⚠️"} {status.msg}
        </div>
      )}
      {/* Signature */}
      <footer className="signature">
        <a href="https://github.com/VoaybeDev" target="_blank" rel="noopener noreferrer">
          🐙 github.com/VoaybeDev
        </a>
      </footer>
    </div>
  );
}

export default App;