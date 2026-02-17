# CV App (Europass) - PRD

## Problem Statement
Klonirati repo https://github.com/mdubravic83/cvapp.git i popraviti PDF export koji nije radio (generirani PDF se nije mogao otvoriti).

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
- **[Jan 2026]** Testiranje: 100% prolaznost backend, frontend i integracija

## Root Cause Analysis
1. `reportlab` Python paket nije bio instaliran u backend okruženju
2. Font datoteka `DejaVuSans-Oblique.ttf` nije postojala na sustavu - kod je pokušavao učitati nepostojeći font

## Backlog
- P0: (Nema - sve radi)
- P1: Dodati proper Oblique/Italic font ako je potreban za buduće stilove
- P2: QR kod funkcionalnost (pripremljeno u kodu ali nije aktivno)
