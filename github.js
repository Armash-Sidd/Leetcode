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

/**
 * Fetch authenticated GitHub username (GET /user).
 * @param {string} token
 * @returns {Promise<string|null>}
 */
export async function getAuthenticatedUsername(token) {
  if (!token) return null;
  try {
    const res = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.login || null;
  } catch (err) {
    console.error('getAuthenticatedUsername error:', err);
    return null;
  }
}

/**
 * Atomic and idempotent upload of LeetCode solution and AI README to GitHub.
 * 1. Checks if Solution.{ext} and README.md already exist.
 * 2. Uploads Solution.{ext} first.
 * 3. Uploads README.md second (with retry mechanism and SHA lookup if needed).
 * 4. Returns rich debugging metadata (commitSha, file URLs, folder/repo URLs).
 * 
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export async function uploadPhase4Solution({
  token,
  configuredRepo,
  folderName,
  solutionFileName,
  solutionCode,
  readmeContent,
  commitMessage
}) {
  if (!token || !token.trim()) {
    throw new Error('GitHub access token is required.');
  }

  const cleanToken = token.trim();

  // Determine repository owner/name
  let repoPath = '';
  if (configuredRepo && configuredRepo.trim()) {
    const cleanRepo = configuredRepo.trim();
    if (cleanRepo.includes('/')) {
      repoPath = cleanRepo;
    } else {
      const username = await getAuthenticatedUsername(cleanToken);
      if (!username) throw new Error('Failed to retrieve GitHub username.');
      repoPath = `${username}/${cleanRepo}`;
    }
  } else {
    const username = await getAuthenticatedUsername(cleanToken);
    if (!username) throw new Error('Failed to retrieve GitHub username.');
    repoPath = `${username}/LeetCode`;
  }

  const solutionFilePath = `${folderName}/${solutionFileName}`;
  const readmeFilePath = `${folderName}/README.md`;

  // Step 1: Deduplication Check
  const solutionFile = await getRepoFile(cleanToken, repoPath, solutionFilePath);
  const readmeFile = await getRepoFile(cleanToken, repoPath, readmeFilePath);

  if (solutionFile && readmeFile) {
    return {
      status: 'ALREADY_SYNCED',
      message: 'Already synced.',
      repoUrl: `https://github.com/${repoPath}`,
      folderUrl: `https://github.com/${repoPath}/tree/main/${folderName}`
    };
  }

  // Step 2: Atomic Upload - Upload Solution.{ext} FIRST
  const solutionCommitResult = await commitFile(
    cleanToken,
    repoPath,
    solutionFilePath,
    commitMessage,
    solutionCode,
    solutionFile?.sha || null
  );

  const commitSha =
    solutionCommitResult?.commit?.sha ||
    solutionCommitResult?.content?.sha ||
    '';

  const solutionFileUrl =
    solutionCommitResult?.content?.html_url ||
    `https://github.com/${repoPath}/blob/main/${solutionFilePath}`;

  // Step 3: Upload README.md SECOND (with retry)
  let readmeCommitResult = null;
  try {
    readmeCommitResult = await commitFile(
      cleanToken,
      repoPath,
      readmeFilePath,
      commitMessage,
      readmeContent,
      readmeFile?.sha || null
    );
  } catch (firstErr) {
    console.warn('README upload failed on first attempt, retrying once...', firstErr);
    // Retry ONCE after 1 second
    await new Promise(r => setTimeout(r, 1000));
    try {
      // Re-check existing file SHA to guarantee idempotency
      const currentReadmeState = await getRepoFile(cleanToken, repoPath, readmeFilePath);
      readmeCommitResult = await commitFile(
        cleanToken,
        repoPath,
        readmeFilePath,
        commitMessage,
        readmeContent,
        currentReadmeState?.sha || null
      );
    } catch (retryErr) {
      console.error('README upload retry failed:', retryErr);
      throw new Error(`Failed to upload README.md: ${retryErr.message}`);
    }
  }

  const readmeFileUrl =
    readmeCommitResult?.content?.html_url ||
    `https://github.com/${repoPath}/blob/main/${readmeFilePath}`;

  const repoUrl = `https://github.com/${repoPath}`;
  const folderUrl = `https://github.com/${repoPath}/tree/main/${folderName}`;
  const commitUrl = commitSha
    ? `https://github.com/${repoPath}/commit/${commitSha}`
    : repoUrl;

  return {
    status: 'SYNCED',
    message: 'Solution synced to GitHub.',
    repoUrl,
    folderUrl,
    commitUrl,
    commitSha,
    solutionFileUrl,
    readmeFileUrl
  };
}


