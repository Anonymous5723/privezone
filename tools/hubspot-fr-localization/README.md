# Localisation FR des pages CMS HubSpot (ES → FR)

Outil en ligne de commande qui **lit une page du CMS HubSpot**, **traduit** tout
son contenu de l'espagnol vers le français avec l'API Claude (en respectant la
charte de localisation agricole), puis **réécrit la page en brouillon** avec les
champs SEO traduits.

C'est l'approche **API** (fiable, reproductible) — pas de clic simulé dans le
navigateur.

---

## 1. Prérequis (PC Windows)

1. **Node.js 18 ou plus.** Installe-le depuis <https://nodejs.org> (version LTS).
   Vérifie dans un terminal (PowerShell) :
   ```powershell
   node --version
   ```
   Le numéro doit être ≥ 18.

2. **Un token d'application privée HubSpot** avec les droits CMS :
   - HubSpot → **Paramètres** → **Intégrations** → **Applications privées**
   - **Créer une application privée**
   - Onglet **Scopes** → coche les droits **content** (lecture *et* écriture des pages CMS)
   - Crée l'app et copie le token (format `pat-...`).

3. **Une clé API Claude (Anthropic)** : <https://console.anthropic.com> → API Keys.

---

## 2. Installation

Dans PowerShell, place-toi dans le dossier de l'outil puis installe les dépendances :

```powershell
cd tools\hubspot-fr-localization
npm install
```

Copie le modèle de configuration et remplis tes secrets :

```powershell
copy .env.example .env
notepad .env
```

Renseigne dans `.env` :
- `HUBSPOT_TOKEN` = ton token `pat-...`
- `ANTHROPIC_API_KEY` = ta clé `sk-ant-...`

> ⚠️ Le fichier `.env` contient tes secrets : il ne doit **jamais** être partagé
> ni commité (il est déjà ignoré par `.gitignore`).

---

## 3. Trouver l'ID d'une page

Ouvre la page dans l'éditeur HubSpot : l'**ID** apparaît dans l'URL, par exemple
`.../pages/<PORTAL_ID>/editor/<PAGE_ID>`. C'est le grand nombre `<PAGE_ID>`.

Les pages de site et les landing pages sont deux types distincts :
- page de site → `--type=site-pages` (défaut)
- landing page → `--type=landing-pages`

---

## 4. Utilisation

**Toujours commencer par un essai à blanc** (`--dry-run`) : rien n'est écrit sur
HubSpot, la traduction proposée est enregistrée dans un fichier JSON local que tu
peux relire.

```powershell
# 1) Essai a blanc : produit page-<ID>-fr.json a relire
node translate-page.js 123456789 --dry-run

# 2) Une fois verifie : met a jour le BROUILLON de la page sur HubSpot
node translate-page.js 123456789

# 3) Optionnel : met a jour ET publie
node translate-page.js 123456789 --publish

# Pour une landing page :
node translate-page.js 123456789 --type=landing-pages --dry-run
```

### Ce que l'outil traduit
- **Tous les blocs Rich Text** de la page (champs `html`), en conservant
  intégralement le HTML, les liens, listes, gras, italiques, boutons.
- **Les champs SEO** : nom interne, titre SEO (≤ 60 caractères), meta description
  (145–155 caractères), slug d'URL, texte alternatif de l'image à la une.
- La **langue** de la page est passée à `fr`.

### Ce que l'outil respecte (charte)
- Marques et produits jamais traduits : Suterra®, BioMagnet®, CheckMate®, Puffer®,
  Celada™, Subvert®, Depur®, « Suterra 360 ».
- Noms scientifiques conservés en italique et non traduits
  (*Drosophila suzukii*, *Lobesia botrana*, …).
- Terminologie agricole française (Monitoreo → Suivi, Control de plagas → Lutte
  contre les ravageurs, etc.).

---

## 5. Traiter plusieurs pages

Relance simplement la commande pour chaque ID. Exemple PowerShell :

```powershell
foreach ($id in 111111111, 222222222, 333333333) {
  node translate-page.js $id
}
```

---

## 6. Limites et bonnes pratiques

- **Brouillon par défaut** : sans `--publish`, la page live n'est pas modifiée.
  Tu peux relire dans HubSpot puis publier manuellement.
- **Champs SEO manuels restants** : le *domaine FR* et l'URL *canonique* dépendent
  de la configuration multi-domaine de ton portail HubSpot et ne sont pas modifiés
  automatiquement (l'API ne les expose pas de façon fiable par page) — ajuste-les
  dans l'onglet *Settings* de la page si nécessaire. L'outil te laisse la structure
  intacte pour le faire.
- **Modules non-Rich-Text** : si une page utilise des modules personnalisés qui
  stockent leur texte ailleurs que dans un champ `html`, ce texte peut ne pas être
  détecté. Fais un `--dry-run` et vérifie le JSON : si un bloc espagnol subsiste,
  signale-le et on étendra l'extraction à ce module.
- **Coût / débit** : l'outil traduit les blocs un par un pour éviter les limites de
  débit. Le modèle par défaut est `claude-opus-4-8` (modifiable via `CLAUDE_MODEL`
  dans `.env`).
