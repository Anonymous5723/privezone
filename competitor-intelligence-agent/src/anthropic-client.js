/**
 * Anthropic client + model configuration.
 * The API key is read from the ANTHROPIC_API_KEY environment variable
 * (see .env.example) — never hardcode it.
 */

import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and set your key.');
  process.exit(1);
}

// Competitive research can take several minutes per competitor (web search +
// fetch), so allow a generous request timeout.
export const client = new Anthropic({ timeout: 600_000 });

export const MODEL = 'claude-opus-4-8';
