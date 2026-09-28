# ChatFlow 💬

**ChatFlow** est un backend d'application de messagerie en temps réel performant et évolutif, développé avec **NestJS**, **Prisma ORM** et **WebSockets (Socket.io)**.

---

## 🚀 Stack Technique

- **Framework Backend :** [NestJS](https://nestjs.com/) (v11)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **ORM & Base de données :** [Prisma](https://www.prisma.io/)
- **Communication en temps réel :** [WebSockets / Socket.io](https://socket.io/) (`@nestjs/websockets`, `@nestjs/platform-socket.io`)
- **Authentification & Sécurité :** JWT (`@nestjs/jwt`), Passport (`@nestjs/passport`), Bcrypt (`bcrypt`)
- **Validation des données :** `class-validator`, `class-transformer`
- **Tests :** [Jest](https://jestjs.io/) & Supertest

---

## ✨ Fonctionnalités Prévues & Clés

- 🔐 **Authentification Sécurisée :** Inscription, connexion, hachage de mot de passe et génération de tokens JWT.
- 💬 **Messagerie en Temps Réel :** Connexions bi-directionnelles via WebSockets (Socket.io) pour l'envoi et la réception de messages instantanés.
- 🗄️ **Gestion des Données :** Modélisation et requêtes optimisées via Prisma ORM.
- 🛡️ **Validation & DTOs :** Contrôle strict des entrées grâce aux décorateurs de validation.
- 🧪 **Suite de Tests :** Tests unitaires et tests de bout en bout (E2E) préconfigurés.

---

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [npm](https://www.npmjs.com/) (v9 ou supérieur) ou `yarn` / `pnpm`

---

## ⚙️ Installation & Configuration

1. **Cloner le projet** (si applicable) ou naviguer dans le dossier du projet :
   ```bash
   cd chatflow
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement :**
   Créer un fichier `.env` à la racine du projet et configurer les variables nécessaires (base de données, secret JWT, etc.) :
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/chatflow?schema=public"
   JWT_SECRET="votre_secret_jwt_tres_securise"
   ```

4. **Générer le client Prisma :**
   ```bash
   npx prisma generate
   ```

---

## 🏃 Lancement de l'Application

### Mode Développement (avec hot-reload)
```bash
npm run start:dev
```

### Mode Production
```bash
# Compiler le projet
npm run build

# Démarrer en production
npm run start:prod
```

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests de couverture (coverage)
npm run test:cov

# Tests E2E (End-to-End)
npm run test:e2e
```

---

