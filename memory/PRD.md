# CV App (Europass) - PRD

## Problem Statement
CV app za Medihu Dubravić. PDF export popravke: layout, slika, kompaktnost.

## Architecture
- **Frontend**: React.js + Tailwind CSS + html2pdf.js (fully client-side)
- **Data**: localStorage + defaultCvData.js fallback
- **PDF**: html2pdf.js (client-side, windowWidth: 1100px)

## What's Been Implemented
- **[Jan 2026]** Bug fix: reportlab + font fallback
- **[Jan 2026]** Data update: Svi podaci sa izvorne Europass stranice
- **[Jan 2026]** Client-side konverzija: html2pdf.js, localStorage, FileReader
- **[Jan 2026]** PDF layout v1: basic grid fix
- **[Jan 2026]** PDF layout v2: kompaktni layout sa:
  - 100x100px okrugla profilna slika (ispravan 1:1 ratio)
  - 260px fiksna lijeva kolona sa border-right (proteže se cijelom visinom)
  - Smanjeni font-size i spacing za kompaktnost
  - page-break-inside: avoid za experience/education stavke
  - Sidebar se vizualno proteže uz Obrazovanje sekciju

## Testiranje: 5 iteracija, 95-100%

## Backlog
- P2: QR kod funkcionalnost
