/**
 * PDF EXPORT & PRINT CONTROLLER (SOFTCOPY & PRINT)
 */

class PrintController {
  constructor() {
    this.originalTitle = document.title;
  }

  /**
   * Direct Softcopy Download: Generates and downloads a real .pdf file
   * directly to the user's device/downloads folder.
   */
  async downloadSoftcopyPDF() {
    const state = window.resumeState.getState();
    const candidateName = (state.personal.name || 'Candidate').trim();
    const formattedName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${formattedName || 'Candidate'}_ATS_Resume.pdf`;

    const overlay = document.getElementById('pdf-generating-overlay');
    if (overlay) overlay.classList.add('active');

    if (window.showToast) {
      window.showToast("Generating high-resolution ATS PDF softcopy...", "info");
    }

    // Allow UI to render the overlay spinner
    await new Promise(resolve => setTimeout(resolve, 80));

    try {
      const paper = document.getElementById('resume-paper');
      if (!paper) throw new Error("Resume paper element not found.");

      if (typeof html2pdf === 'function') {
        // Hide preview-only indicators during PDF capture
        const p2 = paper.querySelector('.page-2-indicator');
        const prevP2Display = p2 ? p2.style.display : '';
        if (p2) p2.style.display = 'none';

        // Temporarily ensure transform scale doesn't shrink html2canvas rendering
        const scaleWrapper = document.getElementById('preview-scale-wrapper');
        const prevTransform = scaleWrapper ? scaleWrapper.style.transform : '';
        if (scaleWrapper) scaleWrapper.style.transform = 'none';

        const opt = {
          margin: [0, 0, 0, 0],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2, // High resolution for crisp softcopy text
            useCORS: true,
            letterRendering: true,
            logging: false,
            scrollY: 0,
            scrollX: 0
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
          },
          pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
          }
        };

        await html2pdf().set(opt).from(paper).save();

        // Restore preview elements
        if (p2) p2.style.display = prevP2Display;
        if (scaleWrapper) scaleWrapper.style.transform = prevTransform;

        if (window.showToast) {
          window.showToast(`Downloaded softcopy: ${filename}`, "success");
        }
      } else {
        // Fallback to native print if library isn't loaded
        this.printResume();
      }
    } catch (err) {
      console.error("PDF softcopy generation error:", err);
      if (window.showToast) {
        window.showToast("Direct download failed. Opening standard print dialog...", "warning");
      }
      this.printResume();
    } finally {
      if (overlay) overlay.classList.remove('active');
    }
  }

  /**
   * Native Browser Print: Opens the browser's print dialog for vector printing
   */
  printResume() {
    const state = window.resumeState.getState();
    const candidateName = (state.personal.name || 'Candidate').trim();
    const formattedName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Set dynamic title so the saved PDF defaults to this name
    document.title = `${formattedName || 'Candidate'}_ATS_Resume`;

    if (window.showToast) {
      window.showToast("Print dialog opening: Select 'Save as PDF' & enable 'Background graphics'.", "info");
    }

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = this.originalTitle;
      }, 1000);
    }, 250);
  }
}

window.printController = new PrintController();
