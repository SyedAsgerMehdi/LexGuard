const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

exports.config = {
  runtime: 'nodejs18.x',
};

function buildGeminiUrl(apiKey, modelName) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
}

async function readResponseError(response) {
  const rawText = await response.text();

  try {
    const parsed = rawText ? JSON.parse(rawText) : {};
    return parsed.error?.message || parsed.message || rawText || response.statusText || 'Unknown API error';
  } catch {
    return rawText || response.statusText || 'Unknown API error';
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let requestBody;
  try {
    requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON request body.' });
  }

  const clientSuppliedKey = requestBody?.apiKey;
  const effectiveApiKey = clientSuppliedKey || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY.',
      code: 'MISSING_GEMINI_API_KEY'
    });
  }

  if (requestBody && typeof requestBody === 'object') {
    delete requestBody.apiKey;
  }

  let lastError = '';

  for (const modelName of GEMINI_MODELS) {
    let response;

    try {
      response = await fetch(buildGeminiUrl(effectiveApiKey, modelName), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (networkError) {
      return res.status(502).json({
        error: `Network error while calling Gemini (${modelName}): ${networkError.message}`,
        code: 'GEMINI_NETWORK_ERROR'
      });
    }

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    const errorMessage = await readResponseError(response);
    lastError = `(${modelName}) ${errorMessage}`;

    if (response.status === 401 || response.status === 403) {
      return res.status(401).json({
        error: errorMessage,
        code: 'GEMINI_KEY_REJECTED'
      });
    }

    if (![400, 401, 403, 404, 429].includes(response.status)) {
      break;
    }
  }

  return res.status(500).json({
    error: lastError || 'Gemini API request failed.',
    code: 'GEMINI_REQUEST_FAILED'
  });
}
