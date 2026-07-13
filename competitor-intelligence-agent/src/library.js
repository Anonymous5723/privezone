/**
 * Competitor Library — a persistent, growing knowledge base.
 *
 * Unlike the one-off report, the library accumulates every finding into a
 * per-competitor dossier under library/data/, building institutional memory:
 * each run merges new findings (deduplicated) and records when each was first
 * seen. The dossiers feed the HTML dashboard.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB_DIR = join(HERE, '..', 'library', 'data');

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const dossierPath = (name) => join(LIB_DIR, `${slugify(name)}.json`);

const fingerprint = (finding) => (finding.url || finding.title).toLowerCase().trim();

const loadDossier = async (name) => {
  try {
    return JSON.parse(await readFile(dossierPath(name), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * Merges this run's findings into the competitor's dossier and persists it.
 * @returns {Promise<Object>} the updated dossier
 */
export const updateDossier = async (competitor, findings) => {
  await mkdir(LIB_DIR, { recursive: true });
  const now = new Date().toISOString();

  const existing = (await loadDossier(competitor.name)) ?? {
    competitor: competitor.name,
    website: competitor.website,
    notes: competitor.notes ?? '',
    findings: [],
  };

  const seen = new Set(existing.findings.map(fingerprint));
  for (const finding of findings) {
    if (seen.has(fingerprint(finding))) continue;
    existing.findings.push({ ...finding, firstSeen: now });
    seen.add(fingerprint(finding));
  }

  existing.website = competitor.website;
  existing.notes = competitor.notes ?? '';
  existing.updatedAt = now;

  await writeFile(dossierPath(competitor.name), `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
  return existing;
};
