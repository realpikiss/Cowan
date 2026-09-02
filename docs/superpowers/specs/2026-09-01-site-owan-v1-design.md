# Site web OWAN INTER LINK — v1 (design)

## Contexte

OWAN INTER LINK est une entreprise de sourcing / commerce international /
logistique connectant l'Afrique aux marchés mondiaux. Le cahier des charges
complet est dans `cahier_charge` à la racine du projet. Ce document couvre
la première version du site : un site vitrine statique, sans backend,
en français uniquement.

## Objectif

Livrer un site simple, rapide, fiable, mobile-first, qui permet à un visiteur
de comprendre l'offre OWAN et de contacter l'entreprise (par WhatsApp) en
moins d'une minute — sans dépendre d'un serveur, d'une base de données ou
d'un framework.

## Stack technique

**HTML / CSS / JavaScript pur. Aucun framework, aucun build step.**

Justification : le site n'a pas besoin d'état applicatif, de routage
dynamique ni de composants interactifs complexes. Les formulaires
n'envoient rien à un serveur (voir plus bas), le bilinguisme est reporté à
une v2, et les visuels reposent sur des emoji/CSS plutôt que sur une
médiathèque. Un framework (React, Next.js, etc.) n'apporterait aucun
bénéfice et compliquerait le déploiement. CSS pur également plutôt que
Bootstrap : la charte graphique est simple (3-4 couleurs, cartes, grille
responsive), et un framework CSS ajouterait du poids et un rendu générique
à contrer, alors que le cahier des charges demande un style "premium et
épuré".

Déploiement : n'importe quel hébergement de fichiers statiques (Netlify,
GitHub Pages, hébergement mutualisé classique...). Pas de dépendance à un
runtime serveur.

## Structure des fichiers

```
cowan/
├── index.html              (Accueil)
├── services.html
├── secteurs/
│   ├── index.html          (liste des 6 secteurs)
│   ├── motors.html
│   ├── btp.html
│   ├── energy.html
│   ├── agriculture.html
│   ├── home.html
│   └── industry.html
├── owan-china.html
├── a-propos.html           (Comment ça marche + Pourquoi Owan + Showroom)
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── owan.jpeg
```

