# Trial proxy (Cloudflare Worker)

Holds the Anthropic API key so trial users only need an invitation code.

## Deploy

```sh
cd proxy
npx wrangler login                 # one-time browser authorization
npx wrangler secret put ANTHROPIC_API_KEY   # paste the capped trial key
npx wrangler secret put TRIAL_CODES         # e.g. sage2026,pivot,cohort1
npx wrangler deploy
```

The deploy prints the worker URL (https://chart-compass-proxy.<account>.workers.dev).
Set that URL as PROXY_URL in ../index.html and the key step becomes a code step.

Controls: origin allowlist (this site only), model pinned, max_tokens capped,
codes revocable by updating the TRIAL_CODES secret. Budget ceiling lives in
the Anthropic console as the key's monthly spend limit.
