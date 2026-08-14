/**
 * Google Gemini API Integration Client (ES Module)
 */

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Generate problem insights and solution analysis using Gemini API.
 * @param {string} apiKey - Gemini API Key
 * @param {string} problemTitle - Title of the problem
 * @param {string} code - Solution source code
 * @param {string} language - Programming language
 * @returns {Promise<string>} Markdown notes output
 */
export async function generateCodeNotes(apiKey, problemTitle, code, language) {
  if (!apiKey || !apiKey.trim()) {
    return '*(Gemini API key not configured — skipping AI insights)*';
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  const prompt = `You are a computer science expert. Analyze this LeetCode solution for "${problemTitle}" written in ${language}.

Provide a concise breakdown in markdown format containing:

## Approach
A brief 2–3 sentence explanation of the solution algorithm.

## Time Complexity
State the Big-O time complexity with a short explanation.

## Space Complexity
State the Big-O space complexity with a short explanation.

## Key Takeaway
Mention one important interview tip or edge case handled by this solution.

Code:
\`\`\`${language}
${code}
\`\`\`

Keep the response clear, structured, and concise.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error?.message || `HTTP ${response.status}`;
      console.warn(`Gemini API Error: ${errorMessage}`);
      return `*(Failed to generate Gemini insights: ${errorMessage})*`;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return candidateText
      ? candidateText.trim()
      : '*(No AI insights returned from Gemini.)*';
  } catch (err) {
    console.error('generateCodeNotes error:', err);
    return `*(Gemini AI request failed: ${err.message})*`;
  }
}

/**
 * Test connection to Google Gemini API.
 * Sends "Reply with exactly OK."
 * @param {string} apiKey
 * @returns {Promise<{success:boolean,message:string}>}
 */
export async function testGeminiConnection(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      message: 'Gemini API key is required.'
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Reply with exactly OK.' }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error?.message || `HTTP ${response.status}`;

      return {
        success: false,
        message: `Gemini connection failed: ${errorMessage}`
      };
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (candidateText.toUpperCase().includes('OK')) {
      return {
        success: true,
        message: 'Gemini connected successfully.'
      };
    }

    return {
      success: false,
      message: `Unexpected response: "${candidateText}"`
    };
  } catch (err) {
    console.error('testGeminiConnection error:', err);
    return {
      success: false,
      message: `Gemini connection error: ${err.message}`
    };
  }
}