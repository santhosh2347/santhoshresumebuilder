/**
 * AI RESUME ASSISTANT & GRAMMAR POLISH ENGINE
 */

const RESUME_TYPOS = {
  "teh": "the",
  "experiance": "experience",
  "managment": "management",
  "responsbile": "responsible",
  "responsable": "responsible",
  "reponsible": "responsible",
  "achived": "achieved",
  "acheived": "achieved",
  "succesful": "successful",
  "imlemented": "implemented",
  "implemeted": "implemented",
  "developped": "developed",
  "maintenence": "maintenance",
  "seperate": "separate",
  "enviroment": "environment",
  "goverment": "government",
  "neccessary": "necessary",
  "necesary": "necessary",
  "alot": "a lot",
  "untill": "until",
  "definately": "definitely",
  "collegue": "colleague",
  "calender": "calendar",
  "recieved": "received",
  "occured": "occurred",
  "refered": "referred",
  "thru": "through",
  "custmer": "customer",
  "performace": "performance",
  "efficent": "efficient",
  "profesional": "professional",
  "cordinate": "coordinate",
  "colaberated": "collaborated",
  "colaborated": "collaborated",
  "optmized": "optimized",
  "architectured": "architected",
  "leaded": "led"
};

const WEAK_PHRASES = [
  { pattern: /\bresponsible for managing\b/gi, replacement: "Managed", label: "Weak phrasing", explanation: "Replace passive responsibility with direct leadership action." },
  { pattern: /\bresponsible for developing\b/gi, replacement: "Developed", label: "Weak phrasing", explanation: "Start directly with active verb 'Developed'." },
  { pattern: /\bwas responsible for\b/gi, replacement: "Spearheaded", label: "Weak phrasing", explanation: "Use high-impact action verb 'Spearheaded' instead of passive statement." },
  { pattern: /\bresponsible for\b/gi, replacement: "Oversaw", label: "Weak phrasing", explanation: "Active verb 'Oversaw' sounds more executive and impactful." },
  { pattern: /\bhelped with creating\b/gi, replacement: "Co-created", label: "Weak phrasing", explanation: "Use active collaborative verb 'Co-created'." },
  { pattern: /\bhelped to create\b/gi, replacement: "Co-developed", label: "Weak phrasing", explanation: "Use professional term 'Co-developed'." },
  { pattern: /\bhelped with\b/gi, replacement: "Supported", label: "Weak phrasing", explanation: "Use precise action verb 'Supported' or 'Co-engineered'." },
  { pattern: /\bworked on\b/gi, replacement: "Architected", label: "Vague phrasing", explanation: "'Worked on' is vague. Use specific verbs like 'Architected' or 'Engineered'." },
  { pattern: /\bin charge of\b/gi, replacement: "Directed", label: "Passive phrasing", explanation: "Use decisive leadership verb 'Directed'." },
  { pattern: /\bduties included\b/gi, replacement: "Executed", label: "Job description style", explanation: "Resumes should state achievements, not duties." },
  { pattern: /\btook care of\b/gi, replacement: "Resolved", label: "Casual phrasing", explanation: "Use professional action verb 'Resolved' or 'Maintained'." },
  { pattern: /\bassisted with\b/gi, replacement: "Collaborated on", label: "Weak phrasing", explanation: "Highlight collaboration with 'Collaborated on'." }
];

class AIAssistant {
  constructor() {
    this.provider = localStorage.getItem('resume_ai_provider') || 'builtin';
    this.geminiKey = localStorage.getItem('resume_gemini_api_key') || '';
    this.openaiKey = localStorage.getItem('resume_openai_api_key') || '';
  }

  setProvider(provider) {
    this.provider = provider;
    localStorage.setItem('resume_ai_provider', provider);
  }

  setApiKey(provider, key) {
    if (provider === 'gemini') {
      this.geminiKey = key;
      localStorage.setItem('resume_gemini_api_key', key);
    } else if (provider === 'openai') {
      this.openaiKey = key;
      localStorage.setItem('resume_openai_api_key', key);
    }
  }

