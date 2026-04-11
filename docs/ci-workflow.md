# Workflow GitHub Actions — `.github/workflows/ci.yml`

Ce workflow automatise l’intégration continue sur la branche `**main**` : installation des dépendances, génération Prisma, build Next.js, puis construction et publication d’images Docker vers **GitHub Container Registry (GHCR)**.

---

## Déclenchement (`on`)


| Élément                         | Signification                                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `push` sur `branches: ["main"]` | Le workflow s’exécute à chaque **push** sur la branche `main` uniquement (pas sur les autres branches ni sur les PR, sauf si tu ajoutes `pull_request`). |


---

## Permissions


| Permission | Valeur  | Rôle                                                                          |
| ---------- | ------- | ----------------------------------------------------------------------------- |
| `contents` | `read`  | Lecture du dépôt pour le checkout (suffisant pour cloner et builder).         |
| `packages` | `write` | Autorise la **publication** d’images/conteneurs sur GHCR avec `GITHUB_TOKEN`. |


Sans `packages: write`, le `docker push` vers `ghcr.io` échouerait en général.

---

## Job `build`


| Étape / instruction                             | Rôle                                                                                                            |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `runs-on: ubuntu-latest`                        | Machine virtuelle GitHub hébergée sous Ubuntu récente.                                                          |
| `actions/checkout@v4`                           | Récupère le code du dépôt dans le répertoire de travail du job.                                                 |
| `actions/setup-node@v4` avec `node-version: 20` | Installe Node.js **20** (aligné avec le `Dockerfile` `node:20-alpine`).                                         |
| `npm ci`                                        | Installation reproductible des dépendances depuis `package-lock.json`.                                          |
| `npx prisma generate`                           | Génère le client Prisma (comme en build Docker).                                                                |
| `npm run build`                                 | Build de l’application (ex. Next.js). Si cette étape échoue, le job s’arrête et **aucune image n’est poussée**. |


### Connexion à GHCR (`Login GHCR`)


| Paramètre  | Valeur                        | Rôle                                                                                          |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| Action     | `docker/login-action@v3`      | Authentifie Docker auprès d’un registre.                                                      |
| `registry` | `ghcr.io`                     | **GitHub Container Registry**.                                                                |
| `username` | `${{ github.actor }}`         | Utilisateur GitHub qui a déclenché le workflow.                                               |
| `password` | `${{ secrets.GITHUB_TOKEN }}` | Jeton fourni par GitHub pour ce job ; avec `packages: write`, permet de pousser des packages. |


### Build et push (`Build & Push`)

Deux tags sont construits à partir du même build, puis poussés :


| Tag                                                            | Signification                                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ghcr.io/${{ github.repository }}:latest`                      | Image canonique : `ghcr.io/<propriétaire>/<nom-du-dépôt>:latest`. Visible sous **Packages** du dépôt GitHub.                                     |
| `ghcr.io/${{ github.repository_owner }}/task-manager-2:latest` | **Alias** fixe `task-manager-2` : utile si un `docker-compose` sur un VPS ou un script référence encore ce chemin au lieu du nom exact du dépôt. |


Les deux tags pointent vers la **même** image (même digest après push).

---

## Résumé du flux

1. Push sur `main` → workflow démarré.
2. Node 20 → `npm ci` → Prisma → build applicatif (validation que le projet compile).
3. Login GHCR → `docker build` (racine du dépôt, même `Dockerfile` qu’en local) → `docker push` des deux tags.

---

## Liens

- Compose local : [docker-compose.md](./docker-compose.md).  
- Détail du Dockerfile : [dockerfile.md](./dockerfile.md).  
- Documentation GitHub : [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions), [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

