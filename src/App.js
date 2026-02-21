import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Utilisation de QRCodeCanvas pour générer un canvas
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Prêt.");
  const canvasRef = useRef(null); // Référence pour manipuler le canvas du QR Code

  const generateQrCode = () => {
    if (text.trim() === "") {
      setStatus("Texte manquant. Veuillez entrer un texte.");
      return;
    }
    setStatus("QR Code généré. Cliquez sur 'Enregistrer' pour sauvegarder.");
  };

  const clearAll = () => {
    setText("");
    setStatus("Prêt.");
  };

  const saveQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Utilisation de toDataURL pour récupérer l'image sous forme de base64
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qr-code.png";
    link.click();
    setStatus("QR Code sauvegardé avec succès.");
  };

  return (
    <div className="app">
      <h1 className="title">Générateur de QR Code</h1>
      <div className="content">
        <label className="label">Texte : </label>
        <input
          type="text"
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="button generate" onClick={generateQrCode}>
          Générer
        </button>
        <button className="button clear" onClick={clearAll}>
          Effacer
        </button>

        {text.trim() && (
          <div className="qr-preview">

            <QRCodeCanvas 
              value={text} 
              size={256} 
              ref={canvasRef} 
              renderAs="canvas"
            />
          </div>
        )}
      </div>
      <div className="status">{status}</div>
      {text.trim() && (
        <button className="button save" onClick={saveQrCode}>
          Enregistrer le QR Code
        </button>
      )}
    </div>
  );
}

export default App;