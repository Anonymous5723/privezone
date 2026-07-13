/**
 * Loads the baseline of already-tracked competitor products
 * (config/known-products.json, seeded from the team's intelligence spreadsheet)
 * and groups them by competitor name so the analyst can skip what is already known.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const PATH = join(HERE, '..', 'config', 'known-products.json');

/**
 * @returns {Promise<Map<string, Array<Object>>>} competitor name → tracked products
 */
export const loadKnownProducts = async () => {
  const byCompetitor = new Map();
  try {
    const data = JSON.parse(await readFile(PATH, 'utf8'));
    if (!Array.isArray(data)) return byCompetitor;
    for (const product of data) {
      if (!product?.competitor) continue;
      const list = byCompetitor.get(product.competitor) ?? [];
      list.push(product);
      byCompetitor.set(product.competitor, list);
    }
  } catch {
    // No baseline yet — every finding is treated as new.
  }
  return byCompetitor;
};

/**
 * A compact, prompt-friendly summary of the products already on file.
 */
export const summariseKnownProducts = (products) =>
  products.map((p) => `- ${p.product} (${p.country}; ${p.pest || 'n/a'})`).join('\n');
