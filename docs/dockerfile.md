# Dockerfile — commandes et rôle

Ce fichier décrit un **build multi-étapes** : on sépare l’installation des dépendances, la compilation de l’app et l’image finale minimale pour la production.

---

## Étape 1 : `deps` — dépendances

| Ligne | Commande | Utilité |
|-------|----------|---------|
| 2 | `FROM node:20-alpine AS deps` | Image de base **Node.js 20** sur **Alpine Linux** (légère). Le nom `deps` permet d’y référencer cette étape plus tard (`COPY --from=deps`). |
| 3 | `WORKDIR /app` | Définit `/app` comme répertoire de travail pour les commandes suivantes ; les fichiers copiés et les chemins relatifs s’y rapportent. |
| 4 | `RUN apk add --no-cache python3 make g++` | Installe des outils natifs souvent requis pour compiler des modules npm (bindings C/C++). `--no-cache` évite de garder l’index apk dans l’image pour la réduire. |
| 5 | `COPY package.json package-lock.json ./` | Copie les manifestes npm pour installer **exactement** les versions verrouillées par `package-lock.json`. |
| 6 | `COPY prisma ./prisma` | Copie le schéma et les fichiers Prisma nécessaires avant `npm ci` si des scripts post-install ou des générateurs en ont besoin. |
| 7 | `COPY prisma.config.ts ./prisma.config.ts` | Copie la config Prisma TypeScript au bon endroit dans l’image. |
| 8 | `RUN npm ci` | Installe les dépendances en mode **reproductible** (lecture stricte du lockfile), adapté au CI et aux builds Docker. |

---

## Étape 2 : `builder` — compilation

| Ligne | Commande | Utilité |
|-------|----------|---------|
| 10 | `FROM node:20-alpine AS builder` | Nouvelle étape à partir d’Alpine/Node 20 ; l’historique de l’étape `deps` ne s’accumule pas dans cette couche (build propre). |
| 11 | `WORKDIR /app` | Même répertoire de travail `/app`. |
| 12 | `COPY --from=deps /app/node_modules ./node_modules` | Réutilise les `node_modules` déjà installés sans refaire `npm ci` ici. |
| 13 | `COPY . .` | Copie le **code source** du contexte de build (respecte `.dockerignore`). |
| 14 | `RUN npx prisma generate` | Génère le **client Prisma** à partir du schéma (fichiers utilisés au runtime). |
| 15 | `RUN npm run build` | Lance le script de build du projet (typiquement **Next.js** : compilation `.next`, optimisations). |

---

## Étape 3 : `runner` — image de production

| Ligne | Commande | Utilité |
|-------|----------|---------|
| 17 | `FROM node:20-alpine AS runner` | Image finale **sans** les couches de build intermédiaires inutiles (sources complètes, outils de build superflus), si on ne copie que le nécessaire. |
| 18 | `WORKDIR /app` | Répertoire de travail pour l’application en production. |
| 19 | `ENV NODE_ENV=production` | Indique à Node et aux frameworks (ex. Next) le mode **production** (optimisations, moins de logs de debug). |
| 20 | `ENV PORT=3000` | Port d’écoute attendu par l’application (souvent lu par Next). |
| 21 | `RUN addgroup -S nextjs && adduser -S nextjs -G nextjs` | Crée un groupe et un utilisateur système **non-root** `nextjs` pour limiter les risques si un processus est compromis. |
| 22–28 | `COPY --from=builder ...` | Copie depuis l’étape `builder` uniquement ce qui est nécessaire au **démarrage** : `package.json`, lockfile, `node_modules`, build `.next`, assets `public`, Prisma et `next.config.*`. |
| 29 | `COPY --from=builder /app/next.config.* ./` | Copie le ou les fichiers de configuration Next (`next.config.js`, `next.config.mjs`, etc.) selon ce qui existe dans le projet. |
| 30 | `RUN mkdir -p /app/data && chown -R nextjs:nextjs /app` | Crée un dossier pour les données persistantes (ex. SQLite) et donne la propriété de `/app` à `nextjs` pour que le processus puisse écrire sans être root. |
| 31 | `USER nextjs` | Les commandes suivantes (dont `CMD`) s’exécutent en tant qu’utilisateur **nextjs**, pas en root. |
| 32 | `EXPOSE 3000` | **Documentation** : indique que le conteneur écoute sur le port 3000 ; ne publie pas le port seul (il faut `-p` avec `docker run` ou équivalent dans Compose). |
| 33 | `CMD ["sh","-c","npx prisma migrate deploy && npm run start"]` | Commande par défaut au démarrage : applique les **migrations Prisma** sur la base, puis lance **`npm run start`** (serveur Next en production). Le `sh -c` permet d’enchaîner deux commandes dans un seul `CMD`. |

---

## Résumé

1. **`deps`** : installer les paquets npm de façon reproductible, avec les outils natifs Alpine si besoin.  
2. **`builder`** : générer Prisma et construire l’application.  
3. **`runner`** : image allégée, utilisateur non privilégié, uniquement les artefacts nécessaires, démarrage avec migrations puis serveur.

Pour aller plus loin : [documentation Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/).
