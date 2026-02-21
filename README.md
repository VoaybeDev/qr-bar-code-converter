# QR Code Studio

> Générateur et lecteur de QR Code — application React minimaliste et mobile-friendly.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-MVP-orange)

---

## ✨ Fonctionnalités

- **Générer** un QR Code à partir de n'importe quel texte ou URL
- **Télécharger** le QR Code en `.png`
- **Scanner** via la caméra en temps réel
- **Scanner** depuis une image locale (PNG, JPG, WEBP…)
- **Copier** le résultat dans le presse-papiers
- Interface à onglets — génération et lecture ne se mélangent jamais

---

## 🛠️ Stack

| Outil | Rôle |
|---|---|
| [React 18](https://react.dev) | UI |
| [qrcode.react](https://github.com/zpao/qrcode.react) | Génération du QR Code |
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

Le dossier `build/` contient les fichiers statiques prêts à déployer.

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

- [ ] Historique des scans
- [ ] Personnalisation du QR Code (couleur, logo)
- [ ] PWA / mode hors-ligne
- [ ] Export SVG

---

## 👤 Auteur

**VoaybeDev** — [github.com/VoaybeDev](https://github.com/VoaybeDev)

---

*Projet MVP — contributions bienvenues.*