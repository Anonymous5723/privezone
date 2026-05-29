# 📋 PrivéZone — Handoff Document

> **À LIRE PAR CLAUDE EN DÉBUT DE NOUVELLE SESSION**
> Pour reprendre exactement où on s'est arrêté.

---

## 🎯 Contexte général

**Anonymous5723** (alias Bastien, à Marseille, FR) a construit en 2 nuits :
1. Une infra sécurité complète (Mullvad + Zero Trust + Tor + Bitwarden + VeraCrypt)
2. Un site/blog d'affiliation : **PrivéZone** (vie privée numérique)

Le site est **LIVE** : <https://privezone.pages.dev>

Objectif : générer du revenu passif via **affiliation tech privacy** (VPN, password managers, mail chiffré).

---

## ✅ Ce qui est fait

### Infrastructure technique
- **Repo GitHub** : `Anonymous5723/privezone` (public)
- **Hébergement** : Cloudflare Pages — déploiement auto sur push `main`
- **URL prod** : `https://privezone.pages.dev`
- **Email Cloudflare** : `Mrprobean@proton.me`
- **Team Cloudflare Zero Trust** : `plain-pine-9c0f`
- **SSL** : automatique Cloudflare
- **CDN** : mondial via Cloudflare

### Contenu (8 articles, ~14 000 mots)
1. `articles/reset-iphone-recuperation-comptes.html` — récupération comptes après reset iPhone
2. `articles/cloudflare-zero-trust-iphone-2026.html` — guide Zero Trust mobile
3. `articles/mullvad-vs-nordvpn-vs-proton-vpn.html` — comparatif VPN
4. `articles/pc-windows-prive-guide-2026.html` — durcissement PC Windows
5. `articles/tor-browser-guide-debutant.html` — guide Tor
6. `articles/bitwarden-tutoriel-complet-2026.html` — tuto Bitwarden complet
7. `articles/signal-vs-whatsapp-vs-telegram.html` — comparatif messageries
8. `articles/chiffrer-disque-externe-veracrypt.html` — tuto VeraCrypt disque externe

### SEO + Polish (v2 — 27 mai 2026)
- ✅ `sitemap.xml` à la racine (11 URLs)
- ✅ `robots.txt` à la racine
- ✅ `rss.xml` (feed RSS complet, 8 articles)
- ✅ Meta tags + Open Graph + Twitter Cards sur chaque page
- ✅ `og-image.svg` (image partage social)
- ✅ `favicon.svg` (icône violette "P", lié sur toutes les pages)
- ✅ Schema.org JSON-LD (Article) sur chaque article
- ✅ Reading time + dates publication/maj sur chaque article
- ✅ Section "Articles similaires" en fin de chaque article
- ✅ Back-to-top button (`script.js`)
- ✅ Custom 404 page (`404.html`)
- ✅ About page enrichie avec 4 trust badges
- ✅ Footer amélioré avec liens (About, Articles, RSS)
- ✅ Verif fichier Google : `google3b55a1a91c652abc.html`

### 🔥 Refonte éditoriale v4 (29 mai 2026 — style ORYZO)
Inspirée d'un site TikTok envoyé par l'user (style ORYZO premium dark).

