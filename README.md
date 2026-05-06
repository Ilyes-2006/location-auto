# 🏎️ Auto-Loc | Premium Car Rental Extranet

> Un Système d'Information (SI) nouvelle génération pour la gestion de flotte, propulsé par React et Supabase, avec une interface futuriste "Antigravity".

[![Déployé sur Vercel](https://location-auto-wine.vercel.app/)]
[![React](https://github.com/Ilyes-2006/location-auto.git)]
[![Supabase](https://supabase.com/dashboard/project/uabcaiimvohnjvjorpll)]
---

## 📦 Documentation & Synthèse
Pour une compréhension approfondie de la conception du système, des choix technologiques et des diagrammes de flux, veuillez consulter le document de synthèse officiel :

👉 **[Cliquez ici pour consulter le PDF de Synthèse (Google Drive)](https://drive.google.com/drive/folders/1HY6Wv3RCjTfu_qYHdRzA4DLDx-enNG6t?usp=drive_link)**

---

## 📑 Table des Matières
1. [Résumé Exécutif](#-résumé-exécutif)
2. [Design : L'esthétique "Antigravity"](#-design--lesthétique-antigravity)
3. [Logique Métier & Accès](#-logique-métier--accès)
4. [Architecture des Données (Supabase)](#-architecture-des-données-supabase)
5. [Sécurité & CI/CD](#-sécurité--cicd)
6. [Installation & Configuration](#-installation--configuration)
7. [Identifiants de Test](#-identifiants-de-test)

---

## 📖 Résumé Exécutif
**Auto-Loc** est un projet réalisé dans le cadre du module "Build & Ship". Il s'agit d'un extranet professionnel permettant de gérer le cycle de vie complet d'une location de véhicule : de la consultation libre du catalogue à la validation administrative des dossiers de réservation.

## 🎨 Design : L'esthétique "Antigravity"
Le frontend utilise un système de design personnalisé baptisé **"Antigravity & Aero-Glass"** :
* **Composants flottants :** Utilisation de l'ombre portée profonde (`shadow-2xl`) et de `Framer Motion` pour donner un effet de lévitation aux cartes de véhicules.
* **Effet Glassmorphism :** Interfaces en verre dépoli (`backdrop-blur`) pour une navigation moderne, épurée et immersive.
* **Transitions fluides :** Animations de présence pour éviter les coupures visuelles entre les pages.

## 👥 Logique Métier & Accès
L'application gère trois états d'utilisateurs distincts sans complexité de rôles superflus :

* **🌍 Visiteur (Non connecté) :** Peut consulter librement le catalogue de voitures. Toute tentative de réservation déclenche une interception vers l'interface de connexion.
* **👤 Client (Connecté) :** Peut soumettre des demandes de réservation. **Condition impérative :** L'utilisateur doit uploader une photo de son permis de conduire pour finaliser sa demande (Gestion des médias).
* **🛡️ Super-utilisateur (Admin) :** Identifié par l'email `i_salahouelhadj@estin.dz`. Accède à une vue globale permettant de confirmer ou refuser les réservations en attente (Mise à jour de la Table C).

## 🗄️ Architecture des Données (Supabase)
Le backend repose sur une structure relationnelle optimisée (Tables A, B, C) :
* **Table A (Users or Customers) :** Gérée via l'authentification native de Supabase.
* **Table B (Inventories) :** Base de données des véhicules (Marque, Modèle, Prix, Disponibilité).
* **Table C (Reservations) :** Table de jonction gérant les dates, le lien vers le fichier du permis et le statut (`pending` / `confirmed`/ `canceled`).

## ⚙️ Sécurité & CI/CD (DevOps)
* **Authentification :** Gestion par tokens JWT.
* **Sécurité des données :** Row Level Security (RLS) activé pour garantir que les clients ne voient que leurs propres réservations.
* **Déploiement Continu :** Flux automatisé entre **GitHub** et **Vercel**. Chaque modification poussée en ligne est immédiatement déployée sur l'environnement de production.

## 💻 Installation & Configuration

1. **Clonage :** `git clone https://github.com/votre-username/auto-loc.git`
2. **Installation :** `npm install`
3. **Variables d'environnement (.env.local) :**
   ```env
   VITE_SUPABASE_URL=https://uabcaiimvohnjvjorpll.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYmNhaWltdm9obmp2am9ycGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI5NTUsImV4cCI6MjA5MzQ5ODk1NX0.oputlInK1fJEZwRx_J93kgEd-1lV4xiWEWJq8m1HmA0
   ```
4. **Lancement du serveur :** `npm run dev`

## 🔑 Identifiants de Test
* **Compte Admin (Superuser) :** `i_salahouelhadj@estin.dz` (mot de passe : `ilyesadmin123`)
* **Compte Client (Test) :** `salahilyes194@gmail.com` (mot de passe : `ilyes123`).
