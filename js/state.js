/**
 * RESUME BUILDER STATE MANAGEMENT & DATA ENGINE
 */

const STORAGE_KEY = 'ats_smart_resume_builder_data_v1';

// Sample Realistic ATS-Optimized Profiles
const SAMPLE_PROFILES = {
  software_engineer: {
    personal: {
      name: 'Alex Rivera',
      title: 'Senior Full Stack Software Engineer',
      email: 'alex.rivera.dev@gmail.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Open to Remote)',
      website: 'alexrivera.dev',
      linkedin: 'linkedin.com/in/alexrivera-eng',
      github: 'github.com/alexrivera-tech'
    },
    summary: 'Results-driven Senior Full Stack Engineer with 6+ years of experience designing scalable distributed microservices and modern web applications. Expert in TypeScript, Node.js, React, and cloud architectures (AWS/Kubernetes). Spearheaded architectures supporting 10M+ daily active requests while reducing infrastructure costs by 32%.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        isCurrent: true,
        bullets: 'Architected and deployed event-driven payment processing microservices handling $45M+ annual transaction volume with 99.99% uptime.\nLed cross-functional migration of monolithic legacy system to AWS ECS & Kubernetes, slashing cloud infrastructure costs by 32% ($140K annually).\nMentored 6 junior and mid-level engineers through code reviews, design docs, and weekly architecture brown-bag sessions.\nOptimized Redis caching strategy and database query indexing, reducing p99 API response latency by 42% (from 320ms to 185ms).'
      },
      {
        id: 'exp-2',
        role: 'Full Stack Engineer',
        company: 'DataFlow Systems',
        location: 'Austin, TX',
        startDate: 'Jun 2019',
        endDate: 'Dec 2021',
        isCurrent: false,
        bullets: 'Engineered responsive analytics dashboards using React, Next.js, and TypeScript, used daily by 85,000+ enterprise customers.\nDeveloped REST and GraphQL APIs with Node.js/Express backed by PostgreSQL, handling 2,500+ requests per second.\nAutomated CI/CD deployment pipelines using GitHub Actions and Docker, reducing production deployment failure rates by 65%.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Texas at Austin',
        location: 'Austin, TX',
        gradYear: 'May 2019',
        details: 'GPA: 3.85/4.00. Dean’s Honor List. Coursework: Distributed Systems, Algorithms & Data Structures, Database Management.'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        category: 'Programming Languages',
        items: 'TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5, CSS3'
      },
      {
        id: 'skill-2',
        category: 'Frameworks & Libraries',
        items: 'React, Node.js, Express, Next.js, Redux Toolkit, TailwindCSS, Jest'
      },
      {
        id: 'skill-3',
        category: 'Cloud & DevOps',
        items: 'AWS (S3, ECS, Lambda), Docker, Kubernetes, CI/CD, PostgreSQL, Redis, Git'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'OpenPulse - Cloud Observability Tool',
        role: 'Lead Developer',
        techStack: 'Go, React, Prometheus, Docker',
        link: 'github.com/alexrivera-tech/openpulse',
        bullets: 'Built an open-source distributed tracing agent downloaded by 5,000+ developers.\nImplemented automated real-time alert triggers decreasing average incident response time by 25 minutes.'
      },
      {
        id: 'proj-2',
        title: 'QuickSync - Real-Time Document Editor',
        role: 'Creator',
        techStack: 'TypeScript, WebSockets, CRDTs, Redis',
        link: 'quicksync-demo.dev',
        bullets: 'Designed conflict-free replicated data type engine achieving sub-30ms peer sync across multi-region edge nodes.'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: 'Issued Nov 2023',
        link: 'aws.amazon.com/verify'
      }
    ],
    customSections: [],
    settings: {
      template: 'modern',
      themeColor: '#1e3a8a',
      fontFamily: 'Inter',
      fontSize: '10pt',
      lineHeight: 1.45,
      sectionSpacing: '14px',
      showPageBreak: true
    },
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    hiddenSections: []
  },

  product_manager: {
    personal: {
      name: 'Sarah Jenkins',
      title: 'Principal Product Manager',
      email: 'sarah.jenkins.pm@gmail.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      website: 'sarahjenkins.co',
      linkedin: 'linkedin.com/in/sarahjenkins-pm',
      github: ''
    },
    summary: 'Data-informed Principal Product Manager with 8+ years leading cross-functional teams to build and scale SaaS B2B platforms. Proven track record driving $18M+ ARR growth, reducing user churn by 22%, and launching 5 flagship enterprise product features from discovery to scale.',
    experience: [
      {
        id: 'exp-1',
        role: 'Principal Product Manager',
        company: 'Vanguard SaaS Platforms',
        location: 'New York, NY',
        startDate: 'Mar 2021',
        endDate: 'Present',
        isCurrent: true,
        bullets: 'Owned product strategy and roadmap for core collaboration engine, driving 35% YoY ARR growth ($4.2M net new revenue).\nLed 2 engineering squads and 1 UX team across 4 global time zones, delivering enterprise compliance features on schedule.\nConducted 60+ customer discovery interviews with Fortune 500 CISOs to formulate requirements for SOC2 and HIPAA integrations.'
      },
      {
        id: 'exp-2',
        role: 'Senior Product Manager',
        company: 'NextGen Analytics',
        location: 'Boston, MA',
        startDate: 'Aug 2017',
        endDate: 'Feb 2021',
        isCurrent: false,
        bullets: 'Spearheaded self-service onboarding redesign, boosting 30-day user activation rate from 24% to 41%.\nPartnered with Sales and Customer Success teams to develop tiered enterprise pricing model, increasing ACV by $18,000.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Master of Business Administration (MBA)',
        school: 'Columbia Business School',
        location: 'New York, NY',
        gradYear: 'May 2017',
        details: 'Specialization in Technology Strategy & Entrepreneurship.'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        category: 'Product & Strategy',
        items: 'Roadmapping, User Research, OKRs, Product Analytics, Go-to-Market (GTM), A/B Testing'
      },
      {
        id: 'skill-2',
        category: 'Tools & Technologies',
        items: 'Jira, Amplitude, Mixpanel, SQL, Figma, Postman, Tableau'
      }
    ],
    projects: [],
    certifications: [
      {
        id: 'cert-1',
        name: 'Pragmatic Certified Product Master (PMC-III)',
        issuer: 'Pragmatic Institute',
        date: 'Issued 2020',
        link: ''
      }
    ],
    customSections: [],
    settings: {
      template: 'executive',
      themeColor: '#0f766e',
      fontFamily: 'Inter',
      fontSize: '10pt',
      lineHeight: 1.45,
      sectionSpacing: '14px',
      showPageBreak: true
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
    hiddenSections: []
  },

  marketing_specialist: {
    personal: {
      name: 'David Kim',
      title: 'Senior Growth Marketing Specialist',
      email: 'david.kim.marketing@gmail.com',
      phone: '+1 (555) 432-8765',
      location: 'Chicago, IL',
      website: 'davidkimmarketing.com',
      linkedin: 'linkedin.com/in/davidkim-growth',
      github: ''
    },
    summary: 'Results-driven Growth Marketer with 5+ years optimizing multi-channel acquisition funnels, performance marketing, and retention loops. Managed $2.4M+ in paid ad spend generating 140,000+ MQLs while decreasing Customer Acquisition Cost (CAC) by 28%.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Growth Marketing Manager',
        company: 'BrightPath Digital',
        location: 'Chicago, IL',
        startDate: 'Jan 2022',
        endDate: 'Present',
        isCurrent: true,
        bullets: 'Managed $180K/month multi-channel marketing budget across Google Ads, LinkedIn, and Meta, exceeding pipeline target by 134%.\nExecuted 45+ rigorous A/B experiments on landing pages and pricing tables, elevating demo request conversions by 31%.\nSpearheaded lifecycle email nurture flows via HubSpot, reducing new customer drop-off during first 14 days by 19%.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Marketing & Analytics',
        school: 'Northwestern University',
        location: 'Evanston, IL',
        gradYear: 'Jun 2018',
        details: 'Magna Cum Laude. President of Undergraduate Marketing Association.'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        category: 'Growth & Acquisition',
        items: 'Performance Marketing (PPC), SEO, Conversion Rate Optimization (CRO), Funnel Optimization'
      },
      {
        id: 'skill-2',
        category: 'Analytics & Platforms',
        items: 'Google Analytics 4, HubSpot, Google Tag Manager, Salesforce, Looker Studio, Meta Ads'
      }
    ],
    projects: [],
    certifications: [
      {
        id: 'cert-1',
        name: 'Google Ads Search & Measurement Certified',
        issuer: 'Google',
        date: 'Issued 2023',
        link: ''
      }
    ],
    customSections: [],
    settings: {
      template: 'classic',
      themeColor: '#831843',
      fontFamily: 'Roboto',
      fontSize: '10pt',
      lineHeight: 1.45,
      sectionSpacing: '14px',
      showPageBreak: true
    },
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
    hiddenSections: []
  }
};

