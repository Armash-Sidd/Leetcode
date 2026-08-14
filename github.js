/**
 * GitHub API REST Client (ES Module)
 */

/**
 * Base64 encode string with full UTF-8 support.
 * @param {string} str
 * @returns {string}
 */
function utf8ToBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Fetch existing file metadata from GitHub repository contents API.
 * @param {string} token - GitHub Personal Access Token
 * @param {string} repo - Repository in "owner/repo" format
 * @param {string} path - Target file path in repo
 * @returns {Promise<{ sha: string, content: string } | null>}
 */
export async function getRepoFile(token, repo, path) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      sha: data.sha,
      content: data.content
    };
  } catch (err) {
    console.error('getRepoFile error:', err);
    throw err;
  }
}

/**
 * Create or update a file in the target GitHub repository.
 * @param {string} token - GitHub Personal Access Token
 * @param {string} repo - Repository in "owner/repo" format
 * @param {string} path - Target file path in repo
 * @param {string} message - Commit message
 * @param {string} content - Raw text content of the file
 * @param {string|null} sha - File SHA if updating existing file
 * @returns {Promise<Object>}
 */
export async function commitFile(token, repo, path, message, content, sha = null) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const encodedContent = utf8ToBase64(content);

  const payload = {
    message,
    content: encodedContent
  };

  if (sha) {
    payload.sha = sha;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub Commit Error (${response.status}): ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('commitFile error:', err);
    throw err;
  }
}

/**
 * Test GitHub token authentication and repository access.
 * 1. Calls GET https://api.github.com/user to retrieve authenticated username.
 * 2. Calls GET https://api.github.com/repos/{username}/LeetCode (or targetRepo) to verify access.
 * @param {string} token - GitHub Access Token
 * @param {string|null} targetRepo - Optional configured repository ("owner/repo" or "repo")
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function testGithubConnection(token, targetRepo = null) {
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, message: 'GitHub authentication failed.' };
  }

  const cleanToken = token.trim();

  try {
    // Step 1: Fetch authenticated user
    const userResponse = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      return { success: false, message: 'GitHub authentication failed.' };
    }

    const userData = await userResponse.json();
    const username = userData?.login;

    if (!username) {
      return { success: false, message: 'GitHub authentication failed.' };
    }

    // Step 2: Determine repository full path
    let fullRepoPath = `${username}/LeetCode`;
    if (targetRepo && typeof targetRepo === 'string' && targetRepo.trim()) {
      const cleanRepo = targetRepo.trim();
      fullRepoPath = cleanRepo.includes('/') ? cleanRepo : `${username}/${cleanRepo}`;
    }

    // Step 3: Check repository access
    const repoResponse = await fetch(`https://api.github.com/repos/${fullRepoPath}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (repoResponse.ok) {
      return { success: true, message: 'GitHub connected successfully.' };
    } else {
      return { success: false, message: 'GitHub authentication failed.' };
    }
  } catch (err) {
    console.error('testGithubConnection error:', err);
    return { success: false, message: 'GitHub authentication failed.' };
  }
}

