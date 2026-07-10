/**
 * Snapshot storage + diffing.
 * Each run saves per-competitor findings so the next run can flag what is NEW.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, '..', 'data');

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const snapshotPath = (name) => join(DATA_DIR, `${slugify(name)}.json`);

// A finding is identified by its source URL, falling back to its title.
const fingerprint = (finding) => (finding.url || finding.title).toLowerCase().trim();

export const loadPreviousFindings = async (name) => {
  try {
    const raw = await readFile(snapshotPath(name), 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data.findings) ? data.findings : [];
  } catch {
    return [];
  }
};

export const saveFindings = async (name, findings) => {
  await mkdir(DATA_DIR, { recursive: true });
  const payload = { competitor: name, updatedAt: new Date().toISOString(), findings };
  await writeFile(snapshotPath(name), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
};

/**
 * Splits current findings into brand-new ones (not seen last run) and the rest.
 */
export const diffFindings = (previous, current) => {
  const seen = new Set(previous.map(fingerprint));
  const fresh = current.filter((finding) => !seen.has(fingerprint(finding)));
  return { fresh, total: current.length };
};
