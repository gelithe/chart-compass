// Chart Compass trial proxy — holds the Anthropic API key server-side so
// testers only need an invitation code. Deploy as a Cloudflare Worker with
// two secrets: ANTHROPIC_API_KEY and TRIAL_CODES (comma-separated codes).

const ALLOWED_ORIGINS = [
  'https://gelithe.github.io',
  'http://localhost:8766'
];

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Trial-Code',
      'Access-Control-Max-Age': '86400'
    };

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: { message: 'Not found' } }, 404, cors);
    if (!allowed) return json({ error: { message: 'Origin not allowed' } }, 403, cors);

    const code = (req.headers.get('X-Trial-Code') || '').trim().toLowerCase();
    const codes = (env.TRIAL_CODES || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!code || !codes.includes(code)) {
      return json({ error: { message: 'Invalid invitation code' } }, 401, cors);
    }

    let body;
    try { body = await req.json(); } catch (e) {
      return json({ error: { message: 'Bad request' } }, 400, cors);
    }

    // Hard limits regardless of what the client sends
    body.model = 'claude-sonnet-4-6';
    body.max_tokens = Math.min(Number(body.max_tokens) || 1500, 8000);
    delete body.stream;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const text = await upstream.text();
    return new Response(text, { status: upstream.status, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
};
