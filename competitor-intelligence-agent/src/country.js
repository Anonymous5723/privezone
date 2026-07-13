/**
 * Country detection / normalisation.
 * Turns spreadsheet values like "ES - Spain" or "US - USA Federal" into a
 * clean folder name like "SPAIN" / "USA".
 */

const CLEANUP = /\b(federal|republic of|the)\b/gi;

export const normaliseCountry = (value) => {
  const raw = (value || '').trim();
  if (!raw) return 'UNKNOWN';
  // Prefer the descriptive part after the dash ("ES - Spain" → "Spain").
  const parts = raw.split('-');
  const name = (parts.length > 1 ? parts.slice(1).join('-') : parts[0]).trim();
  return name.replace(CLEANUP, '').replace(/\s+/g, ' ').trim().toUpperCase() || raw.toUpperCase();
};