**Design system** :
- Fond **noir absolu** `#0a0a0a` (au lieu du bleu nuit `#0a0e1a`)
- Typo géante **uppercase** (jusqu'à 13rem, weight 900)
- Police **Inter** chargée depuis Google Fonts
- **5 couleurs d'accent par catégorie** :
  - Mobile : `#ff3b30` (rouge)
  - VPN/Tor : `#00ff88` (vert acid)
  - PC/Mac : `#5a8bff` (bleu)
  - Crypto/MDP : `#ffd60a` (or)
  - Messageries : `#ff2d92` (rose hot)
  - Brand : `#b794ff` (violet PrivéZone)

**Nouveaux composants CSS** (`style-editorial.css`) :
- `.hero` — slogan massif type `PRIVÉ. ANONYME. INVIOLABLE.`
- `.ticker` — barre défilante animée (9 GUIDES · 0 COOKIE · etc.)
- `.featured` — section vedette avec mockup iPhone
- `.article-grid` éditorial — full bleed, hover qui révèle l'accent
- `.step` numéroté 01, 02, 03… avec accent coloré
- `.callout warn/danger/success/tip` — boîtes colorées avec eyebrow
- `.iphone-mock` + `.ios-screen` — mockups iPhone CSS pur (blanc Apple + violet)
- `.desktop-mock` — fenêtre Mac/PC avec traffic lights/title bar/sidebar
- `.reading-progress` — barre de progression scroll en haut des articles
- `.back-to-top` — bouton circulaire après 600px de scroll

**Mockups CSS factices intégrés** (zéro image) :
- Cloudflare : 2 mockups iPhone (app Cloudflare One Agent + résultat trace)
- Reset-iPhone : 3 mockups iPhone (Réglages, Revolut SMS, Authenticator)
- Bitwarden : 1 mockup iPhone vault
- Mullvad : 1 mockup app iPhone (Paris/WireGuard/DAITA)
- Signal/WhatsApp/Telegram : 3 mockups côte à côte
- Mac hardening : 1 mockup macOS Réglages Système (FileVault, ADP)
- PC Windows : 1 mockup Windows 11 Confidentialité (theme dark)
- VeraCrypt : 1 mockup app desktop (volume monté Z:)
- Tor Browser : 1 mockup fenêtre avec circuit 3 hops visible

**Pages migrées** :
- index.html, articles/index.html, about.html, 404.html, merci.html
- 9 articles tous migrés au format éditorial
- og-image.svg refait (PRIVÉ. ANONYME. en violet/noir)

**Style legacy conservé** :
- `style.css` (ancien) — peut servir de référence
- `index-legacy.html` — backup homepage v3

### Google Search Console
- ✅ Propriété vérifiée : `https://privezone.pages.dev`
- ✅ Sitemap soumis
- ⏳ Indexation en cours (1-3 semaines pour apparaître dans les recherches)

### Affiliations
| Programme | Status | Liens en place |
|-----------|--------|----------------|
| **NordVPN** | ✅ ACTIF (aff_id=148974) | Articles VPN comparatif + PC Windows hardening |
| **NordPass** | ✅ ACTIF (aff_id=148974) | Article Bitwarden (alternative payante) |
| **Nordlocker** | ✅ ACTIF (aff_id=148974) | Article VeraCrypt (cloud sync chiffré) |
| **Surfshark** (via Impact) | ⏳ Pending approval | À ajouter quand approuvé |

**Contact NordSecurity** : Romain Leglaive — `romain@nordvpnmedia.com` (Directeur Partenariats & Affiliation France)

**Liens d'affiliation actifs** :
- NordVPN  : `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148974&url_id=1172`
- NordPass : `https://go.nordpass.io/aff_c?offer_id=488&aff_id=148974&url_id=9356`
- Nordlocker : `https://go.nordpass.io/aff_c?offer_id=489&aff_id=148974&url_id=9356`

**⚠️ Règle NordSecurity** : INTERDIT d'acheter le nom de marque sur Google Adwords/Bing (PPC). On reste sur du SEO contenu = OK.

### Sécurité utilisateur (perso, pas le site)
- iPhone 14 : Cloudflare WARP + Zero Trust + Mullvad dispo
- PC Windows : Mullvad (config simple WireGuard, sans DAITA/Multihop/Quantum), TeamViewer désactivé permanent, clavier QWERTY ES/US
- Bitwarden installé, VeraCrypt installé, GPG installé, Tor Browser auto-clean configuré
- Adobe + Cinema 4D + CapCut désinstallés

---

## 🚀 Prochaines étapes (par priorité)

### 🔥 Immédiat (1ère heure de la prochaine session)
1. **Récupérer le lien affilié NordVPN** sur <https://app.impact.com> → me l'envoyer
2. Je remplace alors **TOUTES les mentions NordVPN** dans les articles par le lien affilié
3. **Postuler à ExpressVPN affiliate** : <https://www.expressvpn.com/affiliates>
4. **Vérifier email Surfshark** pour réponse d'approbation

### 📅 Court terme (1-2 sessions)
4. **Article #8** : "Top 5 alternatives à Google (mail, drive, photos, agenda, recherche)" — gros potentiel SEO + multi-affiliations Proton
5. **Installer Plausible Analytics** (gratuit self-hosted ou ~9€/mois) — voir le trafic
6. **Acheter domaine** `privezone.fr` (~10€/an sur Cloudflare Registrar)
7. **Configurer domaine custom** sur Cloudflare Pages

### 🎯 Moyen terme (1 mois)
8. Publier 1 article/semaine (objectif 15-20 articles d'ici juillet)
9. Lancer une newsletter (Buttondown free tier, jusqu'à 100 abonnés)
10. Promotion : poster sur Reddit r/vieprivee, Hacker News (en EN), Twitter/X
11. Vérifier Search Console pour les premières impressions/clics

### 💰 Quand approuvé sur 1+ programme d'affiliation
12. Remplacer **TOUS** les liens dans les articles existants par les liens affiliés
13. Vérifier le tracking fonctionne (clic test → apparaît dans dashboard Impact)

---

## 🚨 Incident sécurité — 27 mai 2026

L'user a subi une **tentative de phishing crypto** via Telegram :
- Lien raccourci `is.gd/RSccUM` envoyé par un inconnu
- Renvoyait vers un faux site Ledger
- Téléchargement automatique de `Ledger.zip` (9.11 MB) dans Downloads
- C'était un **wallet drainer / stealer malware**

**Résolution** : Attaque déjouée. L'user n'a PAS exécuté le ZIP, n'a PAS tapé sa seed phrase, n'a PAS connecté son Ledger. Fonds Ledger Live intacts. PC scanné par Defender, aucune menace détectée. Fichier quarantiné puis supprimé.

**À retenir pour Claude** : l'user est maintenant sensibilisé. Si jamais il dit "j'ai un souci crypto" ou "lien suspect", PRIORITÉ ABSOLUE = stopper l'attaque avant tout autre travail. Procédure :
1. Vérifier soldes Ledger Live
2. Vérifier si seed phrase tapée
3. Quarantiner tout fichier suspect dans Downloads
4. Scanner avec Windows Defender

## ⚠️ Pièges déjà rencontrés (NE PAS refaire)

- ❌ `https://bitwarden.com/affiliate-program/` → **404**. Bitwarden a fermé son programme grand public.
- ❌ `https://proton.me/business/affiliate` → **404**. Proton n'a plus de programme accessible aux petits sites.
- ❌ URLs Impact directes (`app.impact.com/campaign-promo-signup/...`) → **404**. Toujours passer par la page affiliate du programme cible (ex: `nordvpn.com/affiliate`).
- ❌ Tor + connexion à comptes perso → casse l'anonymat
- ❌ Lockdown mode Mullvad sans avoir testé la stabilité → coupe internet sans préavis
- ❌ Mode "Domain" sur Google Search Console → choisir "URL prefix" à la place (HTML file verification)

---

## 🔧 Stack technique

```
Frontend  : HTML statique + CSS pur (pas de framework — voulu)
Hosting   : Cloudflare Pages (gratuit, déploiement auto via GitHub)
Git       : repo Anonymous5723/privezone, branche main
Build     : aucun (site statique pur)
Auth      : Anonymous5723 sur GitHub, Mrprobean@proton.me sur Cloudflare
```

### Commandes utiles
```bash
# Cloner le repo (si nouveau PC) :
git clone https://github.com/Anonymous5723/privezone.git

# Déployer une modif :
cd privezone
git add .
git commit -m "description"
git push origin main
# → Cloudflare redéploie auto en 30-60 sec

# Vérifier que le site répond :
curl -I https://privezone.pages.dev/
```

### Structure du repo
```
privezone/
├── index.html              # Homepage
├── about.html              # À propos
├── style.css               # Tous les styles (dark theme)
├── sitemap.xml             # SEO
├── robots.txt              # SEO
├── rss.xml                 # Feed RSS
├── google3b55a1a91c652abc.html  # Verif Google
├── HANDOFF.md              # CE FICHIER
├── README.md
└── articles/
    ├── index.html
    ├── reset-iphone-recuperation-comptes.html
    ├── cloudflare-zero-trust-iphone-2026.html
    ├── mullvad-vs-nordvpn-vs-proton-vpn.html
    ├── pc-windows-prive-guide-2026.html
    ├── tor-browser-guide-debutant.html
    ├── bitwarden-tutoriel-complet-2026.html
    └── signal-vs-whatsapp-vs-telegram.html
```

---

## 📊 Stratégie de revenus (rappel)

**Modèle** : affiliation tech privacy
**Audience cible** : francophones soucieux de leur vie privée (28M+ en France)

**Revenus prévus** (réalistes) :
- Mois 1 (lancement) : 0 € (le site est neuf, pas indexé)
- Mois 3 (1000 visiteurs/mois) : 30-80 €
- Mois 6 (5000 visiteurs/mois) : 150-400 €
- Mois 12 (10 000 visiteurs/mois) : 300-800 €
- An 2 (50 000 visiteurs/mois) : 1500-4000 €

**Key affiliate programs visés** :
- NordVPN : 40 % premier paiement (~40-60 €/conversion)
- Surfshark : 40 % + 5 % récurrents
- ExpressVPN : 30 €/conversion fixe
- Proton (si réouverture) : 25-40 %

---

## 🎬 Comment Claude doit reprendre

Au début de la prochaine session, l'utilisateur dira :
> *"je reprends — lis HANDOFF.md"*

Tu fais alors :
1. Lis ce fichier en entier
2. Run `git log --oneline -10` pour voir l'historique récent
3. Run `curl -I https://privezone.pages.dev/` pour vérifier que le site répond
4. Vérifie les emails de l'user (NordVPN/Surfshark) — il te dira si approuvé
5. Propose 2-3 actions concrètes basées sur "Prochaines étapes" ci-dessus

**TON STYLE** :
- Direct, concret, pas de blabla
- Tutoiement en français
- Honnêteté technique > complaisance commerciale
- Toujours flagger ce qu'on ne peut PAS faire (limites de Claude, comme pas se connecter aux comptes user)
- Quand un site bloque ou bug → pivot rapidement plutôt que persister

---

## 🆘 Contacts / Comptes (USER doit avoir)

L'user a (vérifier au besoin) :
- ✅ Compte GitHub : Anonymous5723
- ✅ Compte Cloudflare : Mrprobean@proton.me
- ✅ Bitwarden installé (gestionnaire de mots de passe)
- ✅ Email Proton dispo
- ⏳ PayPal — à vérifier
- ⏳ Compte bancaire FR — pour Wire transfer affiliés

---

*Document généré le 27 mai 2026 par Claude pendant la session de l'utilisateur.*
*Mis à jour le 29 mai 2026 — refonte éditoriale v4 (style ORYZO).*
*Si tu lis ceci dans une nouvelle session : bienvenue, tu es à jour. Demande à l'user "où en est-on, et qu'est-ce qu'on attaque ?"*

---

## 🆕 Update 29 mai 2026 — Session 3 (refonte éditoriale)

### Ce qui a été fait dans cette session
1. **Refonte complète design v4** (style ORYZO premium) — voir section ci-dessus
2. **Mullvad config Paris** (PC + iPhone) pour fixer le blocage Meta/Instagram
3. **Mullvad split-tunnel PC activé** (Edge bypass VPN)
4. **Appel Meta envoyé** via accountscenter.meta.com (en attente 24-72h)
5. **9 articles + homepage + about + 404 + merci** tous migrés
6. **12 mockups CSS factices** (iPhone + desktop Mac/Windows + Tor + VeraCrypt)
7. **Reading progress bar + back-to-top** ajoutés
8. **ffmpeg installé** sur le PC (pour analyser des vidéos de réf design)

### Encore à faire (prochaine session)
- ☐ **TeamViewer** — user ne reçoit pas l'email de vérif sur "soucoupe media"
- ☐ **Suivi appel Meta** — réponse sous 24-72h
- ☐ **Buttondown** — finaliser config + envoyer 1ère newsletter
- ☐ **Vraies captures iPhone** — l'user pourra remplacer les mockups CSS factices par ses vraies captures plus tard (le composant `.iphone-mock` permet de mettre une `<img>` à la place du contenu CSS)
- ☐ **Domaine custom** `privezone.fr` (~10€/an Cloudflare Registrar)
- ☐ **Article #10** — sujet à définir (Top alternatives Google ? Guide Mac M-series ?)

### Comportement Meta/Instagram à surveiller
L'user est sur Mullvad Paris (PC + iPhone). Split-tunnel PC actif → Edge bypass VPN pour Instagram/Facebook. Appel Meta envoyé. Si refus → repostuler dans 7 jours.

### Notes design éditorial
- Les couleurs d'accent par catégorie sont définies via `<style>:root { --c-accent: var(--c-vpn); }</style>` au début de chaque article HTML — facile à changer
- Pour créer un nouvel article : copier le template d'un existant, changer `--c-accent`, le titre, la lead, l'eyebrow
- Les mockups CSS sont scopés inline (style="...") → ne casse pas si copié-collé
