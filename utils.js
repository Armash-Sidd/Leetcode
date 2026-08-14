/**
 * Local format validation utilities
 */

/**
 * Perform basic local format validation on a GitHub Personal Access Token.
 * Does NOT perform network validation.
 * @param {string} token
 * @returns {boolean}
 */
export function validateGithubToken(token) {
  if (!token || typeof token !== 'string') return false;
  const trimmed = token.trim();
  if (trimmed.length === 0) return false;
  const githubPatRegex = /^(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,82}|gho_[a-zA-Z0-9]{36}|[a-zA-Z0-9_]{30,60})$/;
  return githubPatRegex.test(trimmed);
}

/**
 * Perform basic local format validation on a Gemini API Key.
 * Does NOT perform network validation.
 * @param {string} key
 * @returns {boolean}
 */
export function validateGeminiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.length === 0) return false;
  const geminiKeyRegex = /^(AIzaSy[a-zA-Z0-9_-]{33}|[a-zA-Z0-9_-]{20,60})$/;
  return geminiKeyRegex.test(trimmed);
}

/**
 * Validate GitHub target repository format (owner/repo).
 * @param {string} repo
 * @returns {boolean}
 */
export function validateRepoString(repo) {
  if (!repo || typeof repo !== 'string') return false;
  const trimmed = repo.trim();
  const repoRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
  return repoRegex.test(trimmed);
}

/**
 * Extension map for supported programming languages.
 */
const LANGUAGE_EXTENSIONS = {
  javascript: 'js',
  js: 'js',
  typescript: 'ts',
  ts: 'ts',
  python: 'py',
  python3: 'py',
  py: 'py',
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  java: 'java',
  csharp: 'cs',
  'c#': 'cs',
  golang: 'go',
  go: 'go',
  ruby: 'rb',
  swift: 'swift',
  kotlin: 'kt',
  rust: 'rs',
  php: 'php',
  sql: 'sql',
  scala: 'scala'
};

/**
 * Map language name to file extension.
 * @param {string} language
 * @returns {string}
 */
export function getLanguageExtension(language) {
  if (!language) return 'txt';
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_EXTENSIONS[normalized] || 'txt';
}

/**
 * Format relative GitHub storage file path for a problem submission.
 * @param {string} titleSlug
 * @param {string} language
 * @returns {string}
 */
export function formatProblemPath(titleSlug, language) {
  const cleanSlug = (titleSlug || 'unknown-problem').toLowerCase().trim();
  const ext = getLanguageExtension(language);
  return `${cleanSlug}/${cleanSlug}.${ext}`;
}

/**
 * Format relative GitHub storage path for a problem README.
 * @param {string} titleSlug
 * @returns {string}
 */
export function formatReadmePath(titleSlug) {
  const cleanSlug = (titleSlug || 'unknown-problem').toLowerCase().trim();
  return `${cleanSlug}/README.md`;
}

/**
 * Format Markdown documentation for problem README.
 * @param {Object} details
 * @returns {string}
 */
export function formatMarkdownReadme({
  title = 'LeetCode Problem',
  titleSlug = '',
  difficulty = 'Easy',
  description = '',
  language = 'JavaScript',
  runtime = 'N/A',
  memory = 'N/A',
  code = '',
  geminiNotes = ''
}) {
  const problemUrl = titleSlug ? `https://leetcode.com/problems/${titleSlug}/` : 'https://leetcode.com';
  const ext = getLanguageExtension(language);

  let markdown = `# [${title}](${problemUrl})\n\n`;
  markdown += `**Difficulty:** \`${difficulty}\`  \n`;
  markdown += `**Language:** \`${language}\`  \n`;
  markdown += `**Runtime:** \`${runtime}\`  \n`;
  markdown += `**Memory:** \`${memory}\`  \n\n`;

  if (description) {
    markdown += `## Problem Description\n\n${description}\n\n`;
  }

  if (geminiNotes) {
    markdown += `## 🤖 Gemini AI Insights\n\n${geminiNotes}\n\n`;
  }

  markdown += `## Solution Code\n\n\`\`\`${ext}\n${code}\n\`\`\`\n`;

  return markdown;
}

/* ==========================================================================
   Phase 2 Extraction & Detection Utility Helpers
   ========================================================================== */

/**
 * Extract problem numerical ID and title from raw header text or title slug.
 * Example input: "347. Top K Frequent Elements", slug: "top-k-frequent-elements"
 * Output: { id: "347", title: "Top K Frequent Elements" }
 * @param {string} rawTitleText
 * @param {string} titleSlug
 * @returns {{ id: string, title: string }}
 */
