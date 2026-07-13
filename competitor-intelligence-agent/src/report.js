/**
 * Renders the consolidated Markdown intelligence report.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(HERE, '..', 'reports');

const CATEGORY_LABELS = {
  new_product: 'New product',
  pheromone: 'Pheromone / semiochemical',
  attract_and_kill: 'Attract & Kill',
  patent: 'Patent',
  partnership: 'Partnership',
  other: 'Other',
};

const renderFinding = (finding) => {
  const label = CATEGORY_LABELS[finding.category] ?? 'Other';
  const date = finding.date ? ` · ${finding.date}` : '';
  return [
    `- **[${label}]** ${finding.title} _(confidence: ${finding.confidence}${date})_`,
    `  ${finding.summary}`,
    `  ${finding.url}`,
  ].join('\n');
};

const renderCompetitor = ({ name, fresh, total, error }) => {
  if (error) {
    return `### ${name}\n\n_Analysis failed: ${error}_\n`;
  }
  if (fresh.length === 0) {
    return `### ${name}\n\n_No new developments since the last run (${total} known)._\n`;
  }
  return `### ${name}\n\n${fresh.map(renderFinding).join('\n\n')}\n`;
};

/**
 * Builds the Markdown report body from per-competitor results.
 */
export const renderReport = (results, generatedAt) => {
  const totalFresh = results.reduce((sum, r) => sum + (r.fresh?.length ?? 0), 0);

  const header = [
    '# Competitive Intelligence Report',
    '',
    `**Generated:** ${generatedAt}`,
    `**Competitors monitored:** ${results.length}`,
    `**New developments this run:** ${totalFresh}`,
    '',
    '> Automated draft produced by the Suterra CI agent. Verify each finding before acting on it.',
    '',
    '---',
    '',
  ].join('\n');

  return `${header}${results.map(renderCompetitor).join('\n---\n\n')}`;
};

/**
 * Writes the report to reports/report-<timestamp>.md and returns its path.
 */
export const writeReport = async (markdown) => {
  await mkdir(REPORTS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = join(REPORTS_DIR, `report-${stamp}.md`);
  await writeFile(path, markdown, 'utf8');
  return path;
};
