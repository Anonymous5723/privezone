/**
 * Data access layer.
 * All country data lives in countries.json — nothing is hardcoded here.
 */

const DATA_URL = 'countries.json';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidCountry = (entry) =>
  entry !== null &&
  typeof entry === 'object' &&
  isNonEmptyString(entry.country) &&
  isNonEmptyString(entry.database);

/**
 * Loads and validates the country list.
 * @returns {Promise<Array<Object>>} countries sorted alphabetically by name
 */
export const loadCountries = async () => {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(`Failed to load ${DATA_URL} (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`${DATA_URL} must contain a JSON array`);
  }

  return data
    .filter(isValidCountry)
    .sort((a, b) => a.country.localeCompare(b.country, 'en', { sensitivity: 'base' }));
};
