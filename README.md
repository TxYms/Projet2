# EduBibliothèque – Testez et améliorez une application existante

Projet OpenClassrooms (parcours Architecte Logiciel).

L'application permet aux agents d'une bibliothèque de se connecter et de gérer les étudiants (ajout, consultation, modification, suppression).

## Organisation du dépôt

| Dossier | Contenu |
| --- | --- |
| `back/` | API Spring Boot 3.5 (Java 21), base MySQL lancée avec Docker Compose |
| `front/` | Application Angular 19 |
| `rapports/` | Rapports de couverture et résultats des tests (back, front et E2E) |

## Fonctionnalités ajoutées

- Correction de l'API de connexion `POST /api/login` et génération d'un token JWT
- Écran de connexion dans le front
- API CRUD des étudiants `/api/students`, protégée par le token (header `Authorization: Bearer`)
- Écrans de gestion des étudiants (liste, détail, ajout, modification, suppression), protégés par un guard Angular

## Lancer l'application

Prérequis : JDK 21, Maven, Node.js, Docker Desktop.

**Back-end**

1. Copier `back/.env.example` en `back/.env` et renseigner `JWT_SECRET` (une clé Base64 de 256 bits).
2. Lancer Docker Desktop.
3. Dans `back/` : `./mvnw spring-boot:run` (API sur http://localhost:8080)

**Front-end**

Dans `front/` : `npm install` puis `npm run start` (application sur http://localhost:4200)

## Lancer les tests

| Tests | Commande | Rapport |
| --- | --- | --- |
| Back : unitaires (JUnit, Mockito) et intégration (MockMvc, Testcontainers) | dans `back/` : `./mvnw clean verify` (Docker lancé) | `back/target/site/jacoco/index.html` |
| Front : unitaires et intégration (Jest) | dans `front/` : `npx jest` | `front/coverage/lcov-report/index.html` |
| E2E (Cypress, API simulée avec `cy.intercept`) | dans `front/` : `npm run e2e` | `front/coverage-e2e/index.html` |

Le seuil de couverture est fixé à 80 % des lignes : le build échoue en dessous (JaCoCo pour le back, Jest pour le front, nyc pour les E2E).

## Résultats

| Tests | Nombre | Couverture des lignes | Rapport |
| --- | --- | --- | --- |
| Back (unitaires + intégration) | 25 | 87,6 % | `rapports/back-jacoco/index.html` (résultats des tests : `rapports/back-tests/`) |
| Front Jest (unitaires + intégration) | 22 | 81,9 % | `rapports/front-jest/index.html` |
| E2E Cypress | 4 scénarios | 83,4 % | `rapports/front-e2e/index.html` |