export function parseProblemTitleAndId(rawTitleText, titleSlug = '') {
  let id = '';
  let title = '';

  if (rawTitleText && typeof rawTitleText === 'string') {
    const cleanText = rawTitleText.trim();
    // Pattern: "347. Top K Frequent Elements" or "347-Top K Frequent Elements"
    const match = cleanText.match(/^(\d+)[\.\s-]+(.+)/);
    if (match) {
      id = match[1].trim();
      title = match[2].trim();
    } else {
      title = cleanText;
    }
  }

  // Fallback: extract ID from URL slug or document if ID is missing
  if (!id && titleSlug) {
    const slugNumberMatch = titleSlug.match(/^(\d+)-/);
    if (slugNumberMatch) {
      id = slugNumberMatch[1];
    }
  }

  // Fallback for title if missing
  if (!title) {
    if (titleSlug) {
      title = titleSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      title = 'LeetCode Problem';
    }
  }

  return { id: id || '0', title };
}

/**
 * Extract problem difficulty from page DOM.
 * @param {Document} doc
 * @returns {'Easy'|'Medium'|'Hard'}
 */
export function extractDifficultyFromDOM(doc = document) {
  // Common LeetCode difficulty badge selectors
  const selectors = [
    '.text-sd-easy, .text-sd-medium, .text-sd-hard',
    '[class*="text-difficulty-"]',
    '[data-cy="question-title"] + span',
    'div[class*="difficulty"]'
  ];

  for (const selector of selectors) {
    const el = doc.querySelector(selector);
    if (el && el.textContent) {
      const text = el.textContent.trim().toLowerCase();
      if (text.includes('easy')) return 'Easy';
      if (text.includes('medium')) return 'Medium';
      if (text.includes('hard')) return 'Hard';
    }
  }

  // Fallback search across span elements
  const spans = doc.querySelectorAll('span, div');
  for (const span of spans) {
    const text = span.textContent ? span.textContent.trim().toLowerCase() : '';
    if (text === 'easy') return 'Easy';
    if (text === 'medium') return 'Medium';
    if (text === 'hard') return 'Hard';
  }

  return 'Easy'; // Default fallback
}

/**
 * Extract programming language selected in LeetCode code editor.
 * Focuses on Java initially, with fallbacks for common languages.
 * @param {Document} doc
 * @returns {string}
 */
export function extractLanguageFromDOM(doc = document) {
  // Selector for language selection dropdown button
  const langSelectors = [
    'button[id*="lang"]',
    'div[id*="lang"]',
    '[data-cy="lang-select"]',
    'button[aria-haspopup="dialog"]',
    'div[class*="language-select"] button'
  ];

  for (const selector of langSelectors) {
    const el = doc.querySelector(selector);
    if (el && el.textContent) {
      const text = el.textContent.trim();
      if (text.length > 0 && text.length < 20) {
        return text;
      }
    }
  }

  // Fallback check for active tab text in editor
  const langButtons = doc.querySelectorAll('button');
  for (const btn of langButtons) {
    const text = btn.textContent ? btn.textContent.trim() : '';
    if (['Java', 'C++', 'Python', 'Python3', 'JavaScript', 'TypeScript', 'C#', 'Go', 'Rust'].includes(text)) {
      return text;
    }
  }

  return 'Java'; // Initial target requirement default
}

/**
 * Extract submitted code from Monaco Editor in LeetCode DOM.
 * @param {Document} doc
 * @returns {string}
 */
export function extractCodeFromMonaco(doc = document) {
  // Primary selector: Monaco editor line elements
  const lines = doc.querySelectorAll('.monaco-editor .view-lines .view-line');
  if (lines && lines.length > 0) {
    const codeLines = Array.from(lines).map(line => line.textContent || '');
    return codeLines.join('\n');
  }

  // Secondary selector: CodeMirror or textarea
  const textarea = doc.querySelector('textarea.inputarea, .CodeMirror-code');
  if (textarea && textarea.value) {
    return textarea.value;
  }

  return '';
}

/**
 * Generate deduplication hash for submission event to prevent duplicate triggers.
 * @param {string} id
 * @param {string} title
 * @param {string} language
 * @param {string} code
 * @returns {string}
 */
export function createSubmissionHash(id, title, language, code) {
  const codeSnippet = (code || '').slice(0, 100);
  return `${id}:${title}:${language}:${codeSnippet.length}:${codeSnippet}`;
}

/**
 * Inject floating UI confirmation toast notification into current page DOM.
 * Toast displays: "LeetCode solution detected."
 * Auto-removes after 3 seconds.
 * @param {string} message
 */
export function showDetectionToast(message = 'LeetCode solution detected.') {
  // Remove existing toast if present
  const existingToast = document.getElementById('leetcode-autosync-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'leetcode-autosync-toast';
  toast.textContent = message;

  // Modern floating toast styles
  Object.assign(toast.style, {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: '999999',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #6366f1',
    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: '0',
    transform: 'translateY(-12px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none'
  });

  // Green check icon SVG prefix
  const icon = document.createElement('span');
  icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  toast.prepend(icon);

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
