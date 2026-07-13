/**
 * Search logic — instant, accent-insensitive country filtering.
 */

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Filters countries by name (matches also on language as a convenience).
 * An empty query returns the full list.
 * @param {Array<Object>} countries
 * @param {string} query
 * @returns {Array<Object>}
 */
export const filterCountries = (countries, query) => {
  const needle = normalize(query);

  if (needle === '') {
    return countries;
  }

  return countries.filter(
    ({ country, language = '' }) =>
      normalize(country).includes(needle) || normalize(language).startsWith(needle)
  );
};
