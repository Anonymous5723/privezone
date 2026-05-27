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

### Contenu (7 articles, ~12 000 mots)
1. `articles/reset-iphone-recuperation-comptes.html` — récupération comptes après reset iPhone
2. `articles/cloudflare-zero-trust-iphone-2026.html` — guide Zero Trust mobile
3. `articles/mullvad-vs-nordvpn-vs-proton-vpn.html` — comparatif VPN
4. `articles/pc-windows-prive-guide-2026.html` — durcissement PC Windows
5. `articles/tor-browser-guide-debutant.html` — guide Tor
6. `articles/bitwarden-tutoriel-complet-2026.html` — tuto Bitwarden complet
7. `articles/signal-vs-whatsapp-vs-telegram.html` — comparatif messageries

### SEO
- ✅ `sitemap.xml` à la racine (10 URLs)
- ✅ `robots.txt` à la racine
- ✅ `rss.xml` (feed RSS complet)
- ✅ Meta tags + Open Graph sur chaque page
- ✅ Verif fichier Google : `google3b55a1a91c652abc.html`

### Google Search Console
- ✅ Propriété vérifiée : `https://privezone.pages.dev`
- ✅ Sitemap soumis
- ⏳ Indexation en cours (1-3 semaines pour apparaître dans les recherches)

### Affiliations
| Programme | Status | Date |
|-----------|--------|------|
| **NordVPN** (via Impact) | ⏳ Pending approval | Soumis 27/05/2026 |
| **Surfshark** (via Impact) | ⏳ Pending approval | Soumis 27/05/2026 |

### Sécurité utilisateur (perso, pas le site)
- iPhone 14 : Cloudflare WARP + Zero Trust + Mullvad dispo
- PC Windows : Mullvad (config simple WireGuard, sans DAITA/Multihop/Quantum), TeamViewer désactivé permanent, clavier QWERTY ES/US
- Bitwarden installé, VeraCrypt installé, GPG installé, Tor Browser auto-clean configuré
- Adobe + Cinema 4D + CapCut désinstallés

---

## 🚀 Prochaines étapes (par priorité)

### 🔥 Immédiat (1ère heure de la prochaine session)
1. **Postuler à ExpressVPN affiliate** : <https://www.expressvpn.com/affiliates>
2. **Vérifier les emails** (NordVPN/Surfshark) pour réponses d'approbation
3. **Si approuvé** → récupérer les liens affiliés et les insérer dans les articles

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
*Si tu lis ceci dans une nouvelle session : bienvenue, tu es à jour. Demande à l'user "où en est-on, et qu'est-ce qu'on attaque ?"*
