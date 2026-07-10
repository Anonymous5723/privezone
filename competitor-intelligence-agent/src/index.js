#!/usr/bin/env node
/**
 * CLI entry point for the Suterra competitive-intelligence agent.
 *
 * For each competitor in config/competitors.json it:
 *   1. researches recent developments with Claude + web search/fetch,
 *   2. diffs against the previous run to isolate what is new,
 *   3. writes a consolidated Markdown report.
 *
 * Usage: ANTHROPIC_API_KEY=... node src/index.js
 */

import { loadCompetitors } from './competitors.js';
import { analyzeCompetitor } from './monitor.js';
import { loadKnownProducts, summariseKnownProducts } from './known-products.js';
import { loadPreviousFindings, saveFindings, diffFindings } from './store.js';
import { renderReport, writeReport } from './report.js';

const main = async () => {
  const competitors = await loadCompetitors();
  const knownProducts = await loadKnownProducts();
  console.log(`Monitoring ${competitors.length} competitor(s)…\n`);

  const results = [];

  for (const competitor of competitors) {
    process.stdout.write(`• ${competitor.name} … `);
    try {
      const knownSummary = summariseKnownProducts(knownProducts.get(competitor.name) ?? []);
      const current = await analyzeCompetitor(competitor, knownSummary);
      const previous = await loadPreviousFindings(competitor.name);
      const { fresh, total } = diffFindings(previous, current);
      await saveFindings(competitor.name, current);
      results.push({ name: competitor.name, fresh, total });
      console.log(`${fresh.length} new / ${total} total`);
    } catch (error) {
      results.push({ name: competitor.name, error: error.message });
      console.log(`failed (${error.message})`);
    }
  }

  const generatedAt = new Date().toISOString();
  const path = await writeReport(renderReport(results, generatedAt));
  console.log(`\nReport written to ${path}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
