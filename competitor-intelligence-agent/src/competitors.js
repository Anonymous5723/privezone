/**
 * Loads and validates the competitor watchlist from config/competitors.json.
 * Nothing is hardcoded — edit the JSON file to change who is monitored.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(HERE, '..', 'config', 'competitors.json');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidCompetitor = (entry) =>
  entry !== null &&
  typeof entry === 'object' &&
  isNonEmptyString(entry.name) &&
  isNonEmptyString(entry.website);

/**
 * @returns {Promise<Array<{name: string, website: string, notes?: string}>>}
 */
export const loadCompetitors = async () => {
  const raw = await readFile(CONFIG_PATH, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error('config/competitors.json must contain a JSON array');
  }

  const competitors = data.filter(isValidCompetitor);

  if (competitors.length === 0) {
    throw new Error('No valid competitors found in config/competitors.json');
  }

  return competitors;
};
