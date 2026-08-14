/**
 * Service Worker (ES Module)
 */
import { getRepoFile, commitFile } from './github.js';
import { generateCodeNotes } from './gemini.js';
import { formatProblemPath, formatReadmePath, formatMarkdownReadme } from './utils.js';

// Extension lifecycle setup
chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode AutoSync extension installed successfully.');
});

// Listener for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'LEETCODE_SUBMISSION_DETECTED') {
    console.log('Phase 2 Debug - Detected LeetCode submission:', message.payload);
    sendResponse({ success: true, mode: 'DEBUG_PHASE_2' });
    return true;
  }

  if (message.action === 'LEETCODE_SUBMISSION_SUCCESS') {
    handleSubmission(message.payload)
      .then((res) => sendResponse({ success: true, result: res }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    
    return true; // Keep message channel open for async response
  }

  if (message.action === 'GET_SYNC_STATUS') {
    chrome.storage.local.get(['lastSyncStatus', 'lastSyncTime'])
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    
    return true;
  }
});

/**
 * Coordinate solution sync to GitHub with Gemini AI insights
 * @param {Object} payload
 */
async function handleSubmission(payload) {
  const { title, titleSlug, difficulty, description, language, runtime, memory, code } = payload;

  console.log(`Processing submission for problem: ${title} (${language})`);

  // Retrieve user settings
  const { githubToken, githubRepo, geminiKey, enableAiSync = true } =
    await chrome.storage.local.get([
      'githubToken',
      'githubRepo',
      'geminiKey',
      'enableAiSync'
    ]);

  if (!githubToken || !githubRepo) {
    await updateBadge('ERR', '#ef4444');
    throw new Error('GitHub token or repository is not configured in extension popup.');
  }

  await updateBadge('...', '#6366f1');

  // Generate Gemini AI Insights if enabled
  let geminiNotes = '';
  if (enableAiSync && geminiKey) {
    try {
      geminiNotes = await generateCodeNotes(geminiKey, title, code, language);
    } catch (err) {
      console.warn('Gemini generation warning:', err);
      geminiNotes = '*(AI insights generation failed)*';
    }
  }

  // Format problem solution path and README path
  const codeFilePath = formatProblemPath(titleSlug, language);
  const readmeFilePath = formatReadmePath(titleSlug);

  // Format README markdown text
  const readmeContent = formatMarkdownReadme({
    title,
    titleSlug,
    difficulty,
    description,
    language,
    runtime,
    memory,
    code,
    geminiNotes
  });

  const commitMsgCode = `Add LeetCode solution: ${title} [${difficulty}] (${language})`;
  const commitMsgReadme = `Add LeetCode problem README: ${title}`;

  // 1. Commit Code Solution File
  let existingCodeFile = null;
  try {
    existingCodeFile = await getRepoFile(githubToken, githubRepo, codeFilePath);
  } catch (e) {
    console.log('Code file check error (may be new file):', e.message);
  }

  const codeCommitResult = await commitFile(
    githubToken,
    githubRepo,
    codeFilePath,
    commitMsgCode,
    code,
    existingCodeFile?.sha || null
  );

  // 2. Commit Problem README.md File
  let existingReadmeFile = null;
  try {
    existingReadmeFile = await getRepoFile(githubToken, githubRepo, readmeFilePath);
  } catch (e) {
    console.log('README file check error (may be new file):', e.message);
  }

  const readmeCommitResult = await commitFile(
    githubToken,
    githubRepo,
    readmeFilePath,
    commitMsgReadme,
    readmeContent,
    existingReadmeFile?.sha || null
  );

  const syncTime = new Date().toISOString();
  const statusDetails = {
    problem: title,
    syncedAt: syncTime,
    codeUrl: codeCommitResult?.content?.html_url || '',
    readmeUrl: readmeCommitResult?.content?.html_url || ''
  };

  await chrome.storage.local.set({
    lastSyncStatus: 'SUCCESS',
    lastSyncTime: syncTime,
    lastSyncDetails: statusDetails
  });

  await updateBadge('✓', '#10b981');
  setTimeout(() => updateBadge('', '#000000'), 5000);

  return statusDetails;
}

/**
 * Helper to update action badge
 * @param {string} text
 * @param {string} color
 */
async function updateBadge(text, color) {
  try {
    await chrome.action.setBadgeText({ text });
    if (color) {
      await chrome.action.setBadgeBackgroundColor({ color });
    }
  } catch (err) {
    console.error('Badge update error:', err);
  }
}
