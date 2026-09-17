/**
 * RESUME BUILDER FORM & EDITOR CONTROLLER
 */

class ResumeEditor {
  constructor() {
    this.activeTab = 'personal';
    this.initTabs();
    this.initPhotoUploader();
    this.initPersonalForm();
    this.initSummaryForm();
    this.initAppearanceForm();
    this.initSectionReorderForm();
  }

  initTabs() {
    const tabBtns = document.querySelectorAll('.editor-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.editor-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabKey);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabKey}`);
    });
  }

  initPhotoUploader() {
    const fileInput = document.getElementById('input-photo-file');
    const removeBtn = document.getElementById('btn-remove-photo');
    const toggleInput = document.getElementById('input-photo-toggle');
    const shapeGroup = document.getElementById('photo-shape-group');

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG, or WebP).');
        return;
      }

      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Please select a photo under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        window.resumeState.updatePhoto(event.target.result);
        if (window.showToast) {
          window.showToast("Profile photo attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    });

    removeBtn?.addEventListener('click', () => {
      window.resumeState.removePhoto();
      if (fileInput) fileInput.value = '';
      if (window.showToast) {
        window.showToast("Profile photo removed", "info");
      }
    });

    toggleInput?.addEventListener('change', (e) => {
      window.resumeState.togglePhoto(e.target.checked);
    });

    shapeGroup?.querySelectorAll('.btn-shape-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const shape = btn.getAttribute('data-shape');
        window.resumeState.updatePhotoShape(shape);
      });
    });
  }

  initPersonalForm() {
    const fields = ['name', 'title', 'email', 'phone', 'location', 'website', 'linkedin', 'github'];
    fields.forEach(field => {
      const input = document.getElementById(`input-personal-${field}`);
      if (input) {
        input.addEventListener('input', (e) => {
          window.resumeState.updatePersonal(field, e.target.value);
        });
      }
    });
  }

  initSummaryForm() {
    const textarea = document.getElementById('input-summary');
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        window.resumeState.updateSummary(e.target.value);
      });
    }

    // Populate Action Verb chips for summary
    const chipsContainer = document.getElementById('summary-verb-chips');
    if (chipsContainer && window.atsChecker) {
      const verbs = ['Spearheaded', 'Architected', 'Delivered', 'Scaled', 'Automated', 'Engineered', 'Accelerated', 'Optimized'];
      chipsContainer.innerHTML = verbs.map(v => `<button type="button" class="action-verb-chip" data-verb="${v}">+ ${v}</button>`).join('');
      chipsContainer.querySelectorAll('.action-verb-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const verb = btn.getAttribute('data-verb');
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const insert = (start === 0 || text.charAt(start - 1) === ' ' || text.charAt(start - 1) === '\n') ? `${verb} ` : ` ${verb} `;
            textarea.value = text.substring(0, start) + insert + text.substring(end);
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + insert.length;
            window.resumeState.updateSummary(textarea.value);
          }
        });
      });
    }
  }

  initAppearanceForm() {
    // Template cards
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const template = card.getAttribute('data-template');
        window.resumeState.updateSettings('template', template);
      });
    });

    // Theme color swatches
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        window.resumeState.updateSettings('themeColor', color);
        const customColorInput = document.getElementById('custom-theme-color');
        if (customColorInput) customColorInput.value = color;
      });
    });

    const customColorInput = document.getElementById('custom-theme-color');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        window.resumeState.updateSettings('themeColor', e.target.value);
      });
    }

    // Font Family
    const fontSelect = document.getElementById('setting-font-family');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        window.resumeState.updateSettings('fontFamily', e.target.value);
      });
    }

    // Font Size
    const fontSizeSelect = document.getElementById('setting-font-size');
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        window.resumeState.updateSettings('fontSize', e.target.value);
      });
    }

    // Line Spacing
    const lineSpacingSelect = document.getElementById('setting-line-height');
    if (lineSpacingSelect) {
      lineSpacingSelect.addEventListener('change', (e) => {
        window.resumeState.updateSettings('lineHeight', parseFloat(e.target.value));
      });
    }

    // Section Spacing
    const sectionSpacingSelect = document.getElementById('setting-section-spacing');
    if (sectionSpacingSelect) {
      sectionSpacingSelect.addEventListener('change', (e) => {
        window.resumeState.updateSettings('sectionSpacing', e.target.value);
      });
    }

    // Page Break Guide toggle
    const pageBreakToggle = document.getElementById('setting-show-page-break');
    if (pageBreakToggle) {
      pageBreakToggle.addEventListener('change', (e) => {
        window.resumeState.updateSettings('showPageBreak', e.target.checked);
      });
    }
  }

  initSectionReorderForm() {
    // Add Custom Section button
    const btnAddCustom = document.getElementById('btn-add-custom-section');
    if (btnAddCustom) {
      btnAddCustom.addEventListener('click', () => {
        const title = prompt('Enter a name for your custom section (e.g., Languages, Volunteer Work, Publications, Awards):');
        if (title && title.trim()) {
          window.resumeState.addCustomSection(title.trim());
          this.switchTab('sections');
        }
      });
    }
  }

  // Populate and synchronize the form inputs with the state
  sync(state) {
    // Sync personal details
    const p = state.personal || {};
    ['name', 'title', 'email', 'phone', 'location', 'website', 'linkedin', 'github'].forEach(field => {
      const input = document.getElementById(`input-personal-${field}`);
      if (input && input.value !== (p[field] || '')) {
        input.value = p[field] || '';
      }
    });

    // Sync Profile Photo
    const pPhoto = p.photo;
    const pShape = p.photoShape || 'circle';
    const pShow = p.showPhoto !== false;

    const imgPreview = document.getElementById('photo-img-preview');
    const placeholder = document.getElementById('photo-placeholder-icon');
    const removeBtn = document.getElementById('btn-remove-photo');
    const previewBox = document.getElementById('photo-preview-box');
    const toggleInput = document.getElementById('input-photo-toggle');

    if (toggleInput) toggleInput.checked = pShow;

    if (pPhoto) {
      if (imgPreview) {
        imgPreview.src = pPhoto;
        imgPreview.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
      if (imgPreview) {
        imgPreview.src = '';
        imgPreview.style.display = 'none';
      }
      if (placeholder) placeholder.style.display = 'flex';
      if (removeBtn) removeBtn.style.display = 'none';
    }

    if (previewBox) {
      previewBox.className = `photo-preview-wrapper shape-${pShape}`;
    }

    document.querySelectorAll('#photo-shape-group .btn-shape-select').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-shape') === pShape);
    });

    // Sync summary
    const summaryInput = document.getElementById('input-summary');
    if (summaryInput && summaryInput.value !== (state.summary || '')) {
      summaryInput.value = state.summary || '';
    }

    // Sync appearance controls
    const s = state.settings || {};
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-template') === s.template);
    });

    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-color') === s.themeColor);
    });

    const customColor = document.getElementById('custom-theme-color');
    if (customColor && customColor.value !== s.themeColor) {
      customColor.value = s.themeColor || '#1e3a8a';
    }

    const fontSelect = document.getElementById('setting-font-family');
    if (fontSelect && fontSelect.value !== s.fontFamily) {
      fontSelect.value = s.fontFamily || 'Inter';
    }

    const fontSizeSelect = document.getElementById('setting-font-size');
    if (fontSizeSelect && fontSizeSelect.value !== s.fontSize) {
      fontSizeSelect.value = s.fontSize || '10pt';
    }

    const lineSpacingSelect = document.getElementById('setting-line-height');
    if (lineSpacingSelect && parseFloat(lineSpacingSelect.value) !== s.lineHeight) {
      lineSpacingSelect.value = s.lineHeight || 1.45;
    }

    const sectionSpacingSelect = document.getElementById('setting-section-spacing');
    if (sectionSpacingSelect && sectionSpacingSelect.value !== s.sectionSpacing) {
      sectionSpacingSelect.value = s.sectionSpacing || '14px';
    }

    const pageBreakToggle = document.getElementById('setting-show-page-break');
    if (pageBreakToggle) {
      pageBreakToggle.checked = s.showPageBreak !== false;
    }

    // Render dynamic lists
    this.renderExperienceList(state.experience || []);
    this.renderEducationList(state.education || []);
    this.renderSkillsList(state.skills || []);
    this.renderProjectsList(state.projects || []);
    this.renderCertificationsList(state.certifications || []);
    this.renderCustomSectionsList(state.customSections || []);
    this.renderSectionOrderList(state);
  }

  // --- Dynamic Experience List ---
  renderExperienceList(list) {
    const container = document.getElementById('experience-list-container');
    if (!container) return;

    const signature = list.map(it => it.id).join(',');
    if (this.lastExpSig === signature) {
      // Just update title previews without replacing DOM to preserve input focus
      list.forEach(item => {
        const row = container.querySelector(`[data-id="${item.id}"]`);
        if (row) {
          const title = row.querySelector('.item-title-preview');
          if (title) title.textContent = `${item.role || 'New Job Title'} ${item.company ? '@ ' + item.company : ''}`;
        }
      });
      return;
    }
    this.lastExpSig = signature;

    container.innerHTML = list.map((item, idx) => `
      <div class="dynamic-item" data-id="${item.id}">
        <div class="item-top-bar">
          <span class="item-title-preview">${item.role || 'New Job Title'} ${item.company ? '@ ' + item.company : ''}</span>
          <div class="item-controls">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('experience', '${item.id}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('experience', '${item.id}', 'down')" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-danger-ghost btn-icon-only btn-sm" onclick="window.resumeState.removeItem('experience', '${item.id}')" title="Delete Position">&times;</button>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Job Title *</label>
            <input type="text" class="form-input" value="${this.escape(item.role || '')}" oninput="window.resumeState.updateItem('experience', '${item.id}', 'role', this.value)" placeholder="e.g. Senior Software Engineer">
          </div>
          <div>
            <label class="form-label">Company *</label>
            <input type="text" class="form-input" value="${this.escape(item.company || '')}" oninput="window.resumeState.updateItem('experience', '${item.id}', 'company', this.value)" placeholder="e.g. Acme Corp">
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Location</label>
            <input type="text" class="form-input" value="${this.escape(item.location || '')}" oninput="window.resumeState.updateItem('experience', '${item.id}', 'location', this.value)" placeholder="e.g. San Francisco, CA (or Remote)">
          </div>
          <div>
            <label class="form-label">Start Date</label>
            <input type="text" class="form-input" value="${this.escape(item.startDate || '')}" oninput="window.resumeState.updateItem('experience', '${item.id}', 'startDate', this.value)" placeholder="e.g. Jan 2022">
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">End Date</label>
            <input type="text" class="form-input" value="${this.escape(item.endDate || '')}" oninput="window.resumeState.updateItem('experience', '${item.id}', 'endDate', this.value)" placeholder="e.g. Present" ${item.isCurrent ? 'disabled' : ''}>
          </div>
          <div style="display: flex; align-items: flex-end; padding-bottom: 8px;">
            <label class="form-checkbox-label">
              <input type="checkbox" ${item.isCurrent ? 'checked' : ''} onchange="window.resumeState.updateItem('experience', '${item.id}', 'isCurrent', this.checked)">
              Currently working here
            </label>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <label class="form-label">Achievements & Responsibilities (1 bullet per line)</label>
            <button type="button" class="btn btn-ai-glow btn-sm" style="font-size: 11px; padding: 2px 8px; margin-bottom: 4px;" onclick="window.resumeEditor.polishExperienceBullets('${item.id}')">✨ AI Polish</button>
          </div>
          <textarea class="form-textarea" rows="4" placeholder="• Spearheaded design of microservices handling 10M+ requests with 99.99% uptime&#10;• Reduced latency by 42% through query optimization" oninput="window.resumeState.updateItem('experience', '${item.id}', 'bullets', this.value)">${this.escape(item.bullets || '')}</textarea>
          <div class="form-hint">Tip: Start each line with strong action verbs (Led, Architected, Slashed) and quantify with numbers/percentages.</div>
        </div>
      </div>
    `).join('');
  }

  polishSummary() {
    const state = window.resumeState.getState();
    const summary = state.summary || '';
    if (!summary.trim()) {
      if (window.showToast) window.showToast("Please enter a summary first.", "warning");
      return;
    }

    const issues = window.aiAssistant.analyzeText(summary, 'Summary', { type: 'summary' });
    if (issues.length === 0) {
      if (window.showToast) window.showToast("Summary grammar and phrasing look great!", "success");
      return;
    }

    issues.forEach(iss => {
      window.aiAssistant.applyFix(iss);
    });
    if (window.showToast) {
      window.showToast(`AI polished summary: Fixed ${issues.length} grammar/style issues!`, "success");
    }
  }

  polishExperienceBullets(expId) {
    const state = window.resumeState.getState();
    const exp = (state.experience || []).find(e => e.id === expId);
    if (!exp || !exp.bullets) {
      if (window.showToast) window.showToast("Please enter bullet points first.", "warning");
      return;
    }

    const lines = exp.bullets.split('\n');
    let fixedCount = 0;
    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      const issues = window.aiAssistant.analyzeText(line, 'Bullets', {
        type: 'experience',
        id: expId,
        bulletIndex: idx
      });
      issues.forEach(iss => {
        window.aiAssistant.applyFix(iss);
        fixedCount++;
      });
    });

    if (fixedCount > 0) {
      this.lastExpSig = null; // force re-render
      window.resumeState.notify();
      if (window.showToast) {
        window.showToast(`AI polished bullets: Fixed ${fixedCount} grammar/style issues!`, "success");
      }
    } else {
      if (window.showToast) {
        window.showToast("Bullet points grammar and active voice look clean!", "success");
      }
    }
  }

  // --- Dynamic Education List ---
  renderEducationList(list) {
    const container = document.getElementById('education-list-container');
    if (!container) return;

    const signature = list.map(it => it.id).join(',');
    if (this.lastEduSig === signature) {
      list.forEach(item => {
        const row = container.querySelector(`[data-id="${item.id}"]`);
        if (row) {
          const title = row.querySelector('.item-title-preview');
          if (title) title.textContent = `${item.degree || 'Degree'} ${item.school ? '@ ' + item.school : ''}`;
        }
      });
      return;
    }
    this.lastEduSig = signature;

    container.innerHTML = list.map((item, idx) => `
      <div class="dynamic-item" data-id="${item.id}">
        <div class="item-top-bar">
          <span class="item-title-preview">${item.degree || 'Degree'} ${item.school ? '@ ' + item.school : ''}</span>
          <div class="item-controls">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('education', '${item.id}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('education', '${item.id}', 'down')" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-danger-ghost btn-icon-only btn-sm" onclick="window.resumeState.removeItem('education', '${item.id}')" title="Delete">&times;</button>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Degree / Major *</label>
            <input type="text" class="form-input" value="${this.escape(item.degree || '')}" oninput="window.resumeState.updateItem('education', '${item.id}', 'degree', this.value)" placeholder="e.g. B.S. in Computer Science">
          </div>
          <div>
            <label class="form-label">School / University *</label>
            <input type="text" class="form-input" value="${this.escape(item.school || '')}" oninput="window.resumeState.updateItem('education', '${item.id}', 'school', this.value)" placeholder="e.g. Stanford University">
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Graduation Year / Date</label>
            <input type="text" class="form-input" value="${this.escape(item.gradYear || '')}" oninput="window.resumeState.updateItem('education', '${item.id}', 'gradYear', this.value)" placeholder="e.g. May 2020">
          </div>
          <div>
            <label class="form-label">Location</label>
            <input type="text" class="form-input" value="${this.escape(item.location || '')}" oninput="window.resumeState.updateItem('education', '${item.id}', 'location', this.value)" placeholder="e.g. Stanford, CA">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">GPA, Honors, or Key Coursework</label>
          <input type="text" class="form-input" value="${this.escape(item.details || '')}" oninput="window.resumeState.updateItem('education', '${item.id}', 'details', this.value)" placeholder="e.g. GPA: 3.9/4.0, Dean's List, Algorithms, Cloud Computing">
        </div>
      </div>
    `).join('');
  }

  // --- Dynamic Skills List ---
  renderSkillsList(list) {
    const container = document.getElementById('skills-list-container');
    if (!container) return;

    const signature = list.map(it => it.id).join(',');
    if (this.lastSkillSig === signature) {
      list.forEach(item => {
        const row = container.querySelector(`[data-id="${item.id}"]`);
        if (row) {
          const title = row.querySelector('.item-title-preview');
          if (title) title.textContent = item.category || 'Skill Category';
        }
      });
      return;
    }
    this.lastSkillSig = signature;

    container.innerHTML = list.map((item, idx) => `
      <div class="dynamic-item" data-id="${item.id}">
        <div class="item-top-bar">
          <span class="item-title-preview">${item.category || 'Skill Category'}</span>
          <div class="item-controls">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('skills', '${item.id}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('skills', '${item.id}', 'down')" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-danger-ghost btn-icon-only btn-sm" onclick="window.resumeState.removeItem('skills', '${item.id}')" title="Delete">&times;</button>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Category Name</label>
            <input type="text" class="form-input" value="${this.escape(item.category || '')}" oninput="window.resumeState.updateItem('skills', '${item.id}', 'category', this.value)" placeholder="e.g. Languages, Cloud, Frameworks">
          </div>
          <div>
            <label class="form-label">Skills (Comma-separated)</label>
            <input type="text" class="form-input" value="${this.escape(item.items || '')}" oninput="window.resumeState.updateItem('skills', '${item.id}', 'items', this.value)" placeholder="e.g. TypeScript, React, Node.js, AWS">
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Dynamic Projects List ---
  renderProjectsList(list) {
    const container = document.getElementById('projects-list-container');
    if (!container) return;

    const signature = list.map(it => it.id).join(',');
    if (this.lastProjSig === signature) {
      list.forEach(item => {
        const row = container.querySelector(`[data-id="${item.id}"]`);
        if (row) {
          const title = row.querySelector('.item-title-preview');
          if (title) title.textContent = item.title || 'New Project';
        }
      });
      return;
    }
    this.lastProjSig = signature;

    container.innerHTML = list.map((item, idx) => `
      <div class="dynamic-item" data-id="${item.id}">
        <div class="item-top-bar">
          <span class="item-title-preview">${item.title || 'New Project'}</span>
          <div class="item-controls">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('projects', '${item.id}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('projects', '${item.id}', 'down')" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-danger-ghost btn-icon-only btn-sm" onclick="window.resumeState.removeItem('projects', '${item.id}')" title="Delete">&times;</button>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Project Title *</label>
            <input type="text" class="form-input" value="${this.escape(item.title || '')}" oninput="window.resumeState.updateItem('projects', '${item.id}', 'title', this.value)" placeholder="e.g. E-Commerce Platform">
          </div>
          <div>
            <label class="form-label">Role / Subtitle</label>
            <input type="text" class="form-input" value="${this.escape(item.role || '')}" oninput="window.resumeState.updateItem('projects', '${item.id}', 'role', this.value)" placeholder="e.g. Lead Architect">
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Technologies Used</label>
            <input type="text" class="form-input" value="${this.escape(item.techStack || '')}" oninput="window.resumeState.updateItem('projects', '${item.id}', 'techStack', this.value)" placeholder="e.g. Next.js, GraphQL, PostgreSQL">
          </div>
          <div>
            <label class="form-label">Project URL / GitHub</label>
            <input type="text" class="form-input" value="${this.escape(item.link || '')}" oninput="window.resumeState.updateItem('projects', '${item.id}', 'link', this.value)" placeholder="e.g. github.com/username/project">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Bullets / Highlights (1 per line)</label>
          <textarea class="form-textarea" rows="2" placeholder="• Deployed solution serving 50k monthly active users" oninput="window.resumeState.updateItem('projects', '${item.id}', 'bullets', this.value)">${this.escape(item.bullets || '')}</textarea>
        </div>
      </div>
    `).join('');
  }

  // --- Dynamic Certifications List ---
  renderCertificationsList(list) {
    const container = document.getElementById('certifications-list-container');
    if (!container) return;

    const signature = list.map(it => it.id).join(',');
    if (this.lastCertSig === signature) {
      list.forEach(item => {
        const row = container.querySelector(`[data-id="${item.id}"]`);
        if (row) {
          const title = row.querySelector('.item-title-preview');
          if (title) title.textContent = item.name || 'Certification';
        }
      });
      return;
    }
    this.lastCertSig = signature;

    container.innerHTML = list.map((item, idx) => `
      <div class="dynamic-item" data-id="${item.id}">
        <div class="item-top-bar">
          <span class="item-title-preview">${item.name || 'Certification'}</span>
          <div class="item-controls">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('certifications', '${item.id}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveItem('certifications', '${item.id}', 'down')" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-danger-ghost btn-icon-only btn-sm" onclick="window.resumeState.removeItem('certifications', '${item.id}')" title="Delete">&times;</button>
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Certificate / Award Name *</label>
            <input type="text" class="form-input" value="${this.escape(item.name || '')}" oninput="window.resumeState.updateItem('certifications', '${item.id}', 'name', this.value)" placeholder="e.g. AWS Certified Solutions Architect">
          </div>
          <div>
            <label class="form-label">Issuer</label>
            <input type="text" class="form-input" value="${this.escape(item.issuer || '')}" oninput="window.resumeState.updateItem('certifications', '${item.id}', 'issuer', this.value)" placeholder="e.g. Amazon Web Services">
          </div>
        </div>
        <div class="form-row">
          <div>
            <label class="form-label">Date / Expiration</label>
            <input type="text" class="form-input" value="${this.escape(item.date || '')}" oninput="window.resumeState.updateItem('certifications', '${item.id}', 'date', this.value)" placeholder="e.g. Nov 2023">
          </div>
          <div>
            <label class="form-label">Verification URL</label>
            <input type="text" class="form-input" value="${this.escape(item.link || '')}" oninput="window.resumeState.updateItem('certifications', '${item.id}', 'link', this.value)" placeholder="e.g. credly.com/earner/badge">
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Dynamic Custom Sections List ---
  renderCustomSectionsList(list) {
    const container = document.getElementById('custom-sections-list-container');
    if (!container) return;

    if (!list || list.length === 0) {
      this.lastCustomSig = '';
      container.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-dim); font-size: 13px;">
          No custom sections added yet. Click "+ Add Custom Section" below to add Languages, Volunteer Work, Publications, etc.
        </div>
      `;
      return;
    }

    const signature = list.map(cs => `${cs.id}:${(cs.items || []).map(it => it.id).join('-')}`).join(';');
    if (this.lastCustomSig === signature) {
      return;
    }
    this.lastCustomSig = signature;

    container.innerHTML = list.map(cs => `
      <div class="editor-card" style="margin-top: 12px;">
        <div class="editor-card-header">
          <div class="editor-card-title">
            <span>📌 ${this.escape(cs.title)}</span>
          </div>
          <button type="button" class="btn btn-danger-ghost btn-sm" onclick="window.resumeState.removeCustomSection('${cs.id}')">Remove Section</button>
        </div>
        ${(cs.items || []).map((item, itemIdx) => `
          <div class="dynamic-item" style="background: rgba(15, 23, 42, 0.3);">
            <div class="form-row">
              <div>
                <label class="form-label">Item Title</label>
                <input type="text" class="form-input" value="${this.escape(item.title || '')}" oninput="window.resumeEditor.updateCustomItem('${cs.id}', '${item.id}', 'title', this.value)" placeholder="e.g. English & Spanish (Fluent) or Paper Title">
              </div>
              <div>
                <label class="form-label">Subtitle / Organization</label>
                <input type="text" class="form-input" value="${this.escape(item.subtitle || '')}" oninput="window.resumeEditor.updateCustomItem('${cs.id}', '${item.id}', 'subtitle', this.value)" placeholder="e.g. IEEE Conference or Red Cross">
              </div>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Details / Description</label>
              <input type="text" class="form-input" value="${this.escape(item.description || '')}" oninput="window.resumeEditor.updateCustomItem('${cs.id}', '${item.id}', 'description', this.value)" placeholder="e.g. Native fluency, 500+ volunteer hours">
            </div>
          </div>
        `).join('')}
        <button type="button" class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 6px;" onclick="window.resumeEditor.addCustomItemEntry('${cs.id}')">+ Add Entry to ${this.escape(cs.title)}</button>
      </div>
    `).join('');
  }

  updateCustomItem(customSectionId, itemId, field, value) {
    const csList = window.resumeState.getState().customSections || [];
    const section = csList.find(s => s.id === customSectionId);
    if (section && section.items) {
      const item = section.items.find(i => i.id === itemId);
      if (item) {
        item[field] = value;
        window.resumeState.save();
      }
    }
  }

  addCustomItemEntry(customSectionId) {
    const csList = window.resumeState.getState().customSections || [];
    const section = csList.find(s => s.id === customSectionId);
    if (section) {
      if (!section.items) section.items = [];
      section.items.push({
        id: `c-item-${Date.now()}`,
        title: 'New Item',
        subtitle: '',
        date: '',
        description: ''
      });
      this.lastCustomSig = null; // force re-render
      window.resumeState.save();
    }
  }

  // --- Section Reorder & Visibility ---
  renderSectionOrderList(state) {
    const container = document.getElementById('section-order-container');
    if (!container) return;

    const signature = (state.sectionOrder || []).join(',') + '|' + (state.hiddenSections || []).join(',');
    if (this.lastOrderSig === signature) {
      return;
    }
    this.lastOrderSig = signature;

    const names = {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      skills: 'Skills & Expertise',
      education: 'Education',
      projects: 'Projects',
      certifications: 'Certifications'
    };

    // Add custom section names
    (state.customSections || []).forEach(cs => {
      names[cs.id] = cs.title;
    });

    const hiddenSet = new Set(state.hiddenSections || []);
    const order = state.sectionOrder || [];

    container.innerHTML = order.map((key, idx) => {
      const label = names[key] || key;
      const isVisible = !hiddenSet.has(key);
      return `
        <div class="reorder-item">
          <div class="reorder-item-left">
            <span style="cursor: grab; color: var(--text-dim);">☰</span>
            <span style="${isVisible ? '' : 'color: var(--text-dim); text-decoration: line-through;'}">${label}</span>
          </div>
          <div class="reorder-actions">
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveSection('${key}', 'up')" title="Move Up" ${idx === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-secondary btn-icon-only btn-sm" onclick="window.resumeState.moveSection('${key}', 'down')" title="Move Down" ${idx === order.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn ${isVisible ? 'btn-secondary' : 'btn-danger-ghost'} btn-sm" onclick="window.resumeState.toggleSectionVisibility('${key}')" title="${isVisible ? 'Hide Section' : 'Show Section'}">
              ${isVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.resumeEditor = new ResumeEditor();
