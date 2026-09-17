# 🚀 ATS-Friendly Smart Resume Builder

A professional, modern, and ATS-optimized Resume Builder web application built with pure **HTML5, CSS3, and Vanilla JavaScript**.

No frameworks, no backend, no databases, and no installations needed. It runs immediately in any web browser.

---

## ⚡ Quick Start (How to Run)

### Method 1: Double-Click (Easiest)
1. Open File Explorer to `E:\resume builders`.
2. Double-click **`run.bat`** (or right-click **`index.html`** → Open with Chrome / Edge / Firefox).

### Method 2: PowerShell / Terminal
Open your terminal in this directory and run:
```powershell
Start-Process "index.html"
```
Or launch specifically in Edge / Chrome:
```powershell
Start-Process msedge "e:\resume builders\index.html"
```

### Method 3: Local Web Server (Optional)
If you prefer running via a local HTTP server:
```powershell
python -m http.server 3000
```
Then visit: **`http://localhost:3000`** in your browser.

---

## 🌟 Key Features

* **📱 Mobile-Friendly Responsive UI**:
  * Seamless mobile mode switcher (`✏️ Edit Resume` vs `👁️ Live Preview`).
  * Full-width single-column responsive form layout on phones and tablets.
  * 16px mobile input typography to prevent iOS mobile auto-zoom.
  * Floating one-tap **"📥 Download PDF Softcopy"** button on mobile preview.
  * Live mobile ATS compatibility badge.
* **📄 Direct PDF Softcopy Download**:
  * One-click client-side `.pdf` generation via bundled offline `html2pdf.js`.
  * Generates and downloads `[Candidate_Name]_ATS_Resume.pdf` directly to your device's Downloads folder without needing dialogs.
  * High-resolution 2x retina scale for crisp text rendering and ATS machine scanning.
  * Visual progress spinner overlay during document rendering.
  * Secondary **"Print / Vector PDF"** button for native browser printing.
* **5 ATS-Optimized Templates**:
  * **Modern Tech**: Contemporary sans-serif, accent headers, role tags.
  * **Classic Corporate**: High-contrast, single column, traditional serif/sans dividers.
  * **Minimalist Clean**: Monochrome, ultra-clean density, 100% scanner safe.
  * **Compact Split**: Dual-column visual layout with linear DOM stream for ATS parsers.
  * **Executive Leadership**: Refined header block with bold section styling for senior roles.
* **Real-Time Live Preview**: Instant visual updates as you type, with zoom controls (Fit, Reset, +/-) and A4 page break indicators.
* **ATS Compatibility Engine (0–100 Score)**: Real-time audit of contact information, power action verbs, quantifiable metrics (`%`, `$`, numbers), and standard headers.
* **Power Action Verbs Library**: Click-to-copy power verbs categorized by Leadership, Engineering, Impact, and Execution.
* **Dynamic Section Customizer**:
  * Add, edit, remove, and reorder positions, degrees, skills, and projects.
  * Hide or show sections on the fly.
  * Create custom sections (Languages, Publications, Volunteer Work, Awards).
* **Styling Studio**:
  * 8 curated professional color themes + Custom Color Picker.
  * Typography pairings (Inter, Roboto, Merriweather, Georgia, Arial).
  * Font sizing, line height, and section margin controls to fit your content onto 1 or 2 pages.
* **Sample Profiles**: 1-click loading for Software Engineer, Product Manager, and Growth Marketing Lead.
* **Data Persistence**:
  * Automatic local browser storage (`localStorage`).
  * Backup & restore via **JSON Export / Import**.

---

## 🖨️ How to Save / Download as PDF

1. Click the blue **"Download PDF"** button in the top toolbar.
2. In the browser print dialog:
   * **Destination**: Select **"Save as PDF"**.
   * **Pages**: Select **"All"** (or specify page 1).
   * **Margins**: Set to **"Default"** or **"None"**.
   * **Options**: Make sure **"Background graphics"** is checked.
3. Click **Save**.
