# CV App (Europass) - PRD

## Architecture
- **Frontend**: React.js + Tailwind CSS (fully client-side, no backend needed)
- **PDF**: `window.print()` + `@media print` CSS (browser-native, perfect grid/page breaks)
- **Data**: localStorage + defaultCvData.js
- **Image Upload**: FileReader API (base64)

## What's Been Implemented
- PDF export via window.print() (replaces html2pdf.js - fixes page break/layout issues)
- Comprehensive @media print CSS: 200px sidebar grid, 80px profile image, compact fonts
- Client-side data persistence (localStorage), image upload (FileReader)
- Bilingual HR/EN, edit mode, all CV sections

## Testiranje: 6 iteracija, 100%
