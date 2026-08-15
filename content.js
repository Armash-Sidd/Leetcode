/**
 * LeetCode AutoSync AI - Content Script
 * Responsible for DOM observation, Accepted status detection, metadata extraction,
 * Gemini AI explanation generation, and atomic GitHub repository upload.
 */

console.log('LeetCode AutoSync AI Content Script initialized.');

// Bounded memory cache (max 100 entries, FIFO eviction)
const MAX_FINGERPRINTS = 100;
const processedFingerprints = new Set();

// Submission-state machine flags & problem slug tracking
let awaitingSubmissionResult = false;
let activeSubmissionFingerprint = null;
let isSyncingLock = false;
let currentProblemSlug = getTitleSlugFromURL();

/**
 * Add submission fingerprint to processed set with 100-item FIFO cap
 * @param {string} fingerprint
 */
function recordProcessedFingerprint(fingerprint) {
  if (!fingerprint) return;
  if (processedFingerprints.size >= MAX_FINGERPRINTS) {
    const oldest = processedFingerprints.values().next().value;
    if (oldest) {
      processedFingerprints.delete(oldest);
    }
  }
  processedFingerprints.add(fingerprint);
}

/**
 * Reset submission lock and state flags
 * Triggered on real problem navigation
 */
function resetSubmissionState(reason = '') {
  if (activeSubmissionFingerprint || isSyncingLock || awaitingSubmissionResult) {
    console.log(`LeetCode AutoSync: Real navigation detected: resetting state. (${reason})`);
  }
  awaitingSubmissionResult = false;
  activeSubmissionFingerprint = null;
  isSyncingLock = false;
}

/**
 * Real navigation handler comparing problem slug across SPA transitions
 */
function handleRealNavigation() {
  const newSlug = getTitleSlugFromURL();

  if (newSlug !== currentProblemSlug && newSlug !== 'unknown-problem') {
    console.log(`LeetCode AutoSync: Real navigation detected: resetting state. (${currentProblemSlug} -> ${newSlug})`);
    currentProblemSlug = newSlug;
    resetSubmissionState('Problem Navigation');
  } else {
    console.log('LeetCode AutoSync: Ignored React DOM update.');
  }
}

/**
 * Hook History API methods (pushState, replaceState) and popstate window event
 */
function initHistoryHooks() {
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    handleRealNavigation();
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    handleRealNavigation();
    return result;
  };

  window.addEventListener('popstate', handleRealNavigation);
}

/**
 * Dynamically import utility and network modules
 * @returns {Promise<{ utils: Object, github: Object, gemini: Object }>}
 */
async function loadModules() {
  try {
    const [utils, github, gemini] = await Promise.all([
      import(chrome.runtime.getURL('utils.js')),
      import(chrome.runtime.getURL('github.js')),
      import(chrome.runtime.getURL('gemini.js'))
    ]);
    return { utils, github, gemini };
  } catch (err) {
    console.error('LeetCode AutoSync: Failed to load extension modules:', err);
    throw err;
  }
}

/**
 * Initialize MutationObserver and event listeners
 */
