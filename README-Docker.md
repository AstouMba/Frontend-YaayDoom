# Guide Docker

Ce projet est séparé en deux piles Docker:

- le front à la racine du dépôt
- le backend dans `Backend-Yaaydoom/`

Le backend se connecte à PostgreSQL Neon via le fichier `.env` Laravel déjà en place.

## Organisation du projet

- Front production: [docker-compose.yml](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/docker-compose.yml)
- Front développement: [docker-compose.dev.yml](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/docker-compose.dev.yml)
- Dockerfile front: [Dockerfile](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Dockerfile)
- Dockerfile front dev: [Dockerfile.dev](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Dockerfile.dev)
- Configuration Nginx front: [docker/nginx.conf](/home/boombaye/- Backend production: [Backend-Yaaydoom/docker-compose.yml](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Backend-Yaaydoom/docker-compose.yml)
- Backend développement: [Backend-Yaaydoom/docker-compose.dev.yml](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Backend-Yaaydoom/docker-compose.dev.yml)
- Dockerfile backend: [Backend-Yaaydoom/Dockerfile](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Backend-Yaaydoom/Dockerfile)
- Entrypoint backend: [Backend-Yaaydoom/docker/backend-entrypoint.sh](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Backend-Yaaydoom/docker/backend-entrypoint.sh)

## Mode production

### Frontend

Construire et lancer le conteneur front en production:

```bash
docker compose -f docker-compose.yml up -d --build
```

Adresse par défaut:

- `http://localhost:3000`

### Backend

Construire et lancer le conteneur backend en production:

```bash
cd Backend-Yaaydoom
docker compose -f docker-compose.yml up -d --build
```

Adresse par défaut:

- `http://localhost:8000`

Le backend utilise Neon via le fichier `.env` et expose l’API sous:

- `http://localhost:8000/api`

## Mode développement

### Frontend

Lancer le front en mode développement Vite:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Adresse par défaut:

- `http://localhost:3000`

Ce mode utilise:

- le rechargement à chaud via Vite
- le code monté en volume
- `VITE_API_BASE_URL=http://localhost:8010/api`

### Backend

Lancer le backend en mode développement:

```bash
cd Backend-Yaaydoom
docker compose -f docker-compose.dev.yml up -d --build
```

Adresse par défaut:

- `http://localhost:8010`

Le backend en dev utilise:

- le code monté en volume
- `php artisan serve`
- la même configuration Neon que le reste du projet

## Notes

- Le conteneur backend utilise PHP 8.4 car le lock Composer contient des paquets qui demandent PHP 8.4.
- `pdo_pgsql` est installé dans l’image backend pour permettre à Laravel de se connecter à PostgreSQL Neon.
- Le CORS est configuré pour les origines du front Docker dans [Backend-Yaaydoom/config/cors.php](/home/boombaye/Documents/YaayDoom+/project-yaaydoom+/Backend-Yaaydoom/config/cors.php).
- L’entrypoint backend nettoie les caches Laravel et peut lancer les migrations si `RUN_MIGRATIONS=true`.

## Commandes utiles

Depuis la racine du dépôt:

```bash
# Frontend
docker compose -f docker-compose.yml config
docker compose -f docker-compose.dev.yml config
docker compose down

# Backend
cd Backend-Yaaydoom && docker compose -f docker-compose.yml config
cd Backend-Yaaydoom && docker compose -f docker-compose.dev.yml config
cd Backend-Yaaydoom && docker compose down
```

## Ports actuels

- Front production: `3000`
- Backend production: `8000`
- Front développement: `3000`
- Backend développement: `8010`
