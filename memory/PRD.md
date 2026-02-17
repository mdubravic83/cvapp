# CV App (Europass) - PRD

## Problem Statement
Klonirati repo https://github.com/mdubravic83/cvapp.git i popraviti PDF export koji nije radio (generirani PDF se nije mogao otvoriti). Zatim preuzeti sve informacije sa https://europass-converter.preview.emergentagent.com/ i ažurirati CV app.

## Architecture
- **Frontend**: React.js s Tailwind CSS, shadcn/ui komponente
- **Backend**: FastAPI (Python) s reportlab za PDF generaciju
- **Database**: MongoDB za spremanje CV podataka
- **Fonts**: DejaVu font family za PDF rendering

## Core Requirements
- Dvjezični CV (HR/EN) u Europass formatu
- PDF export koji generira validan PDF dokument
- Edit mode zaštićen lozinkom
- Upload profilne slike
- Prilagođene sekcije

## What's Been Implemented
- **[Jan 2026]** Bug fix: Instaliran `reportlab` library koji je nedostajao
- **[Jan 2026]** Bug fix: Zamijenjen nedostajući font `DejaVuSans-Oblique.ttf` s `DejaVuSans.ttf` fallback
- **[Jan 2026]** Data update: Ažurirani svi CV podaci sa izvorne stranice:
  - Titula: "Magistra edukacije engleskog jezika i književnosti" / "MA of English Language and Literature"
  - Iskustvo #1: datumi 01/01/2021 – 20/8/2025, prošlo vrijeme u opisima
  - Iskustvo #4: "Radila 3 godine" 
  - Iskustvo #6: "obrazovnog projekta" + Faith Regen Foundation London
  - About: ažurirani tekstovi HR/EN
  - Vještine: dodano "Koordiniranje projekta" / "Project coordination"
- **[Jan 2026]** Testiranje: 100% prolaznost backend, frontend i integracija (2 iteracije)

## Backlog
- P1: Dodati proper Oblique/Italic font ako je potreban za buduće stilove
- P2: QR kod funkcionalnost (pripremljeno u kodu ali nije aktivno)
