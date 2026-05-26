# PrivéZone

> Site statique sur la vie privée et la sécurité numérique. Guides honnêtes, basés sur expériences réelles.

## 🌐 Live

À déployer sur Cloudflare Pages → URL finale : `https://privezone.pages.dev` (ou ton domaine custom).

## 📁 Structure

```
privezone/
├── index.html                    # Homepage
├── about.html                    # À propos
├── style.css                     # Tous les styles (dark theme)
├── articles/
│   ├── index.html                # Liste des articles
│   ├── reset-iphone-recuperation-comptes.html
│   ├── cloudflare-zero-trust-iphone-2026.html
│   ├── mullvad-vs-nordvpn-vs-proton-vpn.html
│   ├── pc-windows-prive-guide-2026.html
│   └── tor-browser-guide-debutant.html
└── README.md
```

## ✏️ Ajouter un nouvel article

1. Copie un fichier `articles/xxx.html` existant
2. Renomme-le avec un slug SEO-friendly (ex. `comment-utiliser-veracrypt.html`)
3. Modifie le `<title>`, la `<meta description>`, et le contenu de `<article>`
4. Ajoute-le à `articles/index.html` (dans la bonne catégorie)
5. Ajoute-le à `index.html` (section "Articles récents", si récent)
6. Commit + push

## 🔗 Liens d'affiliation à remplacer

Une fois inscrit aux programmes affiliés, remplace les URL dans les articles :

| Outil | Programme affilié | Commission |
|-------|-------------------|------------|
| Bitwarden | https://bitwarden.com/partners/ | 15-30% |
| Proton | https://proton.me/business/affiliate | 25-40% |
| NordVPN | https://nordvpn.com/affiliate/ | 40% / 100% premier mois |
| Mullvad | Pas de programme officiel (mais ils acceptent les recommandations) | - |
| ExpressVPN | https://www.expressvpn.com/affiliates | 30 € / conversion |

Cherche dans le code les `href="https://bitwarden.com/"` etc. et ajoute ton tag affilié à la fin.

## 🚀 Déploiement sur Cloudflare Pages

1. Push ce repo sur GitHub (`Anonymous5723/privezone`)
2. Va sur https://dash.cloudflare.com → Workers & Pages → Create → Pages
3. Connect to Git → choisis ce repo
4. Build settings :
   - Framework preset : **None**
   - Build command : (vide)
   - Build output directory : `/`
5. Save and Deploy
6. URL finale : `https://privezone-XXX.pages.dev`

Pour un domaine custom (10 €/an chez Cloudflare, OVH, Gandi) : Custom Domains → ajouter.

## 📊 Analytics — Plausible (optionnel)

Plausible (~10 €/mois) ou Umami (gratuit self-hosted) — analytics respectueux, sans cookies, sans tracking individuel.

## 📝 Roadmap

- [ ] Article : "VeraCrypt vs BitLocker — lequel choisir"
- [ ] Article : "Comment chiffrer ses emails avec PGP"
- [ ] Article : "SimpleLogin vs Apple Hide My Email"
- [ ] Article : "ProtonPass vs Bitwarden vs 1Password"
- [ ] Mettre en place une vraie newsletter (Buttondown free tier)
- [ ] Sitemap.xml
- [ ] RSS feed

---

Sans tracking, sans cookies, sans bullshit. 🛡️
