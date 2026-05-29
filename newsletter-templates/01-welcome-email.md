# 📧 EMAIL WELCOME — À configurer dans Buttondown

**Type** : Welcome email (envoyé automatiquement à chaque nouvel inscrit)
**Configuration** : Settings → Automated emails → Welcome email → Enable

---

## SUJET

```
Salut {{ subscriber.metadata.first_name|default:"toi" }}, arrête d'être une proie sur internet.
```

---

## CORPS (Markdown — Buttondown supporte)

```markdown
Salut **{{ subscriber.metadata.first_name|default:"toi" }}**,

Bienvenue dans **PrivéZone** 🛡️

Tu viens de t'inscrire à la seule newsletter cybersécurité qui te parle **comme un ami** : pas de jargon, pas de "top 10 VPN" généré par IA, pas de pubs cachées dans le texte.

---

### 🎯 Ce que tu vas recevoir

**1 email par semaine**, le vendredi matin. Dedans :

- 1 **nouveau guide** concret (ex: "Configurer Bitwarden en 15 min")
- 1 **astuce rapide** (3 phrases, applicable en 30 secondes)
- 1 **alerte** quand un outil que tu utilises a une fuite ou un bug critique

Pas de spam. Désinscription en 1 clic à tout moment.

---

### 🚀 Pour bien démarrer

Voilà les **3 guides essentiels** à lire en premier :

👉 **[Bitwarden : le tutoriel complet 2026](https://privezone.pages.dev/articles/bitwarden-tutoriel-complet-2026.html)**
La décision n°1 qui transforme ta sécurité numérique. 30 min de config = plus jamais de mot de passe piraté.

👉 **[Cloudflare Zero Trust sur iPhone](https://privezone.pages.dev/articles/cloudflare-zero-trust-iphone-2026.html)**
Anti-malware niveau entreprise sur ton iPhone, gratuit. 30 min de setup.

👉 **[Mullvad vs NordVPN vs Proton : le comparatif honnête](https://privezone.pages.dev/articles/mullvad-vs-nordvpn-vs-proton-vpn.html)**
Tu te demandes quel VPN prendre ? Réponse en 10 min.

---

### ⭐ L'offre du moment

J'ai négocié pour mes lecteurs une réduction **NordVPN -74%** : tu passes de 12,99 €/mois à **3,09 €/mois** sur le plan 2 ans. C'est moins cher qu'un café.

110+ pays, Netflix US débloqué, Threat Protection anti-malware intégré, 6 appareils. Garantie 30 jours satisfait ou remboursé.

👉 **[Profiter de l'offre NordVPN -74%](https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148974&url_id=1172)**

*Lien affilié — si tu prends l'abonnement via ce lien, ça soutient PrivéZone sans surcoût pour toi (tu paies le même prix qu'en direct).*

---

À vendredi prochain pour le premier numéro,

**Bastien**
Créateur de PrivéZone

---

PS : si tu connais quelqu'un qui se fait régulièrement avoir par des arnaques en ligne, forward-lui ce mail. Ça pourrait lui sauver son compte bancaire.

[**Découvrir tous les guides**](https://privezone.pages.dev/articles/) · [**Voir les offres**](https://privezone.pages.dev/offres.html) · [**Se désinscrire**]({{ unsubscribe_url }})
```

---

## 💡 Notes

- `{{ subscriber.metadata.first_name|default:"toi" }}` → si le prénom est rempli, dit "Salut Paul", sinon dit "Salut toi"
- `{{ unsubscribe_url }}` → généré automatiquement par Buttondown
- Buttondown rend le markdown en HTML automatiquement
- Le ton "arrête d'être une proie" est dans le SUJET pour maximiser l'ouverture
