/**
 * ATS SCORING ENGINE & KEYWORD OPTIMIZER
 */

const ACTION_VERBS = [
  // Leadership & Direction
  'spearheaded', 'orchestrated', 'championed', 'directed', 'mentored', 'steered', 'mobilized', 'empowered', 'supervised', 'advised',
  // Engineering & Technical
  'architected', 'engineered', 'automated', 'deployed', 'refactored', 'integrated', 'streamlined', 'programmed', 'designed', 'migrated',
  // Growth & Optimization
  'accelerated', 'amplified', 'reduced', 'scaled', 'maximized', 'slashed', 'boosted', 'generated', 'minimized', 'optimized',
  // Execution & Delivery
  'delivered', 'launched', 'executed', 'formulated', 'overhauled', 'implemented', 'built', 'standardized', 'resolved', 'revamped'
];

const ACTION_VERBS_BY_CATEGORY = {
  "Leadership": [
    "Spearheaded", "Orchestrated", "Championed", "Directed", "Mentored", "Steered", "Mobilized", "Empowered"
  ],
  "Engineering & Tech": [
    "Architected", "Engineered", "Automated", "Deployed", "Refactored", "Integrated", "Configured", "Migrated"
  ],
  "Growth & Impact": [
    "Accelerated", "Scaled", "Boosted", "Slashed", "Maximized", "Generated", "Optimized", "Doubled"
  ],
  "Execution & Strategy": [
    "Delivered", "Launched", "Executed", "Formulated", "Overhauled", "Implemented", "Revamped", "Established"
  ]
};

class ATSChecker {
  constructor() {
    this.verbsRegex = new RegExp(`\\b(${ACTION_VERBS.join('|')})\\b`, 'gi');
    this.metricsRegex = /(\d+[%kKmMbB]?|\$\d+[\d,.]*|\b\d+\b|[\d.]+x)/g;
  }

  analyze(state) {
    let score = 0;
    const checks = [];

    // 1. Contact Information Completeness (Max 20 pts)
    const p = state.personal || {};
    let contactScore = 0;
    if (p.name && p.name.trim().length > 2) contactScore += 5;
    if (p.email && /\S+@\S+\.\S+/.test(p.email)) contactScore += 5;
    if (p.phone && p.phone.trim().length > 6) contactScore += 4;
    if (p.location && p.location.trim().length > 3) contactScore += 3;
    if ((p.linkedin && p.linkedin.trim()) || (p.website && p.website.trim()) || (p.github && p.github.trim())) contactScore += 3;

    score += contactScore;
    checks.push({
      category: 'Contact Details',
      score: contactScore,
      max: 20,
      passed: contactScore >= 17,
      message: contactScore >= 17 
        ? 'Full contact profile present for ATS recruiter extraction.' 
        : 'Add phone, professional email, location, and LinkedIn/portfolio.'
    });

    // 2. Professional Summary (Max 15 pts)
    const summaryText = (state.summary || '').trim();
    const summaryWords = summaryText ? summaryText.split(/\s+/).length : 0;
    let summaryScore = 0;
    if (summaryWords >= 25 && summaryWords <= 130) {
      summaryScore = 15;
    } else if (summaryWords > 0) {
      summaryScore = 8;
    }

    score += summaryScore;
    checks.push({
      category: 'Professional Summary',
      score: summaryScore,
      max: 15,
      passed: summaryScore === 15,
      message: summaryScore === 15
        ? `Optimal summary length (${summaryWords} words) providing clear ATS keywords.`
        : summaryWords === 0
          ? 'Add a 2–4 sentence summary highlighting your core title and value proposition.'
          : 'Summary should ideally be 30–100 words with targeted keywords.'
    });

    // 3. Work Experience & Quantifiable Impact (Max 35 pts)
    const exps = state.experience || [];
    let expScore = 0;
    let foundVerbs = new Set();
    let metricsCount = 0;
    let allExperienceText = '';

    exps.forEach(exp => {
      allExperienceText += ` ${exp.role || ''} ${exp.company || ''} ${exp.bullets || ''}`;
    });

    // Check action verbs
    const verbMatches = allExperienceText.match(this.verbsRegex) || [];
    verbMatches.forEach(v => foundVerbs.add(v.toLowerCase()));

    // Check numbers/metrics
    const metricMatches = allExperienceText.match(this.metricsRegex) || [];
    metricsCount = metricMatches.length;

    if (exps.length > 0) expScore += 10;
    // Verb points (up to 15)
    const verbScore = Math.min(15, foundVerbs.size * 3);
    expScore += verbScore;
    // Metric points (up to 10)
    const metricScore = Math.min(10, metricsCount * 2);
    expScore += metricScore;

    score += expScore;
    checks.push({
      category: 'Work Experience & Impact',
      score: expScore,
      max: 35,
      passed: expScore >= 28,
      message: expScore >= 28
        ? `Strong achievement metrics (${metricsCount} numbers) and ${foundVerbs.size} power action verbs found.`
        : `Include more quantified metrics (%, $, revenue, scale) and active verbs (Spearheaded, Architected, Reduced).`
    });

    // 4. Skills & Keyword Indexing (Max 15 pts)
    const skillsList = state.skills || [];
    let skillsScore = 0;
    let totalSkillCount = 0;

    skillsList.forEach(cat => {
      if (cat.items) {
        totalSkillCount += cat.items.split(/[,|•\n]/).filter(s => s.trim().length > 0).length;
      }
    });

    if (totalSkillCount >= 10) {
      skillsScore = 15;
    } else if (totalSkillCount >= 5) {
      skillsScore = 10;
    } else if (totalSkillCount > 0) {
      skillsScore = 5;
    }

    score += skillsScore;
    checks.push({
      category: 'Skills & Keyword Index',
      score: skillsScore,
      max: 15,
      passed: skillsScore >= 12,
      message: skillsScore >= 12
        ? `${totalSkillCount} categorized skills indexed for ATS parsing.`
        : `Add at least 8–12 relevant hard skills and tools relevant to your target role.`
    });

    // 5. Education & Structure (Max 15 pts)
    const edus = state.education || [];
    let eduScore = 0;
    if (edus.length > 0) {
      const first = edus[0];
      if (first.degree && first.school) eduScore = 15;
      else eduScore = 8;
    }

    score += eduScore;
    checks.push({
      category: 'Education Details',
      score: eduScore,
      max: 15,
      passed: eduScore === 15,
      message: eduScore === 15
        ? 'Education entries formatted with clear degree and institution titles.'
        : 'Specify degree level and institution for standard ATS background checks.'
    });

    return {
      score: Math.min(100, Math.max(0, score)),
      checks: checks,
      stats: {
        actionVerbsCount: foundVerbs.size,
        metricsCount: metricsCount,
        skillsCount: totalSkillCount,
        experienceCount: exps.length
      }
    };
  }

  getActionVerbsByCategory() {
    return ACTION_VERBS_BY_CATEGORY;
  }
}

window.atsChecker = new ATSChecker();
