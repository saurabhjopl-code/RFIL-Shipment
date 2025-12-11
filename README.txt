RFIL Shipment - Minimal Implementation (Excel + Apps Script + GitHub Pages)

Files included:
- RFIL-Shipment-Data.xlsx  <-- Excel template with two sheets: shipments_master, scanlines
- docs/creator/index.html   <-- Creator dashboard (static)
- docs/packer/index.html    <-- Packer dashboard (static)
- apps-script/Code.gs       <-- Apps Script backend (paste into Apps Script project)
- apps-script/appsscript.json

Instructions:
1. Upload RFIL-Shipment-Data.xlsx to Google Drive and open it with Google Sheets. Note the Sheet ID.
2. In Google Apps Script, create a new project and paste apps-script/Code.gs. Update SHEET_ID in Code.gs with your Google Sheet ID.
3. Deploy the Apps Script as a Web App (Execute as: Me, Who has access: Anyone in domain or Anyone for testing).
4. Copy the Web App URL and replace 'REPLACE_WEBAPP_URL' in the HTML files under docs/* with the Web App URL.
5. Push the docs/ folder to your GitHub repo and enable GitHub Pages from the main branch, folder /docs.
6. Open Creator and Packer pages and test. Creator can create shipments; Packer can post scans and submit shipments.

Generated: 2025-12-11T12:47:22.727320Z
