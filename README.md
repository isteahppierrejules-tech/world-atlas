# LOG3500 - Conception et programmation de sites Web I

## Devoir 2 : Application Web Asynchrone - Atlas Mondial Interactif

### Description du projet
Ce projet consiste en un **Atlas Mondial Interactif** développé dans le cadre du cours LOG3500 à l'ISTEAH. L'application permet à un utilisateur de rechercher un pays et d'obtenir dynamiquement une carte d'identité sémantique, visuelle et responsive de ce pays en interrogeant une API réelle.

### Fonctionnalités implémentées
* **Structure HTML5 Sémantique :** Utilisation des balises `<header>`, `<nav>`, `<main>`, `<section>`, et `<footer>`.
* **Mise en page moderne :** Utilisation de Flexbox et CSS Grid pour un rendu épuré et parfaitement responsive (adapté aux mobiles, tablettes et ordinateurs).
* **Indicateur de chargement :** Un spinner visuel s'affiche pendant que l'application récupère les données de l'API.
* **Consommation d'API réelle :** Connexion asynchrone à l'API *REST Countries* via la méthode moderne `fetch()` avec `async/await` et gestion des erreurs (`try...catch`).
* **Accessibilité (a11y) :** Gestion dynamique des attributs `aria-invalid="true"` et `aria-describedby` en cas de champ vide.
* **Sécurité du DOM :** Protection rigoureuse contre les failles XSS en utilisant exclusivement la propriété `textContent` pour injecter les données textuelles de l'API.
* **Formatage des données :** La population est formatée de manière lisible avec des espaces pour séparer les milliers (ex: 11 500 000).

### Technologies utilisées
* HTML5
* CSS3 (Flexbox, Grid, Media Queries)
* JavaScript (ES6+, Fetch API, Async/Await)
* API Rest Countries (v3.1)

### Structure des dossiers
```text
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── app.js