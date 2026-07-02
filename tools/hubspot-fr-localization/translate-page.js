#!/usr/bin/env node
/**
 * Localisation FR d'une page CMS HubSpot (espagnol -> francais) via l'API Claude.
 *
 * Ce que fait le script, pour UNE page :
 *   1. Recupere la page via l'API CMS Pages de HubSpot.
 *   2. Repere chaque bloc de contenu Rich Text (champs `html`) + les champs SEO.
 *   3. Traduit chaque bloc avec Claude, en appliquant la charte de localisation.
 *   4. Ecrit la page traduite en BROUILLON (draft) sur HubSpot, ou en local (--dry-run).
 *
 * Voir README.md pour l'installation et l'usage.
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Charte de localisation (system prompt Claude) — reprend tes consignes.
// ---------------------------------------------------------------------------
const CHARTE = `Tu es un traducteur professionnel specialise dans la localisation
espagnol -> francais pour le marche agricole francais (CMS HubSpot / Flowable).

REGLES ABSOLUES :
- Traduis TOUT le texte espagnol en francais. Ne resume jamais, ne supprime jamais de contenu.
- Conserve EXACTEMENT la structure HTML : balises, attributs, classes, ids, liens (href),
  listes, titres, paragraphes, gras (<strong>/<b>), italiques (<em>/<i>), boutons.
- Ne modifie JAMAIS le balisage HTML ni les URLs. Traduis uniquement le texte visible
  et les attributs textuels destines a l'utilisateur (alt, title, aria-label, placeholder).
- Conserve les noms scientifiques en italique et NON traduits (ex. Drosophila suzukii,
  Lobesia botrana).
- Ne traduis JAMAIS les marques et noms de produits :
  Suterra(R), BioMagnet(R), CheckMate(R), Puffer(R), Celada(TM), Subvert(R), Depur(R),
  "Suterra 360", ainsi que tous les noms scientifiques.
- Emploie un francais professionnel destine au marche francais.

TERMINOLOGIE AGRICOLE (a appliquer naturellement, ne pas forcer si le contexte differe) :
- Monitoreo -> Suivi
- Control de plagas -> Lutte contre les ravageurs
- Mosca de las alas manchadas -> Mouche aux ailes tachetees
- Polilla del racimo -> Ver de la grappe
- Cultivos -> Cultures
- Trampa -> Piege
- Feromona -> Pheromone
- Distribucion geografica -> Repartition geographique
- Sintomas y danos -> Symptomes et degats
- Ciclo biologico -> Cycle biologique
- Productos -> Produits
- Preguntas frecuentes -> Questions frequentes
- Contactanos -> Contactez-nous
- Responsable legal -> Responsable legal

SORTIE :
- Reponds UNIQUEMENT avec le texte traduit, sans commentaire, sans preambule,
  sans balise de code. Conserve exactement le meme format que l'entree
  (si l'entree est du HTML, la sortie est du HTML ; si c'est du texte simple,
  la sortie est du texte simple).
- Si le texte est deja en francais ou ne contient rien a traduire, renvoie-le tel quel.`;

// Instructions specifiques par type de champ.
const KINDS = {
  html: "L'entree est un fragment HTML. Conserve la structure exactement.",
  title:
    "L'entree est un titre SEO (balise <title>). Traduis-le. Contrainte STRICTE : maximum 60 caracteres. Pas de HTML.",
  meta:
    "L'entree est une meta description SEO. Traduis-la. Contrainte STRICTE : entre 145 et 155 caracteres. Pas de HTML.",
  name:
    "L'entree est le nom interne de la page (usage back-office). Traduis-le en francais, concis, sans HTML.",
  slug:
    "L'entree est un slug d'URL. Renvoie un slug francais : minuscules, mots separes par des traits d'union, sans accents ni caracteres speciaux. Conserve les noms scientifiques (ex. drosophila-suzukii). Pas d'espaces, pas de HTML.",
  plain: "L'entree est du texte simple, sans HTML.",
};

// ---------------------------------------------------------------------------
// Utilitaires CLI
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { _: [], type: "site-pages", dryRun: false, publish: false };
  for (const a of argv.slice(2)) {
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--publish") args.publish = true;
    else if (a.startsWith("--type=")) args.type = a.slice("--type=".length);
    else if (a.startsWith("--out=")) args.out = a.slice("--out=".length);
    else if (a.startsWith("--")) {
      console.error(`Option inconnue : ${a}`);
      process.exit(2);
    } else args._.push(a);
  }
  return args;
}

function usage() {
  console.log(`
Usage :
  node translate-page.js <PAGE_ID> [options]

Options :
  --type=site-pages | landing-pages   Type de page HubSpot (defaut : site-pages)
  --dry-run                           N'ecrit RIEN sur HubSpot ; sauvegarde la
                                      traduction proposee dans un fichier local.
  --publish                           Publie la page apres la mise a jour
                                      (par defaut : mise a jour du brouillon seul).
  --out=chemin.json                   Fichier de sortie pour --dry-run.

Exemples :
  node translate-page.js 123456789 --dry-run
  node translate-page.js 123456789
  node translate-page.js 123456789 --type=landing-pages --publish
`);
}

// ---------------------------------------------------------------------------
// Client HubSpot (API CMS Pages v3)
// ---------------------------------------------------------------------------
const HUBSPOT_BASE = "https://api.hubapi.com";

async function hubspot(method, urlPath, token, body) {
  const res = await fetch(`${HUBSPOT_BASE}${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `HubSpot ${method} ${urlPath} a echoue (${res.status}) : ${text}`,
    );
  }
  return text ? JSON.parse(text) : {};
}

// ---------------------------------------------------------------------------
// Extraction des chaines traduisibles dans l'objet page.
// On cible :
//   - tous les champs `html` (modules Rich Text) partout dans l'arborescence,
//   - les champs SEO de premier niveau.
// Chaque entree renvoyee expose get()/set() pour lire/reecrire en place.
// ---------------------------------------------------------------------------
function collectHtmlFields(node, acc) {
  if (Array.isArray(node)) {
    for (const item of node) collectHtmlFields(item, acc);
  } else if (node && typeof node === "object") {
    for (const key of Object.keys(node)) {
      const val = node[key];
      if (key === "html" && typeof val === "string" && val.trim() !== "") {
        acc.push({
          kind: "html",
          label: "Bloc Rich Text (html)",
          get: () => node[key],
          set: (v) => {
            node[key] = v;
          },
        });
      } else {
        collectHtmlFields(val, acc);
      }
    }
  }
}

function collectSeoFields(page) {
  const map = [
    ["name", "name", "Nom interne de la page"],
    ["title", "htmlTitle", "Titre SEO"],
    ["meta", "metaDescription", "Meta description SEO"],
    ["slug", "slug", "Slug d'URL"],
    ["plain", "featuredImageAltText", "Alt de l'image a la une"],
  ];
  const fields = [];
  for (const [kind, prop, label] of map) {
    const val = page[prop];
    if (typeof val === "string" && val.trim() !== "") {
      fields.push({
        kind,
        label,
        get: () => page[prop],
        set: (v) => {
          page[prop] = v;
        },
      });
    }
  }
  return fields;
}

// ---------------------------------------------------------------------------
// Traduction via Claude (streaming pour supporter les longs blocs HTML).
// ---------------------------------------------------------------------------
async function translate(client, model, kind, text) {
  const system = `${CHARTE}\n\nType de champ : ${KINDS[kind] || KINDS.plain}`;
  const stream = client.messages.stream({
    model,
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    system,
    messages: [
      {
        role: "user",
        content: `Traduis en francais le contenu ci-dessous. Renvoie uniquement la traduction :\n\n${text}`,
      },
    ],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") {
    throw new Error("Claude a refuse de traiter ce bloc (stop_reason: refusal).");
  }
  const out = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!out) throw new Error("Reponse de traduction vide.");
  return out;
}

// ---------------------------------------------------------------------------
// Programme principal
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv);
  const pageId = args._[0];
  if (!pageId) {
    usage();
    process.exit(1);
  }

  const token = process.env.HUBSPOT_TOKEN;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.CLAUDE_MODEL || "claude-opus-4-8";

  if (!token) throw new Error("HUBSPOT_TOKEN manquant (voir .env.example).");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant (voir .env.example).");
  if (!["site-pages", "landing-pages"].includes(args.type)) {
    throw new Error(`--type invalide : ${args.type} (site-pages | landing-pages).`);
  }

  const client = new Anthropic({ apiKey });
  const apiPath = `/cms/v3/pages/${args.type}`;

  console.log(`> Recuperation de la page ${pageId} (${args.type})...`);
  const page = await hubspot("GET", `${apiPath}/${pageId}`, token);
  console.log(`  Page : "${page.name || "(sans nom)"}"`);

  // Rassemble tous les champs a traduire.
  const htmlFields = [];
  collectHtmlFields(page, htmlFields);
  const seoFields = collectSeoFields(page);
  const fields = [...htmlFields, ...seoFields];

  if (fields.length === 0) {
    console.log("  Aucun contenu textuel a traduire n'a ete trouve.");
    return;
  }
  console.log(
    `  ${htmlFields.length} bloc(s) Rich Text + ${seoFields.length} champ(s) SEO a traduire.\n`,
  );

  // Traduit chaque champ, sequentiellement (evite les limites de debit).
  let n = 0;
  for (const field of fields) {
    n += 1;
    const original = field.get();
    const preview = original.replace(/\s+/g, " ").slice(0, 60);
    process.stdout.write(
      `  [${n}/${fields.length}] ${field.label} : "${preview}${original.length > 60 ? "..." : ""}" ... `,
    );
    try {
      const translated = await translate(client, model, field.kind, original);
      field.set(translated);
      console.log("OK");
    } catch (err) {
      console.log(`ECHEC (${err.message}) — champ laisse inchange.`);
    }
  }

  // Langue = francais.
  page.language = "fr";

  console.log();

  if (args.dryRun) {
    const outPath =
      args.out ||
      path.resolve(process.cwd(), `page-${pageId}-fr.json`);
    fs.writeFileSync(outPath, JSON.stringify(page, null, 2), "utf8");
    console.log(`> --dry-run : aucune ecriture sur HubSpot.`);
    console.log(`  Traduction proposee ecrite dans : ${outPath}`);
    console.log(`  Verifie le fichier, puis relance sans --dry-run pour appliquer.`);
    return;
  }

  // Corps du PATCH : uniquement les champs modifies.
  const patch = {
    name: page.name,
    htmlTitle: page.htmlTitle,
    metaDescription: page.metaDescription,
    slug: page.slug,
    language: "fr",
    layoutSections: page.layoutSections,
    widgets: page.widgets,
  };
  if (page.featuredImageAltText !== undefined) {
    patch.featuredImageAltText = page.featuredImageAltText;
  }
  // Supprime les cles indefinies pour ne pas ecraser cote HubSpot.
  for (const k of Object.keys(patch)) {
    if (patch[k] === undefined) delete patch[k];
  }

  console.log(`> Mise a jour du brouillon sur HubSpot...`);
  await hubspot("PATCH", `${apiPath}/${pageId}`, token, patch);
  console.log("  Brouillon mis a jour.");

  if (args.publish) {
    console.log(`> Publication de la page...`);
    await hubspot("POST", `${apiPath}/${pageId}/draft/push-live`, token, {});
    console.log("  Page publiee.");
  } else {
    console.log(
      "  (Brouillon seulement. Ajoute --publish pour publier, ou publie depuis HubSpot.)",
    );
  }

  console.log("\nTermine.");
}

main().catch((err) => {
  console.error(`\nErreur : ${err.message}`);
  process.exit(1);
});
