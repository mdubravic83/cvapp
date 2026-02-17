# CV App (Europass) - PRD

## Problem Statement
Klonirati repo https://github.com/mdubravic83/cvapp.git i popraviti PDF export koji nije radio (generirani PDF se nije mogao otvoriti). Zatim preuzeti sve informacije sa https://europass-converter.preview.emergentagent.com/ i ažurirati CV app. Popraviti produkcijski deployment na Hostingeru.

## Architecture
- **Frontend**: React.js s Tailwind CSS, shadcn/ui komponente
- **Backend**: FastAPI (Python) s reportlab za PDF generaciju
- **Database**: MongoDB za spremanje CV podataka
- **Fonts**: DejaVu font family za PDF rendering
- **Deployment**: Hostinger Startup Cloud (medihacv.finzen.click)

## What's Been Implemented
- **[Jan 2026]** Bug fix: Instaliran `reportlab` library koji je nedostajao
- **[Jan 2026]** Bug fix: Zamijenjen nedostajući font `DejaVuSans-Oblique.ttf` s `DejaVuSans.ttf` fallback
- **[Jan 2026]** Data update: Svi CV podaci ažurirani sa izvorne Europass stranice
- **[Jan 2026]** Production fix: `REACT_APP_BACKEND_URL` fallback na `""` za relativne API putanje - riješava `/undefined/api/...` 404 greške na Hostingeru

## Backlog
- P1: Dodati proper Oblique/Italic font
- P2: QR kod funkcionalnost
