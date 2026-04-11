# docker-compose.yml — référence

Ce fichier orchestre le conteneur de l’application en local (ou sur une machine de déploiement) : build depuis le `Dockerfile`, exposition du port, base SQLite persistante via un volume nommé.

---

## Structure

### `services.app`

| Clé | Valeur | Rôle |
|-----|--------|------|
| `build: .` | Répertoire courant | Construit l’image à partir du **`Dockerfile`** à la racine du dépôt (pas d’image pré-tirée du registre dans ce fichier). |
| `ports` | `"3000:3000"` | Publie le port **3000** du conteneur sur le port **3000** de l’hôte (`hôte:conteneur`). L’app est accessible sur `http://localhost:3000`. |
| `environment.DATABASE_URL` | `file:/app/data/tasks.db` | URL Prisma pour **SQLite** : fichier dans `/app/data` à l’intérieur du conteneur. Doit correspondre au schéma Prisma et au `CMD` du Dockerfile (dossier `/app/data` créé et accessible par l’utilisateur `nextjs`). |
| `volumes` | `app_data:/app/data` | Monte un **volume nommé** Docker `app_data` sur `/app/data` : la base `tasks.db` **survit** aux `docker compose down` (sans `-v`) et aux recréations de conteneur. |

### `volumes.app_data`

Déclare le volume nommé **`app_data`**. Docker le gère ; les données restent sur l’hôte dans l’espace de stockage des volumes (emplacement dépend de Docker / Docker Desktop).

---

## Commandes utiles

- Démarrer en arrière-plan : `docker compose up -d`
- Voir les logs : `docker compose logs -f app`
- Arrêter : `docker compose down`
- Supprimer aussi les données SQLite : `docker compose down -v` (attention : efface le volume `app_data`)

---

## Liens

- Image construite par ce compose : voir le **`Dockerfile`** à la racine et [dockerfile.md](./dockerfile.md).
- Pour utiliser une image pré-construite (ex. GHCR) au lieu de `build: .`, il faudrait remplacer `build` par `image: ...` — voir [ci-workflow.md](./ci-workflow.md) pour les tags poussés en CI.
