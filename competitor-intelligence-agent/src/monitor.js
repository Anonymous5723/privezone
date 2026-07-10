/**
 * Competitor analysis: drives Claude with the web-search and web-fetch server
 * tools to research a single competitor, then returns structured findings.
 */

import { getClient, MODEL } from './anthropic-client.js';

const TOOLS = [
  { type: 'web_search_20260209', name: 'web_search', max_uses: 8 },
  { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 8 },
];

const FINDING_CATEGORIES = [
  'new_product',
  'pheromone',
  'attract_and_kill',
  'patent',
  'partnership',
  'other',
];

const SYSTEM_PROMPT = `You are a competitive-intelligence analyst for Suterra, a company specializing in pheromone-based pest control for agriculture (mating disruption, Attract & Kill, semiochemicals).

Your job is to monitor a single competitor and surface concrete, recent developments that matter to Suterra's product and marketing teams. Focus on:
- New products or product lines
- New pheromone / semiochemical formulations or active ingredients
- Attract & Kill products
- Patents and patent applications
- Partnerships, distribution agreements, acquisitions, and regulatory approvals

Prioritise developments from roughly the last 12 months. Ignore generic marketing copy, blog filler, and anything not tied to a specific, verifiable development. Prefer primary sources (the competitor's own site, patent offices, press releases, regulatory registries). Every finding must cite a real URL you actually retrieved.`;

const OUTPUT_INSTRUCTIONS = `When you have finished researching, output ONLY a single fenced JSON code block, with no prose before or after it, in exactly this shape:

\`\`\`json
{
  "findings": [
    {
      "category": "new_product | pheromone | attract_and_kill | patent | partnership | other",
      "title": "short headline",
      "summary": "1-3 sentence factual summary",
      "url": "https://source-you-retrieved",
      "date": "YYYY-MM-DD or approximate period, empty string if unknown",
      "confidence": "high | medium | low"
    }
  ]
}
\`\`\`

If you find nothing noteworthy, return {"findings": []}. Do not invent findings or URLs.`;

const buildPrompt = ({ name, website, notes }, knownSummary) =>
  [
    `Competitor: ${name}`,
    `Primary website: ${website}`,
    notes ? `Context notes: ${notes}` : null,
    '',
    knownSummary
      ? `Products we already track for this competitor (do NOT report these again — only surface developments not on this list):\n${knownSummary}`
      : null,
    '',
    `Research this competitor now. Start from their website, then search the web and patent/regulatory sources for recent developments.`,
    '',
    OUTPUT_INSTRUCTIONS,
  ]
    .filter((line) => line !== null)
    .join('\n');

const collectText = (content) =>
  content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

const extractJson = (text) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return { findings: [] };
  }
};

const normaliseFinding = (finding) => ({
  category: FINDING_CATEGORIES.includes(finding.category) ? finding.category : 'other',
  title: String(finding.title ?? '').trim(),
  summary: String(finding.summary ?? '').trim(),
  url: String(finding.url ?? '').trim(),
  date: String(finding.date ?? '').trim(),
  confidence: ['high', 'medium', 'low'].includes(finding.confidence) ? finding.confidence : 'low',
});

/**
 * Researches one competitor and returns normalised findings.
 * @param {{name: string, website: string, notes?: string}} competitor
 * @param {string} knownSummary - text list of already-tracked products to exclude
 * @returns {Promise<Array<Object>>}
 */
export const analyzeCompetitor = async (competitor, knownSummary = '') => {
  const client = await getClient();
  const messages = [{ role: 'user', content: buildPrompt(competitor, knownSummary) }];

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    tools: TOOLS,
    messages,
  });

  // Server tools run on Anthropic's side; a long research turn can pause and
  // ask to be resumed. Re-send until the model finishes its turn.
  while (response.stop_reason === 'pause_turn') {
    messages.push({ role: 'assistant', content: response.content });
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });
  }

  if (response.stop_reason === 'refusal') {
    return [];
  }

  const parsed = extractJson(collectText(response.content));
  const findings = Array.isArray(parsed.findings) ? parsed.findings : [];
  return findings.map(normaliseFinding).filter((f) => f.title && f.url);
};

/**
 * Offline stub used by --dry-run. Exercises the full pipeline (diff, snapshot,
 * report) without calling the API, returning one clearly-labelled sample finding.
 * @param {{name: string, website: string}} competitor
 * @returns {Promise<Array<Object>>}
 */
export const mockAnalyzeCompetitor = async (competitor) => [
  {
    category: 'new_product',
    title: `[SAMPLE] ${competitor.name} — dry-run placeholder`,
    summary: 'Sample finding generated offline to verify the pipeline. No API call was made and no credits were used.',
    url: `${competitor.website.replace(/\/?$/, '')}#dry-run-sample`,
    date: '',
    confidence: 'low',
  },
];