  /**
   * Complete grammar, typo, and style audit of entire resume
   */
  scanResume(state) {
    const suggestions = [];

    // 1. Audit Summary
    if (state.summary && state.summary.trim()) {
      const summaryIssues = this.analyzeText(state.summary, 'Professional Summary', {
        type: 'summary'
      });
      suggestions.push(...summaryIssues);
    }

    // 2. Audit Work Experience Bullets
    (state.experience || []).forEach(exp => {
      if (!exp.bullets) return;
      const lines = exp.bullets.split('\n');
      lines.forEach((line, idx) => {
        if (!line.trim()) return;
        const bulletIssues = this.analyzeText(line, `${exp.role || 'Job'} @ ${exp.company || 'Company'} (Bullet ${idx + 1})`, {
          type: 'experience',
          id: exp.id,
          bulletIndex: idx
        });
        suggestions.push(...bulletIssues);
      });
    });

    // 3. Audit Projects Bullets
    (state.projects || []).forEach(proj => {
      if (!proj.bullets) return;
      const lines = proj.bullets.split('\n');
      lines.forEach((line, idx) => {
        if (!line.trim()) return;
        const projIssues = this.analyzeText(line, `Project: ${proj.title || 'Project'} (Bullet ${idx + 1})`, {
          type: 'project',
          id: proj.id,
          bulletIndex: idx
        });
        suggestions.push(...projIssues);
      });
    });

    return suggestions;
  }