// Default empty template state
const EMPTY_STATE = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
  settings: {
    template: 'classic',
    themeColor: '#1e3a8a',
    fontFamily: 'Inter',
    fontSize: '10pt',
    lineHeight: 1.45,
    sectionSpacing: '14px',
    showPageBreak: true
  },
  sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
  hiddenSections: []
};

class ResumeState {
  constructor() {
    this.state = this.loadInitialState();
    this.subscribers = [];
  }

  loadInitialState() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Ensure all required properties exist
        return {
          ...SAMPLE_PROFILES.software_engineer,
          ...parsed,
          settings: { ...SAMPLE_PROFILES.software_engineer.settings, ...(parsed.settings || {}) },
          personal: { ...SAMPLE_PROFILES.software_engineer.personal, ...(parsed.personal || {}) }
        };
      }
    } catch (e) {
      console.warn('Could not parse saved resume from localStorage:', e);
    }
    // Default to Software Engineer sample profile on initial load
    return JSON.parse(JSON.stringify(SAMPLE_PROFILES.software_engineer));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
    this.notify();
  }

  notify() {
    this.subscribers.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Error in state subscriber:', err);
      }
    });
  }

  subscribe(listener) {
    this.subscribers.push(listener);
    // Initial call
    listener(this.state);
  }

  getState() {
    return this.state;
  }

  // Updates personal info field
  updatePersonal(field, value) {
    this.state.personal[field] = value;
    this.save();
  }

  // Updates professional summary
  updateSummary(value) {
    this.state.summary = value;
    this.save();
  }

  // Dynamic Array Add
  addItem(sectionKey, defaultObj = {}) {
    if (!Array.isArray(this.state[sectionKey])) {
      this.state[sectionKey] = [];
    }
    const newItem = {
      id: `${sectionKey}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...defaultObj
    };
    this.state[sectionKey].push(newItem);
    this.save();
    return newItem;
  }

  // Dynamic Array Update
  updateItem(sectionKey, id, field, value) {
    const list = this.state[sectionKey];
    if (!Array.isArray(list)) return;
    const item = list.find(it => it.id === id);
    if (item) {
      item[field] = value;
      this.save();
    }
  }

  // Dynamic Array Remove
  removeItem(sectionKey, id) {
    if (!Array.isArray(this.state[sectionKey])) return;
    this.state[sectionKey] = this.state[sectionKey].filter(it => it.id !== id);
    this.save();
  }

  // Move item within section up or down
  moveItem(sectionKey, id, direction) {
    const list = this.state[sectionKey];
    if (!Array.isArray(list)) return;
    const index = list.findIndex(it => it.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    this.save();
  }

  // Settings update
  updateSettings(key, value) {
    this.state.settings[key] = value;
    this.save();
  }

  // Section Order Move
  moveSection(sectionKey, direction) {
    const order = this.state.sectionOrder;
    const index = order.indexOf(sectionKey);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;

    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    this.save();
  }

  // Section Visibility Toggle
  toggleSectionVisibility(sectionKey) {
    if (!this.state.hiddenSections) this.state.hiddenSections = [];
    const index = this.state.hiddenSections.indexOf(sectionKey);
    if (index > -1) {
      this.state.hiddenSections.splice(index, 1);
    } else {
      this.state.hiddenSections.push(sectionKey);
    }
    this.save();
  }

  // Custom Sections Management
  addCustomSection(title = 'Certifications & Honors') {
    if (!this.state.customSections) this.state.customSections = [];
    const newSection = {
      id: `custom-${Date.now()}`,
      title: title,
      items: [
        {
          id: `c-item-${Date.now()}`,
          title: 'Section Item Title',
          subtitle: 'Organization / Detail',
          date: '2024',
          description: 'Key accomplishments, metrics, or description.'
        }
      ]
    };
    this.state.customSections.push(newSection);
    if (!this.state.sectionOrder.includes(newSection.id)) {
      this.state.sectionOrder.push(newSection.id);
    }
    this.save();
    return newSection;
  }

  removeCustomSection(id) {
    this.state.customSections = this.state.customSections.filter(s => s.id !== id);
    this.state.sectionOrder = this.state.sectionOrder.filter(k => k !== id);
    this.save();
  }

  // Load Pre-configured Sample Profile
  loadSample(profileKey) {
    if (SAMPLE_PROFILES[profileKey]) {
      this.state = JSON.parse(JSON.stringify(SAMPLE_PROFILES[profileKey]));
      this.save();
    }
  }

  // Clear Resume
  clearResume() {
    this.state = JSON.parse(JSON.stringify(EMPTY_STATE));
    this.save();
  }

  // JSON Export
  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const candidate = this.state.personal.name ? this.state.personal.name.toLowerCase().replace(/\s+/g, '_') : 'resume';
    downloadAnchor.setAttribute("download", `${candidate}_ats_resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // JSON Import
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.personal) {
        throw new Error('Invalid resume format: Missing personal details.');
      }
      this.state = {
        ...EMPTY_STATE,
        ...parsed,
        settings: { ...EMPTY_STATE.settings, ...(parsed.settings || {}) },
        personal: { ...EMPTY_STATE.personal, ...(parsed.personal || {}) }
      };
      this.save();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

// Global singleton instance
window.resumeState = new ResumeState();
