# QR Code Studio

> Générateur et lecteur de QR Code personnalisable — application React minimaliste et mobile-friendly.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-MVP-orange)

---

## ✨ Fonctionnalités

- **Générer** un QR Code à partir de n'importe quel texte ou URL
- **Personnaliser** le QR Code (couleurs, style, logo, presets)
- **Télécharger** le QR Code en `.png`
- **Scanner** via la caméra en temps réel
- **Scanner** depuis une image locale (PNG, JPG, WEBP…)
- **Copier** le résultat dans le presse-papiers
- Interface à onglets — génération et lecture ne se mélangent jamais

---

## 🎨 Personnalisation QR

| Option | Détail |
|---|---|
| **Presets** | Telegram, WhatsApp, Instagram, Sombre, Classique |
| **Couleurs** | Points, coins et fond personnalisables |
| **Style des points** | Carré, Rond, Arrondi, Classy, Classy+, Extra |
| **Style des coins** | Carré, Rond, Arrondi |
| **Logo** | Import d'image placée au centre du QR |

---

## 🛠️ Stack

| Outil | Rôle |
|---|---|
| [React 18](https://react.dev) | UI |
| [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) | Génération & personnalisation du QR Code |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | Scan caméra & fichier |

---

## 🚀 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/VoaybeDev/qr-code-generator-react.git
cd qr-code-generator-react

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Lancer en développement
npm start
```

L'application tourne sur [http://localhost:3000](http://localhost:3000).

---

## 📦 Build production

```bash
npm run build
```

---

## 📁 Structure

```
src/
├── App.js        # Composant principal (logique + UI)
├── App.css       # Styles globaux
└── index.js      # Point d'entrée React
```

---

## 🗺️ Roadmap

- [x] Génération de QR Code
- [x] Scan caméra & fichier image
- [x] Personnalisation complète (couleurs, styles, logo)
- [x] Presets inspirés d'apps populaires
- [ ] Historique des scans
- [ ] Dégradé sur les points
- [ ] PWA / mode hors-ligne
- [ ] Export SVG

---

## 👤 Auteur

**VoaybeDev** — [github.com/VoaybeDev](https://github.com/VoaybeDev)

---

*Projet MVP — contributions bienvenues.*