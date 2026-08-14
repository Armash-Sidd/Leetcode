/**
 * LeetCode AutoSync - Content Script (Phase 2)
 * Responsible for DOM observation, Accepted status detection, and data extraction.
 */

console.log('LeetCode AutoSync Phase 2 Content Script loaded.');

// Track processed submission hashes to prevent duplicate triggers across React re-renders
const processedSubmissions = new Set();
let isProcessingLock = false;
let currentUrl = window.location.href;

/**
 * Dynamically import utility functions from web-accessible utils.js module
 * @returns {Promise<Object>}
 */
async function loadUtils() {
  try {
    const src = chrome.runtime.getURL('utils.js');
    return await import(src);
  } catch (err) {
    console.error('LeetCode AutoSync: Failed to load utils module:', err);
    throw err;
  }
}

/**
 * Initialize MutationObserver to watch DOM for "Accepted" submission result
 */
async function initMutationObserver() {
  const utils = await loadUtils();

  const observer = new MutationObserver(() => {
    // Check if location changed (SPA navigation)
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      isProcessingLock = false;
    }

    if (isProcessingLock) return;

    checkAcceptedSubmission(utils);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Inspect DOM for official "Accepted" submission badge
 * @param {Object} utils - Loaded utils ES module
 */
function checkAcceptedSubmission(utils) {
  // Selectors for LeetCode submission status element
  const acceptedElements = findAcceptedElements();

  if (acceptedElements.length > 0) {
    isProcessingLock = true;

    // Small delay to allow full DOM render of stats and code editor
    setTimeout(() => {
      processDetectedSubmission(utils);
    }, 500);
  }
}

/**
 * Search DOM for elements displaying the official "Accepted" submission status
 * @returns {Element[]}
 */
function findAcceptedElements() {
  const matches = [];

  // Selector 1: Explicit e2e locator for submission result
  const resultBadges = document.querySelectorAll('[data-e2e-locator="submission-result"]');
  resultBadges.forEach(badge => {
    if (badge.textContent && badge.textContent.trim().toLowerCase().includes('accepted')) {
      matches.push(badge);
    }
  });

  if (matches.length > 0) return matches;

  // Selector 2: Class name selectors on modern LeetCode UI
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
 * Extract problem details, log structured debug object, and display toast
 * @param {Object} utils - Loaded utils ES module
 */
function processDetectedSubmission(utils) {
  try {
    const titleSlug = getTitleSlugFromURL();
    const rawTitleText = getRawTitleFromDOM();
    const { id, title } = utils.parseProblemTitleAndId(rawTitleText, titleSlug);
    const difficulty = utils.extractDifficultyFromDOM(document);
    const language = utils.extractLanguageFromDOM(document);
    const code = utils.extractCodeFromMonaco(document);

    if (!code || code.trim().length === 0) {
      console.warn('LeetCode AutoSync: Solution code is empty, skipping trigger.');
      isProcessingLock = false;
      return;
    }

    // Deduplication check
    const submissionHash = utils.createSubmissionHash(id, title, language, code);
    if (processedSubmissions.has(submissionHash)) {
      isProcessingLock = false;
      return; // Already processed this exact submission
    }

    // Mark as processed
    processedSubmissions.add(submissionHash);

    // --- PHASE 2 REQUIRED DEBUG OUTPUT ---
    const structuredSubmission = {
      id,
      title,
      difficulty,
      language,
      code
    };

    console.log('LeetCode AutoSync: Solution detected!', structuredSubmission);

    // Show temporary confirmation toast notification ("LeetCode solution detected.")
    utils.showDetectionToast('LeetCode solution detected.');

    // Send debug payload to background worker
    chrome.runtime.sendMessage(
      {
        action: 'LEETCODE_SUBMISSION_DETECTED',
        payload: structuredSubmission
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log('LeetCode AutoSync (Debug mode message):', chrome.runtime.lastError.message);
        } else {
          console.log('LeetCode AutoSync: Background acknowledged submission detection.', response);
        }
      }
    );
  } catch (err) {
    console.error('LeetCode AutoSync: Error processing submission detection:', err);
  } finally {
    // Release processing lock after brief delay
    setTimeout(() => {
      isProcessingLock = false;
    }, 2000);
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
  document.addEventListener('DOMContentLoaded', initMutationObserver);
} else {
  initMutationObserver();
}
