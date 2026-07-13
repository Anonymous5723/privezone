#!/usr/bin/env node
/**
 * CLI entry point for the Suterra competitive-intelligence agent.
 *
 * For each competitor in config/competitors.json it:
 *   1. researches recent developments with Claude + web search/fetch,
 *   2. merges findings into the persistent Competitor Library (per-competitor
 *      dossiers that grow over time),
 *   3. cross-references the product database against Suterra's own products to
 *      flag competitive threats,
 *   4. writes a Markdown report AND a self-contained HTML dashboard.
 *
 * Usage:
 *   node --env-file=.env src/index.js       # real run (needs ANTHROPIC_API_KEY)
 *   node src/index.js --dry-run             # offline, no API calls, no key
 */

import { loadCompetitors } from './competitors.js';
import { analyzeCompetitor, mockAnalyzeCompetitor } from './monitor.js';
import { loadKnownProducts, summariseKnownProducts } from './known-products.js';
import { loadPreviousFindings, saveFindings, diffFindings } from './store.js';
import { updateDossier } from './library.js';
import { computeThreats } from './overlap.js';
import { writeDashboard } from './dashboard.js';
import { renderReport, writeReport } from './report.js';

const main = async () => {
  const dryRun = process.argv.includes('--dry-run');
  const competitors = await loadCompetitors();
  const knownProducts = await loadKnownProducts();
  console.log(
    `Monitoring ${competitors.length} competitor(s)${dryRun ? ' (dry-run — no API calls)' : ''}…\n`,
  );

  // Deterministic threat analysis over the product database (no API needed).
  const allProducts = [...knownProducts.values()].flat();
  const threats = await computeThreats(allProducts);
  const threatsByCompetitor = new Map();
  for (const t of threats) {
    const list = threatsByCompetitor.get(t.competitor) ?? [];
    list.push(t);
    threatsByCompetitor.set(t.competitor, list);
  }

  const results = [];
  const dashboardEntries = [];

  for (const competitor of competitors) {
    process.stdout.write(`• ${competitor.name} … `);
    try {
      const known = knownProducts.get(competitor.name) ?? [];
      const knownSummary = summariseKnownProducts(known);
      const current = dryRun
        ? await mockAnalyzeCompetitor(competitor)
        : await analyzeCompetitor(competitor, knownSummary);

      const previous = await loadPreviousFindings(competitor.name);
      const { fresh, total } = diffFindings(previous, current);
      await saveFindings(competitor.name, current);

      // Accumulate into the persistent library dossier.
      const dossier = await updateDossier(competitor, current);

      results.push({ name: competitor.name, fresh, total });
      dashboardEntries.push({
        competitor: competitor.name,
        website: competitor.website,
        notes: competitor.notes ?? '',
        products: known,
        findings: dossier.findings,
        threats: threatsByCompetitor.get(competitor.name) ?? [],
      });

      const threatCount = (threatsByCompetitor.get(competitor.name) ?? []).length;
      console.log(`${fresh.length} new / ${total} total${threatCount ? ` · ${threatCount} threat(s)` : ''}`);
    } catch (error) {
      results.push({ name: competitor.name, error: error.message });
      console.log(`failed (${error.message})`);
    }
  }

  const generatedAt = new Date().toISOString();
  const reportPath = await writeReport(renderReport(results, generatedAt));
  const dashboardPath = await writeDashboard(dashboardEntries, generatedAt);

  const directCount = threats.filter((t) => t.level === 'direct').length;
  console.log(`\nReport:    ${reportPath}`);
  console.log(`Dashboard: ${dashboardPath}`);
  console.log(`Threats:   ${directCount} direct, ${threats.length - directCount} overlap`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
