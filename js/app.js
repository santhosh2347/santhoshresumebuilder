/**
 * MAIN APP CONTROLLER & BOOTSTRAPPER
 */

// Global Toast System
window.showToast = function (message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  if (type === 'danger') icon = '❌';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
};

document.addEventListener('DOMContentLoaded', () => {
  const stateStore = window.resumeState;
  const editor = window.resumeEditor;
  const preview = window.resumePreview;
  const ats = window.atsChecker;
  const printer = window.printController;

  // 1. Reactive State Subscriber
  stateStore.subscribe((state) => {
    // Sync Editor UI
    editor.sync(state);

    // Re-render Preview
    preview.render(state);

    // Update ATS Score & Status in Header
    updateATSWidget(state);
  });

  // 2. ATS Widget & Modal Controller
  function updateATSWidget(state) {
    const analysis = ats.analyze(state);
    const scorePill = document.getElementById('ats-score-pill');
    const circle = document.getElementById('ats-score-circle');
    const label = document.getElementById('ats-score-text');

    if (circle && label) {
      circle.textContent = analysis.score;
      circle.className = 'ats-score-circle';
      if (analysis.score >= 80) {
        circle.classList.add('score-good');
        label.textContent = `${analysis.score}% ATS Ready`;
      } else if (analysis.score >= 50) {
        circle.classList.add('score-medium');
        label.textContent = `${analysis.score}% Good`;
      } else {
        circle.classList.add('score-low');
        label.textContent = `${analysis.score}% Needs Work`;
      }
    }

    const mobileBadge = document.getElementById('mobile-ats-badge');
    if (mobileBadge) {
      mobileBadge.textContent = `${analysis.score}%`;
    }

    // Update ATS Tab view if active
    renderATSTab(analysis);
  }

  function renderATSTab(analysis) {
    const container = document.getElementById('ats-checklist-container');
    if (!container) return;

    container.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-studio); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 13px; color: var(--text-muted); font-weight: 500;">Overall ATS Compatibility</div>
          <div style="font-size: 28px; font-weight: 800; color: ${analysis.score >= 80 ? '#34d399' : analysis.score >= 50 ? '#fbbf24' : '#f87171'};">
            ${analysis.score} / 100
          </div>
        </div>
        <div style="display: flex; gap: 14px; text-align: right; font-size: 12px; color: var(--text-muted);">
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 16px;">${analysis.stats.actionVerbsCount}</div>
            <div>Power Verbs</div>
          </div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 16px;">${analysis.stats.metricsCount}</div>
            <div>Metrics</div>
          </div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 16px;">${analysis.stats.skillsCount}</div>
            <div>Skills</div>
          </div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${analysis.checks.map(c => `
          <div class="ats-check-item">
            <div class="ats-check-icon">${c.passed ? '✅' : '⚠️'}</div>
            <div class="ats-check-info">
              <div class="ats-check-title">${c.category} (${c.score}/${c.max} pts)</div>
              <div class="ats-check-desc">${c.message}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ATS Score Pill Click opens ATS Tab
  document.getElementById('ats-score-pill')?.addEventListener('click', () => {
    // If on mobile, switch to edit view first
    if (window.innerWidth <= 900) {
      if (layout) {
        layout.classList.remove('mobile-mode-preview');
        layout.classList.add('mobile-mode-edit');
      }
      btnMobileEdit?.classList.add('active');
      btnMobilePreview?.classList.remove('active');
    }
    editor.switchTab('ats');
  });

  // Mobile View Switcher
  const layout = document.getElementById('app-layout');
  const btnMobileEdit = document.getElementById('btn-mobile-edit');
  const btnMobilePreview = document.getElementById('btn-mobile-preview');

  btnMobileEdit?.addEventListener('click', () => {
    if (layout) {
      layout.classList.remove('mobile-mode-preview');
      layout.classList.add('mobile-mode-edit');
    }
    btnMobileEdit.classList.add('active');
    btnMobilePreview?.classList.remove('active');
  });

  btnMobilePreview?.addEventListener('click', () => {
    if (layout) {
      layout.classList.remove('mobile-mode-edit');
      layout.classList.add('mobile-mode-preview');
    }
    btnMobilePreview.classList.add('active');
    btnMobileEdit?.classList.remove('active');
    setTimeout(() => {
      preview.fitToWidth();
    }, 60);
  });

  // PDF Softcopy Direct Download Handlers
  const handleDownloadSoftcopy = () => printer.downloadSoftcopyPDF();
  document.getElementById('btn-download-softcopy-top')?.addEventListener('click', handleDownloadSoftcopy);
  document.getElementById('btn-download-softcopy-preview')?.addEventListener('click', handleDownloadSoftcopy);
  document.getElementById('btn-mobile-floating-pdf')?.addEventListener('click', handleDownloadSoftcopy);

  // Native Browser Print Handlers
  const handlePrint = () => printer.printResume();
  document.getElementById('btn-print-top')?.addEventListener('click', handlePrint);
  document.getElementById('btn-print-preview')?.addEventListener('click', handlePrint);

  // Add Item Buttons
  document.getElementById('btn-add-experience')?.addEventListener('click', () => {
    stateStore.addItem('experience', {
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: true,
      bullets: ''
    });
    window.showToast("Added new work experience entry", "success");
  });

  document.getElementById('btn-add-education')?.addEventListener('click', () => {
    stateStore.addItem('education', {
      degree: '',
      school: '',
      location: '',
      gradYear: '',
      details: ''
    });
    window.showToast("Added new education entry", "success");
  });

  document.getElementById('btn-add-skill')?.addEventListener('click', () => {
    stateStore.addItem('skills', {
      category: 'Specialized Skills',
      items: ''
    });
    window.showToast("Added skill category", "success");
  });

  document.getElementById('btn-add-project')?.addEventListener('click', () => {
    stateStore.addItem('projects', {
      title: '',
      role: '',
      techStack: '',
      link: '',
      bullets: ''
    });
    window.showToast("Added new project entry", "success");
  });

  document.getElementById('btn-add-certification')?.addEventListener('click', () => {
    stateStore.addItem('certifications', {
      name: '',
      issuer: '',
      date: '',
      link: ''
    });
    window.showToast("Added new certification entry", "success");
  });

  // Sample Profile Selector
  const sampleSelect = document.getElementById('select-sample-profile');
  if (sampleSelect) {
    sampleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val) {
        stateStore.loadSample(val);
        window.showToast(`Loaded "${e.target.options[e.target.selectedIndex].text}" profile!`, "success");
        e.target.value = '';
      }
    });
  }

  // Clear Resume Button
  document.getElementById('btn-clear-resume')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the resume and start from scratch? You can export your current resume as JSON first if you want a backup.')) {
      stateStore.clearResume();
      window.showToast("Cleared resume form. You can now build from scratch!", "info");
    }
  });

  // Export JSON
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    stateStore.exportJSON();
    window.showToast("Resume data downloaded as JSON backup", "success");
  });

  // Import JSON Modal
  const importModal = document.getElementById('import-modal');
  const importFileInput = document.getElementById('import-file-input');
  const importTextarea = document.getElementById('import-json-text');

  document.getElementById('btn-import-json-trigger')?.addEventListener('click', () => {
    if (importModal) importModal.classList.add('open');
  });

  document.getElementById('btn-close-import-modal')?.addEventListener('click', () => {
    if (importModal) importModal.classList.remove('open');
  });

  document.getElementById('btn-confirm-import')?.addEventListener('click', () => {
    const raw = importTextarea ? importTextarea.value.trim() : '';
    if (!raw) {
      alert('Please paste JSON data or select a JSON file.');
      return;
    }
    const res = stateStore.importJSON(raw);
    if (res.success) {
      if (importModal) importModal.classList.remove('open');
      if (importTextarea) importTextarea.value = '';
      window.showToast("Resume JSON imported successfully!", "success");
    } else {
      alert(`Import failed: ${res.error}`);
    }
  });

  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (importTextarea) importTextarea.value = event.target.result;
      };
      reader.readAsText(file);
    });
  }

  // Action Verbs Cheatsheet Modal
  const verbsModal = document.getElementById('verbs-modal');
  document.getElementById('btn-open-verbs-library')?.addEventListener('click', () => {
    renderVerbsLibrary();
    if (verbsModal) verbsModal.classList.add('open');
  });

  document.getElementById('btn-close-verbs-modal')?.addEventListener('click', () => {
    if (verbsModal) verbsModal.classList.remove('open');
  });

  function renderVerbsLibrary() {
    const body = document.getElementById('verbs-library-content');
    if (!body) return;
    const cats = ats.getActionVerbsByCategory();
    body.innerHTML = Object.entries(cats).map(([category, list]) => `
      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 13px; font-weight: 700; color: #93c5fd; margin-bottom: 8px;">${category}</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${list.map(v => `
            <button type="button" class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${v}'); window.showToast('Copied \\'${v}\\' to clipboard!', 'info');">
              ${v} <span style="font-size: 10px; opacity: 0.6;">📋</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // AI ASSISTANT & GRAMMAR CONTROLS
  // ==========================================
  const ai = window.aiAssistant;

  // Summary Inline Polish
  document.getElementById('btn-summary-ai-polish')?.addEventListener('click', () => {
    editor.polishSummary();
  });

  // Toggle AI Settings
  const settingsPanel = document.getElementById('ai-settings-panel');
  document.getElementById('btn-toggle-ai-settings')?.addEventListener('click', () => {
    if (settingsPanel) {
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    }
  });

  // AI Engine Selection
  const engineSelect = document.getElementById('ai-engine-select');
  const keyGroup = document.getElementById('ai-api-key-group');
  const keyInput = document.getElementById('ai-api-key-input');
  const keyLabel = document.getElementById('ai-api-key-label');

  function updateAIEngineUI() {
    if (!engineSelect) return;
    const provider = engineSelect.value;
    ai.setProvider(provider);

    if (provider === 'gemini') {
      if (keyGroup) keyGroup.style.display = 'block';
      if (keyLabel) keyLabel.textContent = 'Google Gemini API Key:';
      if (keyInput) keyInput.value = ai.geminiKey;
    } else if (provider === 'openai') {
      if (keyGroup) keyGroup.style.display = 'block';
      if (keyLabel) keyLabel.textContent = 'OpenAI API Key:';
      if (keyInput) keyInput.value = ai.openaiKey;
    } else {
      if (keyGroup) keyGroup.style.display = 'none';
    }
  }

  if (engineSelect) {
    engineSelect.value = ai.provider;
    updateAIEngineUI();
    engineSelect.addEventListener('change', updateAIEngineUI);
  }

  document.getElementById('btn-save-ai-key')?.addEventListener('click', () => {
    const provider = engineSelect ? engineSelect.value : 'builtin';
    const key = keyInput ? keyInput.value.trim() : '';
    ai.setApiKey(provider, key);
    window.showToast(`Saved API key for ${provider.toUpperCase()}`, "success");
  });

  // Run AI Grammar & Style Audit
  const auditResultsArea = document.getElementById('ai-audit-results-area');
  document.getElementById('btn-run-ai-audit')?.addEventListener('click', () => {
    if (!auditResultsArea) return;
    auditResultsArea.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);"><div class="spinner" style="margin: 0 auto 10px auto; width: 28px; height: 28px; border-width: 2.5px;"></div>Auditing resume for typos, passive voice, and phrasing...</div>`;

    setTimeout(() => {
      const currentState = stateStore.getState();
      const issues = ai.scanResume(currentState);

      if (issues.length === 0) {
        auditResultsArea.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 16px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
            <div style="font-weight: 700; color: #34d399; font-size: 14px;">Flawless Resume Language!</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">No spelling errors, passive voice, or weak phrasing detected across your resume.</div>
          </div>
        `;
        return;
      }

      auditResultsArea.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-studio);">
          <span style="font-weight: 700; font-size: 13px; color: #f87171;">⚠️ Found ${issues.length} Improvement${issues.length > 1 ? 's' : ''}</span>
          <button type="button" id="btn-apply-all-fixes" class="btn btn-primary btn-sm">
            ⚡ Apply All Fixes
          </button>
        </div>
        <div id="ai-issues-list">
          ${issues.map(iss => `
            <div class="ai-audit-card" data-issue-id="${iss.id}">
              <div class="ai-audit-card-top">
                <span class="ai-location-tag">${iss.location}</span>
                <span class="ai-issue-badge">${iss.issueType}</span>
              </div>
              <div class="ai-diff-box">
                <span class="ai-diff-original">${iss.originalSnippet}</span> &rarr; <span class="ai-diff-corrected">${iss.correctedSnippet}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 2px;">
                <span class="ai-explanation">${iss.explanation}</span>
                <button type="button" class="btn btn-secondary btn-sm btn-apply-single-fix" data-fix-id="${iss.id}">
                  Apply Fix
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Bind single fix buttons
      auditResultsArea.querySelectorAll('.btn-apply-single-fix').forEach(btn => {
        btn.addEventListener('click', () => {
          const fixId = btn.getAttribute('data-fix-id');
          const issueObj = issues.find(i => i.id === fixId);
          if (issueObj) {
            ai.applyFix(issueObj);
            btn.closest('.ai-audit-card')?.remove();
            window.showToast("Applied correction!", "success");
            // If empty
            if (auditResultsArea.querySelectorAll('.ai-audit-card').length === 0) {
              document.getElementById('btn-run-ai-audit')?.click();
            }
          }
        });
      });

      // Bind apply all fixes
      document.getElementById('btn-apply-all-fixes')?.addEventListener('click', () => {
        let count = 0;
        issues.forEach(iss => {
          if (ai.applyFix(iss)) count++;
        });
        window.showToast(`Applied all ${count} fixes successfully!`, "success");
        // Re-scan
        document.getElementById('btn-run-ai-audit')?.click();
      });

    }, 250);
  });

  // AI Bullet Point Rewriter
  const rewriteInput = document.getElementById('ai-rewrite-input');
  const rewriteTone = document.getElementById('ai-rewrite-tone');
  const rewriteOutputArea = document.getElementById('ai-rewrite-output-area');
  const btnGenerateRewrite = document.getElementById('btn-generate-ai-rewrite');

  btnGenerateRewrite?.addEventListener('click', async () => {
    const text = rewriteInput ? rewriteInput.value.trim() : '';
    if (!text) {
      alert('Please enter a sentence or bullet point to rewrite.');
      return;
    }

    const tone = rewriteTone ? rewriteTone.value : 'ats_impact';
    if (btnGenerateRewrite) {
      btnGenerateRewrite.disabled = true;
      btnGenerateRewrite.textContent = 'Generating...';
    }

    try {
      const suggestions = await ai.rewriteText(text, tone);
      if (rewriteOutputArea) {
        rewriteOutputArea.style.display = 'block';
        rewriteOutputArea.innerHTML = `
          <div style="font-size: 12px; font-weight: 700; color: #93c5fd; margin-bottom: 8px;">
            ✨ AI Suggestions (Click to copy or use):
          </div>
          ${suggestions.map(s => `
            <div class="ai-suggestion-item">
              <span style="flex: 1; line-height: 1.4;">${s}</span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${s.replace(/'/g, "\\'")}'); window.showToast('Copied to clipboard!', 'info');">
                Copy
              </button>
            </div>
          `).join('')}
        `;
      }
    } catch (err) {
      alert(`Rewrite Error: ${err.message}`);
    } finally {
      if (btnGenerateRewrite) {
        btnGenerateRewrite.disabled = false;
        btnGenerateRewrite.textContent = '⚡ Rewrite with AI';
      }
    }
  });

  // Close modals on clicking outside backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // Fit to screen on first paint
  setTimeout(() => {
    preview.fitToWidth();
  }, 100);
});
