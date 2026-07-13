/**
 * Anthropic client + model configuration.
 * The API key is read from the ANTHROPIC_API_KEY environment variable
 * (see .env.example) — never hardcode it.
 *
 * The SDK is imported dynamically and the client created lazily, so the tool
 * can run in --dry-run mode (no API calls, no dependencies) without a key or
 * an installed SDK.
 */

export const MODEL = 'claude-opus-4-8';

let cached = null;

export const getClient = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and set your key.');
  }
  if (!cached) {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    // Competitive research can take several minutes per competitor
    // (web search + fetch), so allow a generous request timeout.
    cached = new Anthropic({ timeout: 600_000 });
  }
  return cached;
};