  /**
   * Analyzes a single string and returns grammar/style issues
   */
  analyzeText(text, locationLabel, metadata = {}) {
    const issues = [];
    const cleanText = text.trim();

    // 1. Repeated consecutive words (e.g. "the the", "in in")
    const repeatedWordRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
    let match;
    while ((match = repeatedWordRegex.exec(cleanText)) !== null) {
      issues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        location: locationLabel,
        metadata: metadata,
        originalSnippet: match[0],
        correctedSnippet: match[1],
        fullOriginal: cleanText,
        fullCorrected: cleanText.replace(match[0], match[1]),
        issueType: 'Repeated Word',
        explanation: `Accidental duplicate word: "${match[0]}" -> "${match[1]}".`
      });
    }

    // 2. Common Typos
    Object.entries(RESUME_TYPOS).forEach(([typo, fix]) => {
      const regex = new RegExp(`\\b${typo}\\b`, 'gi');
      if (regex.test(cleanText)) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          location: locationLabel,
          metadata: metadata,
          originalSnippet: typo,
          correctedSnippet: fix,
          fullOriginal: cleanText,
          fullCorrected: cleanText.replace(regex, (m) => {
            return m.charAt(0) === m.charAt(0).toUpperCase() 
              ? fix.charAt(0).toUpperCase() + fix.slice(1) 
              : fix;
          }),
          issueType: 'Spelling Error',
          explanation: `Spelling typo: Change "${typo}" to "${fix}".`
        });
      }
    });

    // 3. Weak Phrasing to Action Verbs
    WEAK_PHRASES.forEach(({ pattern, replacement, label, explanation }) => {
      if (pattern.test(cleanText)) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          location: locationLabel,
          metadata: metadata,
          originalSnippet: cleanText.match(pattern)[0],
          correctedSnippet: replacement,
          fullOriginal: cleanText,
          fullCorrected: cleanText.replace(pattern, replacement),
          issueType: label,
          explanation: explanation
        });
      }
    });

    // 4. Bullet capitalization (if starting with lowercase letter)
    if (/^[a-z]/.test(cleanText.replace(/^[-*•\s]+/, ''))) {
      const trimmed = cleanText.replace(/^[-*•\s]+/, '');
      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      issues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        location: locationLabel,
        metadata: metadata,
        originalSnippet: trimmed.substring(0, 5) + '...',
        correctedSnippet: capitalized.substring(0, 5) + '...',
        fullOriginal: cleanText,
        fullCorrected: cleanText.replace(trimmed, capitalized),
        issueType: 'Capitalization',
        explanation: 'Bullet points should start with an uppercase letter.'
      });
    }

    // 5. Punctuation spacing (e.g. space before comma/period)
    if (/\s+[,.]/.test(cleanText)) {
      const fixed = cleanText.replace(/\s+([,.])/g, '$1');
      issues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        location: locationLabel,
        metadata: metadata,
        originalSnippet: 'space before punctuation',
        correctedSnippet: 'clean punctuation',
        fullOriginal: cleanText,
        fullCorrected: fixed,
        issueType: 'Punctuation Spacing',
        explanation: 'Removed unnecessary space before punctuation.'
      });
    }

    return issues;
  }

  /**
   * Applies a single fix directly to resumeState
   */
  applyFix(issue) {
    const meta = issue.metadata || {};
    const state = window.resumeState.getState();

    if (meta.type === 'summary') {
      window.resumeState.updateSummary(issue.fullCorrected);
      return true;
    }

    if (meta.type === 'experience' && meta.id) {
      const exp = (state.experience || []).find(e => e.id === meta.id);
      if (exp) {
        const lines = (exp.bullets || '').split('\n');
        if (lines[meta.bulletIndex] !== undefined) {
          lines[meta.bulletIndex] = issue.fullCorrected;
          window.resumeState.updateItem('experience', meta.id, 'bullets', lines.join('\n'));
          return true;
        }
      }
    }

    if (meta.type === 'project' && meta.id) {
      const proj = (state.projects || []).find(p => p.id === meta.id);
      if (proj) {
        const lines = (proj.bullets || '').split('\n');
        if (lines[meta.bulletIndex] !== undefined) {
          lines[meta.bulletIndex] = issue.fullCorrected;
          window.resumeState.updateItem('projects', meta.id, 'bullets', lines.join('\n'));
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Rephrase and enhance a single bullet point or summary
   */
  async rewriteText(text, tone = 'ats_impact') {
    if (!text || !text.trim()) {
      throw new Error('Please enter text to rewrite.');
    }

    // 1. Google Gemini API
    if (this.provider === 'gemini' && this.geminiKey) {
      return await this.rewriteWithGemini(text, tone);
    }

    // 2. OpenAI API
    if (this.provider === 'openai' && this.openaiKey) {
      return await this.rewriteWithOpenAI(text, tone);
    }

    // 3. Built-in High-Impact Generator (Offline, Free)
    return this.rewriteWithBuiltInEngine(text, tone);
  }

  /**
   * Built-in Heuristic Enhancer (Runs offline without any API key)
   */
  rewriteWithBuiltInEngine(text, tone) {
    let clean = text.trim().replace(/^[-*•\s]+/, '');

    // Replace common typos & weak phrases first
    Object.entries(RESUME_TYPOS).forEach(([typo, fix]) => {
      clean = clean.replace(new RegExp(`\\b${typo}\\b`, 'gi'), fix);
    });
    WEAK_PHRASES.forEach(({ pattern, replacement }) => {
      clean = clean.replace(pattern, replacement);
    });

    // Capitalize first letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);

    // Tone variations
    let v1, v2, v3;

    if (tone === 'ats_impact') {
      v1 = `Spearheaded ${clean.replace(/^(I |We )/, '')} delivering 25%+ efficiency gains and reducing latency.`;
      v2 = `Architected and deployed ${clean.replace(/^(I |We )/, '')} scaling system performance for 100K+ enterprise users.`;
      v3 = `Optimized ${clean.replace(/^(I |We )/, '')} accelerating project turnaround by 35% with 99.9% uptime.`;
    } else if (tone === 'concise') {
      v1 = `Delivered ${clean.replace(/^(I |We )/, '')} with zero downtime and streamlined architecture.`;
      v2 = `Engineered ${clean.replace(/^(I |We )/, '')} ensuring standard compliance and high reliability.`;
      v3 = `Implemented ${clean.replace(/^(I |We )/, '')} accelerating team productivity across cross-functional sprints.`;
    } else {
      // Executive
      v1 = `Directed strategic rollout of ${clean.replace(/^(I |We )/, '')} maximizing ROI and cross-functional alignment.`;
      v2 = `Orchestrated enterprise initiatives for ${clean.replace(/^(I |We )/, '')} supporting $2M+ quarterly revenue growth.`;
      v3 = `Championed operational overhaul of ${clean.replace(/^(I |We )/, '')} driving 40% measurable productivity elevation.`;
    }

    return [v1, v2, v3];
  }

  /**
   * Gemini API client-side generation
   */
  async rewriteWithGemini(text, tone) {
    const prompt = `You are a professional ATS Resume specialist and senior copywriter.
Rewrite the following resume bullet point/text to make it punchy, grammatically flawless, active-voice, and ATS-optimized.
Tone requested: ${tone} (use strong action verbs, quantifiable metrics, and remove passive fluff).
Return exactly 3 different high-impact alternative bullet points.
Return ONLY valid JSON format:
{"suggestions": ["bullet 1", "bullet 2", "bullet 3"]}

Input text: "${text}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("No response generated by Gemini.");

    try {
      const parsed = JSON.parse(candidateText);
      return parsed.suggestions || [candidateText];
    } catch {
      return [candidateText];
    }
  }

  /**
   * OpenAI API client-side generation
   */
  async rewriteWithOpenAI(text, tone) {
    const prompt = `You are an elite ATS resume writer. Rewrite this resume text in 3 distinct, high-impact variations with active power verbs and quantifiable metrics.
Tone: ${tone}.
Return ONLY JSON: {"suggestions": ["variation 1", "variation 2", "variation 3"]}
Text: "${text}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    try {
      const parsed = JSON.parse(content);
      return parsed.suggestions || [content];
    } catch {
      return [content];
    }
  }
}

window.aiAssistant = new AIAssistant();
