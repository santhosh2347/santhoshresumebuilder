/**
 * RESUME PREVIEW RENDERING & ZOOM ENGINE
 */

class ResumePreview {
  constructor() {
    this.paper = document.getElementById('resume-paper');
    this.scaleWrapper = document.getElementById('preview-scale-wrapper');
    this.viewport = document.getElementById('preview-viewport');
    this.zoomText = document.getElementById('zoom-level-text');
    this.currentZoom = 1.0;

    this.initZoomListeners();
  }

  initZoomListeners() {
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.setZoom(this.currentZoom + 0.1));
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.setZoom(this.currentZoom - 0.1));
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.setZoom(1.0));
    document.getElementById('btn-zoom-fit')?.addEventListener('click', () => this.fitToWidth());

    // Auto fit on window resize if desired
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1100 && this.currentZoom > 0.8) {
        this.fitToWidth();
      }
    });
  }

  setZoom(zoom) {
    this.currentZoom = Math.min(1.6, Math.max(0.45, Math.round(zoom * 10) / 10));
    if (this.scaleWrapper) {
      this.scaleWrapper.style.transform = `scale(${this.currentZoom})`;
    }
    if (this.zoomText) {
      this.zoomText.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
  }

  fitToWidth() {
    if (!this.viewport || !this.paper) return;
    const viewportWidth = this.viewport.clientWidth - 48; // padding
    const paperWidth = 793.7; // ~210mm in px at 96dpi
    const fitRatio = Math.min(1.1, Math.max(0.45, viewportWidth / paperWidth));
    this.setZoom(fitRatio);
  }

  render(state) {
    if (!this.paper) return;

    const { settings, personal, summary, experience, education, skills, projects, certifications, customSections, sectionOrder, hiddenSections } = state;

    // Apply template class
    this.paper.className = `resume-paper template-${settings.template || 'modern'}`;

    // Apply styles via CSS variables
    this.paper.style.setProperty('--primary-color', settings.themeColor || '#1e3a8a');
    this.paper.style.setProperty('--resume-font', settings.fontFamily || 'Inter');
    this.paper.style.setProperty('--resume-font-size', settings.fontSize || '10pt');
    this.paper.style.setProperty('--resume-line-height', settings.lineHeight || 1.45);
    this.paper.style.setProperty('--section-spacing', settings.sectionSpacing || '14px');
    this.paper.style.setProperty('--show-page-break', settings.showPageBreak ? 'block' : 'none');

    // Build Header HTML
    const contacts = [];
    if (personal.email) {
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><a href="mailto:${this.escape(personal.email)}">${this.escape(personal.email)}</a></span>`);
    }
    if (personal.phone) {
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>${this.escape(personal.phone)}</span>`);
    }
    if (personal.location) {
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${this.escape(personal.location)}</span>`);
    }
    if (personal.linkedin) {
      const url = personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`;
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="${url}" target="_blank" rel="noopener">${this.escape(personal.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a></span>`);
    }
    if (personal.github) {
      const url = personal.github.startsWith('http') ? personal.github : `https://${personal.github}`;
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg><a href="${url}" target="_blank" rel="noopener">${this.escape(personal.github.replace(/^https?:\/\/(www\.)?/, ''))}</a></span>`);
    }
    if (personal.website) {
      const url = personal.website.startsWith('http') ? personal.website : `https://${personal.website}`;
      contacts.push(`<span class="contact-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg><a href="${url}" target="_blank" rel="noopener">${this.escape(personal.website.replace(/^https?:\/\/(www\.)?/, ''))}</a></span>`);
    }

    const headerHtml = `
      <header class="resume-header">
        <h1 class="resume-name">${this.escape(personal.name || 'Your Full Name')}</h1>
        ${personal.title ? `<div class="resume-title">${this.escape(personal.title)}</div>` : ''}
        ${contacts.length > 0 ? `<div class="resume-contacts">${contacts.join('')}</div>` : ''}
      </header>
    `;

    // Render individual section blocks
    const sectionBlocks = {};

    // 1. Summary
    if (summary && summary.trim()) {
      sectionBlocks['summary'] = `
        <section class="resume-section resume-section-summary">
          <h2 class="section-title">Professional Summary</h2>
          <div class="section-content">
            <p class="resume-summary-text">${this.escape(summary)}</p>
          </div>
        </section>
      `;
    }

    // 2. Experience
    if (experience && experience.length > 0) {
      const expItems = experience.map(exp => {
        const bulletsHtml = this.formatBullets(exp.bullets);
        return `
          <div class="resume-entry">
            <div class="entry-header">
              <span class="entry-role">${this.escape(exp.role || '')}</span>
              <span class="entry-date">${this.escape(exp.startDate || '')} – ${exp.isCurrent ? 'Present' : this.escape(exp.endDate || '')}</span>
            </div>
            <div class="entry-subtitle">
              <span class="entry-company">${this.escape(exp.company || '')}</span>
              ${exp.location ? `<span class="entry-location">${this.escape(exp.location)}</span>` : ''}
            </div>
            ${bulletsHtml}
          </div>
        `;
      }).join('');

      sectionBlocks['experience'] = `
        <section class="resume-section resume-section-experience">
          <h2 class="section-title">Work Experience</h2>
          <div class="section-content">${expItems}</div>
        </section>
      `;
    }

    // 3. Education
    if (education && education.length > 0) {
      const eduItems = education.map(edu => `
        <div class="education-item">
          <div class="entry-header">
            <span class="education-degree">${this.escape(edu.degree || '')}</span>
            <span class="entry-date">${this.escape(edu.gradYear || '')}</span>
          </div>
          <div class="entry-subtitle">
            <span class="education-school">${this.escape(edu.school || '')}</span>
            ${edu.location ? `<span class="entry-location">${this.escape(edu.location)}</span>` : ''}
          </div>
          ${edu.details ? `<div class="education-meta">${this.escape(edu.details)}</div>` : ''}
        </div>
      `).join('');

      sectionBlocks['education'] = `
        <section class="resume-section resume-section-education">
          <h2 class="section-title">Education</h2>
          <div class="section-content">${eduItems}</div>
        </section>
      `;
    }

    // 4. Skills
    if (skills && skills.length > 0) {
      const skillRows = skills.map(sk => {
        if (!sk.items) return '';
        if (settings.template === 'modern') {
          const badgeItems = sk.items.split(/[,|•\n]/).map(s => s.trim()).filter(Boolean);
          return `
            <div class="skill-category-row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
              <span class="skill-category-name">${this.escape(sk.category || 'Skills')}:</span>
              <div class="skills-badge-list">
                ${badgeItems.map(b => `<span class="skill-badge">${this.escape(b)}</span>`).join('')}
              </div>
            </div>
          `;
        } else {
          return `
            <div class="skill-category-row">
              <span class="skill-category-name">${this.escape(sk.category || 'Skills')}:</span>
              <span class="skill-category-items">${this.escape(sk.items)}</span>
            </div>
          `;
        }
      }).join('');

      sectionBlocks['skills'] = `
        <section class="resume-section resume-section-skills">
          <h2 class="section-title">Skills & Expertise</h2>
          <div class="section-content skills-grid">${skillRows}</div>
        </section>
      `;
    }

    // 5. Projects
    if (projects && projects.length > 0) {
      const projItems = projects.map(proj => {
        const bulletsHtml = this.formatBullets(proj.bullets);
        const linkHtml = proj.link ? ` &bull; <a href="${proj.link.startsWith('http') ? proj.link : 'https://' + proj.link}" target="_blank" rel="noopener" style="color: var(--primary-color); text-decoration: none;">${this.escape(proj.link.replace(/^https?:\/\/(www\.)?/, ''))}</a>` : '';
        return `
          <div class="resume-entry">
            <div class="entry-header">
              <span class="entry-role">${this.escape(proj.title || '')}</span>
              ${proj.role ? `<span class="entry-date">${this.escape(proj.role)}</span>` : ''}
            </div>
            ${proj.techStack || proj.link ? `
              <div class="entry-subtitle">
                <span style="font-size: 9pt; color: var(--text-muted); font-weight: 500;">
                  ${this.escape(proj.techStack || '')}${linkHtml}
                </span>
              </div>
            ` : ''}
            ${bulletsHtml}
          </div>
        `;
      }).join('');

      sectionBlocks['projects'] = `
        <section class="resume-section resume-section-projects">
          <h2 class="section-title">Projects</h2>
          <div class="section-content">${projItems}</div>
        </section>
      `;
    }

    // 6. Certifications
    if (certifications && certifications.length > 0) {
      const certItems = certifications.map(cert => `
        <div class="cert-item">
          <div>
            <span class="cert-name">${this.escape(cert.name || '')}</span>
            ${cert.issuer ? `<span class="cert-issuer"> &mdash; ${this.escape(cert.issuer)}</span>` : ''}
          </div>
          ${cert.date ? `<span class="cert-date">${this.escape(cert.date)}</span>` : ''}
        </div>
      `).join('');

      sectionBlocks['certifications'] = `
        <section class="resume-section resume-section-certifications">
          <h2 class="section-title">Certifications</h2>
          <div class="section-content">${certItems}</div>
        </section>
      `;
    }

    // 7. Custom Sections
    if (customSections && customSections.length > 0) {
      customSections.forEach(cs => {
        const itemsHtml = (cs.items || []).map(item => `
          <div class="custom-item">
            <div class="entry-header">
              <span class="custom-item-title">${this.escape(item.title || '')}</span>
              ${item.date ? `<span class="entry-date">${this.escape(item.date)}</span>` : ''}
            </div>
            ${item.subtitle ? `<div class="entry-subtitle"><span style="color: var(--text-muted);">${this.escape(item.subtitle)}</span></div>` : ''}
            ${item.description ? `<p style="margin: 2px 0 0 0; line-height: var(--resume-line-height);">${this.escape(item.description)}</p>` : ''}
          </div>
        `).join('');

        sectionBlocks[cs.id] = `
          <section class="resume-section resume-section-custom">
            <h2 class="section-title">${this.escape(cs.title || 'Additional Info')}</h2>
            <div class="section-content">${itemsHtml}</div>
          </section>
        `;
      });
    }

    // Assemble ordered body
    const hiddenSet = new Set(hiddenSections || []);
    let bodyHtml = '';

    if (settings.template === 'compact') {
      // 2-Column Split: main (Summary, Experience, Projects) vs sidebar (Skills, Education, Certifications, Custom)
      const mainKeys = ['summary', 'experience', 'projects'];
      const sideKeys = ['skills', 'education', 'certifications'];

      let mainContent = '';
      let sideContent = '';

      (sectionOrder || []).forEach(key => {
        if (hiddenSet.has(key) || !sectionBlocks[key]) return;
        if (mainKeys.includes(key)) {
          mainContent += sectionBlocks[key];
        } else {
          sideContent += sectionBlocks[key];
        }
      });

      bodyHtml = `
        <div class="resume-body-grid">
          <div class="main-column">${mainContent}</div>
          <div class="side-column">${sideContent}</div>
        </div>
      `;
    } else {
      // Standard Single Column Flow
      (sectionOrder || []).forEach(key => {
        if (!hiddenSet.has(key) && sectionBlocks[key]) {
          bodyHtml += sectionBlocks[key];
        }
      });
    }

    // Inject HTML into paper
    this.paper.innerHTML = `
      ${headerHtml}
      ${bodyHtml}
      <div class="page-2-indicator">Page 2 starts here</div>
    `;
  }

  formatBullets(bulletsText) {
    if (!bulletsText || !bulletsText.trim()) return '';
    const lines = bulletsText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';
    const lis = lines.map(line => {
      // Strip leading dash, bullet, or asterisk if present
      const cleanLine = line.replace(/^[-*•]\s*/, '');
      return `<li>${this.escape(cleanLine)}</li>`;
    }).join('');
    return `<ul class="resume-bullets">${lis}</ul>`;
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

window.resumePreview = new ResumePreview();
