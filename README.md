# Moulahmiam

Structure de projet pour le bot Telegram **Moulahmiam** et son interface web.

## Démarrage rapide

```bash
# installer les dépendances
cd bot && npm install && cd ..
cd web && npm install && cd ..

# lancer en développement
npm run dev --prefix bot
npm run dev --prefix web
```

## Conteneurs

Un fichier `docker-compose.yml` est fourni pour exécuter le bot, le site et Redis :

```bash
docker compose up --build
```

## Répertoires

- `bot/` – Bot Telegram en TypeScript (Telegraf, BullMQ, SQLite).
- `web/` – Interface web SvelteKit avec Tailwind CSS.
