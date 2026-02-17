# CV App (Europass) - PRD

## Problem Statement
Klonirati repo i popraviti PDF export + riješiti produkcijski deployment na Hostingeru (medihacv.finzen.click) koji nema Python backend.

## Architecture
- **Frontend**: React.js s Tailwind CSS, shadcn/ui komponente
- **PDF**: html2pdf.js (client-side, radi bez backend-a)
- **Data**: localStorage za persistenciju, defaultCvData.js kao fallback
- **Image Upload**: FileReader API (client-side base64)
- **Backend**: FastAPI (opcioni fallback za dev okruženje)
- **Deployment**: Hostinger Startup Cloud (statički frontend only)

## What's Been Implemented
- **[Jan 2026]** Bug fix: Instaliran `reportlab`, font fallback
- **[Jan 2026]** Data update: Svi CV podaci ažurirani sa izvorne Europass stranice
- **[Jan 2026]** Production fix: `REACT_APP_BACKEND_URL` fallback na `""`
- **[Jan 2026]** **Client-side konverzija**: 
  - PDF export → `html2pdf.js` (ne treba backend)
  - Data save/load → `localStorage` (ne treba MongoDB)
  - Image upload → `FileReader` API (ne treba backend endpoint)
  - Backend API pozivi su sada opcioni fallback

## Testiranje
- Iteracija 1: 100% (PDF bug fix)
- Iteracija 2: 100% (data update)
- Iteracija 3: 100% (client-side konverzija)

## Backlog
- P2: QR kod funkcionalnost
