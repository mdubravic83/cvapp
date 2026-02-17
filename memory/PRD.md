# CV App (Europass) - PRD

## Problem Statement
CV app za Medihu Dubravić. Popraviti PDF export, deployment na Hostinger, i layout PDF-a.

## Architecture
- **Frontend**: React.js + Tailwind CSS + html2pdf.js (fully client-side)
- **Data**: localStorage + defaultCvData.js fallback
- **PDF**: html2pdf.js (client-side generacija, radi bez backend-a)
- **Deployment**: Hostinger Startup Cloud (statički frontend)

## What's Been Implemented
- **[Jan 2026]** Bug fix: reportlab + font fallback
- **[Jan 2026]** Data update: Svi podaci sa izvorne Europass stranice
- **[Jan 2026]** Client-side konverzija: html2pdf.js, localStorage, FileReader
- **[Jan 2026]** PDF layout fix: dvostupčani grid (4fr:8fr), profilna slika 120x120px 1:1 ratio, windowWidth 1100px

## Testiranje: 4 iteracije, sve 100%

## Backlog
- P2: QR kod funkcionalnost