async function init() {
  const modules = await loadModules();

  // Initialize history hooks for real SPA navigation detection
  initHistoryHooks();

  // Set awaitingSubmissionResult = true ONLY when user clicks LeetCode Submit button
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    const isSubmitButton =
      target.closest('button[data-e2e-locator="console-submit-button"]') ||
      target.closest('button[class*="submit"]') ||
      (target.tagName === 'BUTTON' && target.textContent && target.textContent.trim().toLowerCase().includes('submit'));

    if (isSubmitButton) {
      console.log('LeetCode AutoSync: Submit button clicked. Awaiting submission result...');
      awaitingSubmissionResult = true;
      activeSubmissionFingerprint = null;
      isSyncingLock = false;
    }
  }, true);

  // Observer watching DOM mutations (without resetting state on DOM mutations)
  const observer = new MutationObserver(() => {
    if (!awaitingSubmissionResult || isSyncingLock) return;

    checkAcceptedSubmission(modules);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Inspect DOM for official "Accepted" submission badge
 * @param {Object} modules - Loaded ES modules ({ utils, github, gemini })
 */
function checkAcceptedSubmission(modules) {
  // CRITICAL: Ignore all DOM elements on page load unless user clicked Submit
  if (!awaitingSubmissionResult) return;
  if (isSyncingLock) return;

  const acceptedElements = findAcceptedElements();
  if (acceptedElements.length === 0) return;

  const { utils } = modules;
  const titleSlug = getTitleSlugFromURL();
  const rawTitleText = getRawTitleFromDOM();
  const { id } = utils.parseProblemTitleAndId(rawTitleText, titleSlug);
  const language = utils.extractLanguageFromDOM(document);
  const code = utils.extractCodeFromMonaco(document);

  if (!code || code.trim().length === 0) return;

  const fingerprint = utils.generateSubmissionFingerprint(id, language, code);

  // Ignore if fingerprint is already active or processed
  if (activeSubmissionFingerprint === fingerprint || processedFingerprints.has(fingerprint)) {
    awaitingSubmissionResult = false;
    return;
  }

  // Lock submission processing & reset awaiting flag
  isSyncingLock = true;
  awaitingSubmissionResult = false;
  activeSubmissionFingerprint = fingerprint;
  recordProcessedFingerprint(fingerprint);

  // Delay briefly to ensure DOM stats are fully settled
  setTimeout(() => {
    processDetectedSubmission(modules, fingerprint, id, rawTitleText, titleSlug, language, code);
  }, 400);
}

/**
 * Search DOM for elements displaying the official "Accepted" submission status
 * @returns {Element[]}
 */
function findAcceptedElements() {
  const matches = [];

  const resultBadges = document.querySelectorAll('[data-e2e-locator="submission-result"]');
  resultBadges.forEach(badge => {
    if (badge.textContent && badge.textContent.trim().toLowerCase().includes('accepted')) {
      matches.push(badge);
    }
  });

  if (matches.length > 0) return matches;

  const textBadges = document.querySelectorAll(
    '.text-sd-success, .text-green-s, .text-cls-success, [class*="result-status-accepted"]'
  );
  textBadges.forEach(badge => {
    if (badge.textContent && badge.textContent.trim().toLowerCase().includes('accepted')) {
      matches.push(badge);
    }
  });

  return matches;
}

/**
 * Process detected submission: generate AI explanation & perform atomic GitHub upload
 * @param {Object} modules
 * @param {string} fingerprint
 * @param {string} id
 * @param {string} rawTitleText
 * @param {string} titleSlug
 * @param {string} language
 * @param {string} code
 */
async function processDetectedSubmission(modules, fingerprint, id, rawTitleText, titleSlug, language, code) {
  const { utils, github, gemini } = modules;

  try {
    const { title } = utils.parseProblemTitleAndId(rawTitleText, titleSlug);
    const difficulty = utils.extractDifficultyFromDOM(document);

    const problemNumber = String(id).replace(/^0+/, '') || '0';
    const folderName = utils.formatPhase4FolderName(id, title);
    const solutionFileName = utils.getSolutionFileName(language);
    const commitMessage = `Add ${problemNumber}. ${title}`;

    console.log(`LeetCode AutoSync AI: Processing single submission event for ${problemNumber}. ${title} [${fingerprint}]`);

    // Read saved configuration from chrome.storage.local
    const {
      githubToken,
      githubRepo,
      geminiKey,
      enableAiSync = true
    } = await chrome.storage.local.get([
      'githubToken',
      'githubRepo',
      'geminiKey',
      'enableAiSync'
    ]);

    if (!githubToken) {
      console.warn('LeetCode AutoSync: GitHub token missing in extension storage.');
      utils.showDetectionToast('GitHub sync failed.');
      return;
    }

    // Code completeness validation helper
    function isCodeComplete(c, lang) {
      if (!c || typeof c !== 'string' || c.trim().length === 0) return false;
      const isJava = lang && lang.toLowerCase().includes('java');
      if (isJava) {
        if (!c.includes('class Solution')) {
          return false;
        }
        const openBraces = (c.match(/\{/g) || []).length;
        const closeBraces = (c.match(/\}/g) || []).length;
        if (openBraces === 0 || openBraces !== closeBraces) {
          return false;
        }
      }
      return true;
    }

    let finalCode = code;
    let isValidCode = isCodeComplete(finalCode, language);

    if (!isValidCode) {
      console.log('Incomplete code extraction. Retrying in 200ms...');
      await new Promise(resolve => setTimeout(resolve, 200));
      finalCode = utils.extractCodeFromMonaco(document);
      isValidCode = isCodeComplete(finalCode, language);
    }

    // Step 1: Generate AI Explanation using Gemini
    let aiExplanation = '';
    if (enableAiSync && geminiKey) {
      if (isValidCode) {
        try {
          aiExplanation = await gemini.generateCodeNotes(geminiKey, title, finalCode, language);
        } catch (err) {
          console.warn('LeetCode AutoSync: Gemini AI generation failed, using fallback:', err);
          aiExplanation = '*(AI explanation unavailable)*';
        }
      } else {
        console.warn('LeetCode AutoSync: Skipping Gemini AI generation due to incomplete code extraction.');
        aiExplanation = '*(AI explanation unavailable)*';
      }
    } else {
      aiExplanation = '*(AI explanation not configured or disabled)*';
    }

    // Step 2: Format README markdown
    const dateSolved = new Date().toISOString().split('T')[0];
    const readmeContent = utils.formatPhase4Readme({
      id: problemNumber,
      title,
      difficulty,
      language,
      dateSolved,
      solutionFileName,
      aiExplanation
    });

    // Log extracted code length before uploading
    console.log(`Extracted code length: ${finalCode ? finalCode.length : 0}`);

    // Step 3: Perform Atomic GitHub Upload
    const result = await github.uploadPhase4Solution({
      token: githubToken,
      configuredRepo: githubRepo,
      folderName,
      solutionFileName,
      solutionCode: finalCode,
      readmeContent,
      commitMessage
    });

    // Step 4: User Feedback & Console Logs
    if (result.status === 'ALREADY_SYNCED') {
      utils.showDetectionToast('Already synced.');
      console.log('LeetCode AutoSync AI: Solution already synced to GitHub.', result.folderUrl);
    } else if (result.status === 'SYNCED') {
      utils.showDetectionToast('Solution synced to GitHub.');
      console.log('LeetCode AutoSync AI - Solution Synced Successfully!');
      console.log('Repository URL:', result.repoUrl);
      console.log('Folder URL:', result.folderUrl);
      console.log('Commit URL:', result.commitUrl);
      console.log('Commit SHA:', result.commitSha);
      if (result.solutionFileUrl) console.log('Solution File URL:', result.solutionFileUrl);
      if (result.readmeFileUrl) console.log('README File URL:', result.readmeFileUrl);
    }
  } catch (err) {
    const errMessage = err?.message || String(err);
    if (errMessage.includes('Extension context invalidated')) {
      console.log('Extension was reloaded. Please reopen the LeetCode tab.');
    } else {
      console.error('LeetCode AutoSync AI Error:', err);
      utils.showDetectionToast('GitHub sync failed.');
    }
  } finally {
    // Release active syncing lock and reset awaiting flag
    isSyncingLock = false;
    awaitingSubmissionResult = false;
  }
}

/**
 * Extract title slug from current window location
 * @returns {string}
 */
function getTitleSlugFromURL() {
  const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : 'unknown-problem';
}

/**
 * Extract raw header text from page DOM
 * @returns {string}
 */
function getRawTitleFromDOM() {
  const titleEl =
    document.querySelector('[data-cy="question-title"]') ||
    document.querySelector('.text-title-large') ||
    document.querySelector('a[href*="/problems/"]') ||
    document.querySelector('div[class*="title"]');

  return titleEl ? titleEl.textContent.trim() : '';
}

// Start observation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
