/**
 * Popup Script (ES Module)
 */
import { validateGithubToken, validateGeminiKey, validateRepoString } from './utils.js';
import { testGithubConnection } from './github.js';
import { testGeminiConnection } from './gemini.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settingsForm');
  const tokenInput = document.getElementById('githubToken');
  const repoInput = document.getElementById('githubRepo');
  const geminiInput = document.getElementById('geminiKey');
  const aiToggle = document.getElementById('enableAiSync');
  const statusMsg = document.getElementById('statusMessage');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const testGithubBtn = document.getElementById('testGithubBtn');
  const testGeminiBtn = document.getElementById('testGeminiBtn');

  const allButtons = [saveBtn, clearBtn, testGithubBtn, testGeminiBtn];

  // Load existing credentials from chrome.storage.local
  try {
    const data = await chrome.storage.local.get([
      'githubToken',
      'githubRepo',
      'geminiKey',
      'enableAiSync'
    ]);

    if (data.githubToken) tokenInput.value = data.githubToken;
    if (data.githubRepo) repoInput.value = data.githubRepo;
    if (data.geminiKey) geminiInput.value = data.geminiKey;
    if (typeof data.enableAiSync === 'boolean') {
      aiToggle.checked = data.enableAiSync;
    }
  } catch (err) {
    console.error('Failed to load settings from storage:', err);
    showStatus('Error loading saved settings.', 'error');
  }

  // Handle Form Submission (Save)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const githubToken = tokenInput.value.trim();
    const githubRepo = repoInput.value.trim();
    const geminiKey = geminiInput.value.trim();
    const enableAiSync = aiToggle.checked;

    // --- LOCAL FORMAT VALIDATION ONLY ---
    if (!validateGithubToken(githubToken)) {
      showStatus('Invalid GitHub token format. Token should start with ghp_ or github_pat_.', 'error');
      tokenInput.focus();
      return;
    }

    if (!validateRepoString(githubRepo)) {
      showStatus('Invalid repository format. Please use "owner/repository".', 'error');
      repoInput.focus();
      return;
    }

    if (geminiKey && !validateGeminiKey(geminiKey)) {
      showStatus('Invalid Gemini API Key format. Key should start with AIzaSy.', 'error');
      geminiInput.focus();
      return;
    }

    // Save to chrome.storage.local
    try {
      await chrome.storage.local.set({
        githubToken,
        githubRepo,
        geminiKey,
        enableAiSync
      });

      showStatus('✓ Settings saved successfully to local storage!', 'success');
    } catch (err) {
      console.error('Failed to save settings to storage:', err);
      showStatus('Failed to save settings: ' + err.message, 'error');
    }
  });

  // Handle Clear Credentials
  clearBtn.addEventListener('click', async () => {
    tokenInput.value = '';
    repoInput.value = '';
    geminiInput.value = '';
    aiToggle.checked = true;

    try {
      await chrome.storage.local.remove([
        'githubToken',
        'githubRepo',
        'geminiKey',
        'enableAiSync'
      ]);
      showStatus('Credentials cleared from storage.', 'success');
    } catch (err) {
      console.error('Failed to clear storage:', err);
      showStatus('Failed to clear settings.', 'error');
    }
  });

  // Handle Test GitHub Connection
  testGithubBtn.addEventListener('click', async () => {
    setLoadingState(testGithubBtn, true, 'Testing GitHub...');
    hideStatus();

    try {
      // Prefer stored token/repo, fallback to current input values
      const stored = await chrome.storage.local.get(['githubToken', 'githubRepo']);
      const token = stored.githubToken || tokenInput.value.trim();
      const repo = stored.githubRepo || repoInput.value.trim();

      if (!token) {
        showStatus('GitHub authentication failed.', 'error');
        return;
      }

      const result = await testGithubConnection(token, repo);
      showStatus(result.message, result.success ? 'success' : 'error');
    } catch (err) {
      console.error('Test GitHub error:', err);
      showStatus('GitHub authentication failed.', 'error');
    } finally {
      setLoadingState(testGithubBtn, false, 'Test GitHub');
    }
  });

  // Handle Test Gemini Connection
  testGeminiBtn.addEventListener('click', async () => {
    setLoadingState(testGeminiBtn, true, 'Testing Gemini...');
    hideStatus();

    try {
      // Prefer stored key, fallback to input value
      const stored = await chrome.storage.local.get(['geminiKey']);
      const key = stored.geminiKey || geminiInput.value.trim();

      if (!key) {
        showStatus('Gemini API key is required.', 'error');
        return;
      }

      const result = await testGeminiConnection(key);
      showStatus(result.message, result.success ? 'success' : 'error');
    } catch (err) {
      console.error('Test Gemini error:', err);
      showStatus('Gemini connection error: ' + err.message, 'error');
    } finally {
      setLoadingState(testGeminiBtn, false, 'Test Gemini');
    }
  });

  /**
   * Toggle button loading state and disable all interactive buttons during async operation
   * @param {HTMLButtonElement} btn
   * @param {boolean} isLoading
   * @param {string} labelText
   */
  function setLoadingState(btn, isLoading, labelText) {
    allButtons.forEach(b => {
      if (b) b.disabled = isLoading;
    });

    if (btn) {
      if (isLoading) {
        btn.innerHTML = `<span class="btn-spinner"></span> ${labelText}`;
      } else {
        btn.innerHTML = `<span class="btn-label">${labelText}</span>`;
      }
    }
  }

  /**
   * Helper function to show status notifications
   * @param {string} msg
   * @param {'success'|'error'} type
   */
  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = `status-msg ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        if (statusMsg.textContent === msg) {
          statusMsg.className = 'status-msg hidden';
        }
      }, 4000);
    }
  }

  /**
   * Hide status message banner
   */
  function hideStatus() {
    statusMsg.textContent = '';
    statusMsg.className = 'status-msg hidden';
  }
});