Le header (nav + logo + CTA "LANCER MON PROJET" + bouton mobile "PARLER À
OWAN") et le footer sont dupliqués à l'identique en haut/bas de chaque
fichier HTML — il n'y a pas de mécanisme d'inclusion natif en HTML pur.
Le contenu HTML de ces deux blocs doit rester strictement identique
d'une page à l'autre.

11 pages HTML au total pour cette v1.

## Design system (CSS)

- Variables CSS pour la charte graphique : `--owan-orange`, `--owan-black`,
  `--owan-white`, `--owan-gray`.
- Mobile-first : layout en colonne par défaut ; breakpoints pour tablette et
  desktop (grilles multi-colonnes pour les cartes services/secteurs).
- Police système (`-apple-system, Segoe UI, Roboto, sans-serif` ou
  équivalent) — pas de Google Fonts, pour rester léger et rapide et éviter
  une dépendance CDN externe pour la typographie.
- Emoji utilisés comme "icônes" pour les services (🔎🤝🚢🌍) et secteurs
  (🚗🏗⚡🌾🏠🏭), affichés dans des cartes avec bordure/dégradé aux couleurs
  OWAN. Pas d'images à charger pour ces sections tant que les vraies photos
  ne sont pas fournies.
- Style général : sobre, peu d'animations, pas de vidéos lourdes, pages
  courtes et aérées — conformément à la section "Style visuel" du cahier
  des charges.

## Contenu par page

Le contenu textuel de chaque page reprend directement les sections
correspondantes du cahier des charges (`cahier_charge`) :

- **Accueil** (`index.html`) : hero avec slogan, boutons "LANCER MON
  PROJET" / "DÉCOUVRIR NOS SERVICES", section "QUE RECHERCHEZ-VOUS ?"
  (formulaire → WhatsApp), aperçu services/secteurs, aperçu "Comment ça
  marche", CTA showroom.
- **Services** (`services.html`) : les 4 services (Sourcing, Trade,
  Logistics, Projects).
- **Secteurs** (`secteurs/index.html` + 6 pages détail) : chaque page
  secteur a une description courte, quelques exemples, et un bouton
  "DEMANDER UN DEVIS" (lien WhatsApp pré-rempli avec le nom du secteur).
- **Owan China** (`owan-china.html`) : présentation de la présence en
  Chine, les 5 étapes (Recherche fournisseur → Vérification → Négociation
  → Contrôle → Expédition), mention "GUANGZHOU — CHINA". Utilise l'image
  `assets/owan.jpeg` disponible ; les autres visuels restent en
  emoji/CSS en attendant de vraies photos.
- **À propos** (`a-propos.html`) : regroupe "Comment ça marche" (4 étapes),
  "Pourquoi OWAN" (5 points de confiance), et "Showroom" (Grand-Bassam,
  boutons Localisation/Appeler/WhatsApp).
- **Contact** (`contact.html`) : coordonnées (placeholders, voir
  ci-dessous), formulaire de contact → WhatsApp, iframe Google Maps
  (placeholder d'adresse).

## Formulaires → WhatsApp (pas de backend)

Les deux formulaires du cahier des charges ("QUE RECHERCHEZ-VOUS ?" et
"Contact") sont des `<form>` HTML classiques interceptés en JavaScript
(`js/main.js`) : au submit, le script construit un message texte formaté à
partir des champs remplis, l'encode en URL, et redirige le navigateur vers
`https://wa.me/<WHATSAPP_NUMBER>?text=<message>`.

- Champs du formulaire "Que recherchez-vous ?" : nom, téléphone/WhatsApp,
  email, produit recherché, quantité, budget approximatif, pays de
  destination, message. Le champ "photo ou lien du produit" devient une
  note explicite ("vous pourrez l'envoyer directement dans la conversation
  WhatsApp qui s'ouvrira") plutôt qu'un vrai upload de fichier, puisqu'un
  lien `wa.me` ne peut pas transporter de pièce jointe.
- Champs du formulaire Contact : nom, téléphone, email, sujet, message.
- Validation minimale côté client (champs requis) avant construction du
  message, pas de validation serveur puisqu'il n'y a pas de serveur.

## Placeholders de contact

Toutes les informations de contact réelles (numéro WhatsApp, téléphone,
email, adresse, horaires, réseaux sociaux, coordonnées Google Maps) sont
encore inconnues. Elles sont centralisées en constantes en haut de
`js/main.js` (ex. `const WHATSAPP_NUMBER = "225XXXXXXXXX";`) et/ou dans des
éléments HTML clairement identifiables (ex. texte `[EMAIL OWAN]`), de sorte
qu'une seule recherche/remplacement suffise pour les renseigner plus tard.
Ceci n'est PAS traité comme une fonctionnalité à construire — juste des
valeurs à corriger.

## Hors périmètre (v1)

- Anglais (le cahier des charges le prévoit en v2 ; on ne construit pas de
  mécanisme de traduction maintenant).
- Toute fonctionnalité "Phase 2" du cahier des charges : catalogue OWAN
  MOTORS, calculateur de prix, tracking de commandes, espace client,
  paiement en ligne, factures téléchargeables, notifications.
- Upload réel de fichiers (photo produit) — remplacé par l'envoi manuel
  dans la conversation WhatsApp ouverte.
- Google Analytics / outil statistique (peut être ajouté plus tard sans
  changer l'architecture).
- Tout backend, base de données, CMS ou administration.

## Tests / vérification

Pas de suite de tests automatisés pertinente pour du HTML/CSS/JS statique
sans logique métier complexe. Vérification par usage réel du site avant de
considérer le travail terminé :

- Ouvrir chaque page dans un navigateur, vérifier la navigation entre
  toutes les pages (liens du header/footer, liens internes).
- Tester les deux formulaires (soumission → ouverture correcte de
  `wa.me` avec le message attendu).
- Vérifier le rendu responsive (mobile / tablette / desktop) sur les pages
  principales.
- Vérifier qu'il n'y a pas de lien ou de ressource cassée (image, CSS,
  JS).
