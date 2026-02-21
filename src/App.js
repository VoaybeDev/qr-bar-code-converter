import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrReader } from "react-qr-reader";
import './App.css';

function App() {
  const [mode, setMode] = useState("generate"); // "generate" | "scan"
  const [text, setText] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [status, setStatus] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const canvasRef = useRef(null);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setStatus(null);
    setScannedResult(null);
    setText("");
    setQrVisible(false);
  };

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
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qr-code.png";
    link.click();
    setStatus({ type: "success", msg: "QR Code enregistré avec succès." });
  };

  const handleScan = (result) => {
    if (result?.text) {
      setScannedResult(result.text);
      setStatus({ type: "success", msg: "QR Code détecté !" });
    }
  };

  const handleError = (err) => {
    console.error(err);
    setStatus({ type: "error", msg: "Erreur d'accès à la caméra." });
  };

  const clearScan = () => {
    setScannedResult(null);
    setStatus(null);
  };

  return (
    <div className="app">
      <h1 className="title">QR Code Studio</h1>

      {/* Tab switcher */}
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
          📷 Scanner
        </button>
      </div>

      {/* ── GENERATE MODE ── */}
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

      {/* ── SCAN MODE ── */}
      {mode === "scan" && (
        <div className="panel">
          <p className="panel-desc">Pointez votre caméra vers un QR Code pour le lire.</p>

          <div className="reader-wrapper">
            <QrReader
              onResult={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
            />
          </div>

          {scannedResult && (
            <div className="scan-result">
              <span className="result-label">Résultat :</span>
              <p className="result-text">{scannedResult}</p>
              <div className="btn-row">
                <button
                  className="button generate"
                  onClick={() => navigator.clipboard.writeText(scannedResult).then(() =>
                    setStatus({ type: "success", msg: "Copié dans le presse-papiers !" })
                  )}
                >
                  Copier
                </button>
                <button className="button clear" onClick={clearScan}>Effacer</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status bar */}
      {status && (
        <div className={`status ${status.type}`}>
          {status.type === "success" ? "✅" : "⚠️"} {status.msg}
        </div>
      )}
    </div>
  );
}

export default App;