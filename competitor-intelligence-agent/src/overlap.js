/**
 * Threat analysis: cross-references competitor products against Suterra's own
 * products to flag overlaps. A shared target pest is a competitive overlap;
 * a shared pest AND country is a direct threat in that market.
 *
 * This is fully deterministic — it runs on the product databases, no API calls.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SUTERRA_PATH = join(HERE, '..', 'config', 'suterra-products.json');

const norm = (value) => (value || '').toLowerCase().trim();

// Pest cells can list several scientific names on separate lines.
const pests = (value) =>
  norm(value)
    .split(/[\n;/]+/)
    .map((p) => p.trim())
    .filter(Boolean);

// "IT - Italy" / "ES - Spain" → the code before the dash, else the whole string.
const countryKey = (value) => norm(value).split('-')[0].trim() || norm(value);

const loadSuterraProducts = async () => {
  try {
    const data = JSON.parse(await readFile(SUTERRA_PATH, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

/**
 * @returns {Promise<Array<{competitor,product,pest,country,against,level}>>}
 * level is 'direct' (same pest + country) or 'overlap' (same pest only).
 */
export const computeThreats = async (competitorProducts) => {
  const suterra = await loadSuterraProducts();
  const threats = [];

  for (const cp of competitorProducts) {
    const cpPests = new Set(pests(cp.pest));
    if (cpPests.size === 0) continue;
    const cpCountry = countryKey(cp.country);

    for (const sp of suterra) {
      const shared = pests(sp.pest).filter((p) => cpPests.has(p));
      if (shared.length === 0) continue;

      const sameCountry = cpCountry && countryKey(sp.country) === cpCountry;
      threats.push({
        competitor: cp.competitor,
        product: cp.product,
        pest: shared.join(', '),
        country: cp.country,
        against: sp.product,
        againstCountry: sp.country,
        level: sameCountry ? 'direct' : 'overlap',
      });
    }
  }

  // Direct threats first.
  threats.sort((a, b) => (a.level === b.level ? 0 : a.level === 'direct' ? -1 : 1));
  return threats;
};
