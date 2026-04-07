import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const url = `file:${path.join(process.cwd(), process.env["DB_NAME"] || "tasks.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Nettoyage des données existantes
  await prisma.tasks.deleteMany();
  await prisma.user.deleteMany();

  // Création des utilisateurs
  const alice = await prisma.user.create({
    data: { name: "Alice Dupont", email: "alice.dupont@example.com" },
  });
  const bob = await prisma.user.create({
    data: { name: "Bob Martin", email: "bob.martin@example.com" },
  });
  const claire = await prisma.user.create({
    data: { name: "Claire Moreau", email: "claire.moreau@example.com" },
  });
  const david = await prisma.user.create({
    data: { name: "David Leroy", email: "david.leroy@example.com" },
  });

  // Création des tâches
  const now = new Date();
  const past = (days: number) => new Date(now.getTime() - days * 86400000);
  const future = (days: number) => new Date(now.getTime() + days * 86400000);

  await prisma.tasks.createMany({
    data: [
      // Tâches PENDING
      {
        title: "Rédiger le cahier des charges",
        description: "Définir les exigences fonctionnelles et non-fonctionnelles du projet task-manager.",
        status: "PENDING",
        priority: "HIGH",
        due_date: future(7),
        user_id: alice.id,
        created_by_id: alice.id,
      },
      {
        title: "Configurer l'environnement CI/CD",
        description: "Mettre en place GitHub Actions pour les tests et le déploiement automatique.",
        status: "PENDING",
        priority: "MEDIUM",
        due_date: future(14),
        user_id: bob.id,
        created_by_id: alice.id,
      },
      {
        title: "Créer les maquettes UI",
        description: "Concevoir les wireframes pour les pages principales de l'application.",
        status: "PENDING",
        priority: "LOW",
        due_date: future(10),
        user_id: claire.id,
        created_by_id: claire.id,
      },
      {
        title: "Rédiger la documentation API",
        description: null,
        status: "PENDING",
        priority: "LOW",
        due_date: null,
        user_id: david.id,
        created_by_id: bob.id,
      },
      // Tâches en retard (PENDING, due_date dépassée)
      {
        title: "Corriger le bug d'affichage mobile",
        description: "Le menu de navigation déborde sur les petits écrans (< 375px).",
        status: "PENDING",
        priority: "HIGH",
        due_date: past(3),
        user_id: bob.id,
        created_by_id: bob.id,
      },

      // Tâches IN_PROGRESS
      {
        title: "Intégrer l'authentification JWT",
        description: "Implémenter la connexion et la gestion des sessions avec JSON Web Tokens.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        due_date: future(5),
        user_id: alice.id,
        created_by_id: alice.id,
      },
      {
        title: "Développer la page de liste des tâches",
        description: "Afficher les tâches avec filtres par statut, priorité et utilisateur assigné.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        due_date: future(2),
        user_id: bob.id,
        created_by_id: alice.id,
      },
      {
        title: "Optimiser les requêtes Prisma",
        description: "Analyser et améliorer les performances des requêtes sur la base de données SQLite.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        due_date: future(8),
        user_id: claire.id,
        created_by_id: claire.id,
      },
      {
        title: "Ajouter la pagination",
        description: null,
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        due_date: future(6),
        user_id: david.id,
        created_by_id: david.id,
      },

      // Tâches COMPLETED
      {
        title: "Initialiser le projet Next.js",
        description: "Créer la structure de base du projet avec TypeScript, Tailwind CSS et Prisma.",
        status: "COMPLETED",
        priority: "HIGH",
        due_date: past(20),
        completed_at: past(22),
        user_id: alice.id,
        created_by_id: alice.id,
      },
      {
        title: "Configurer la base de données SQLite",
        description: "Installer et configurer better-sqlite3 avec l'adaptateur Prisma.",
        status: "COMPLETED",
        priority: "HIGH",
        due_date: past(18),
        completed_at: past(19),
        user_id: bob.id,
        created_by_id: alice.id,
      },
      {
        title: "Créer le modèle de données User",
        description: "Définir le modèle User dans le schéma Prisma et effectuer la migration.",
        status: "COMPLETED",
        priority: "MEDIUM",
        due_date: past(10),
        completed_at: past(10),
        user_id: claire.id,
        created_by_id: bob.id,
      },
      {
        title: "Mettre en place le layout principal",
        description: "Créer le composant Nav et le layout avec les polices Geist.",
        status: "COMPLETED",
        priority: "LOW",
        due_date: past(8),
        completed_at: past(9),
        user_id: david.id,
        created_by_id: david.id,
      },
      {
        title: "Déployer l'environnement de développement",
        description: null,
        status: "COMPLETED",
        priority: "MEDIUM",
        due_date: past(15),
        completed_at: past(14),
        user_id: alice.id,
        created_by_id: claire.id,
      },
    ],
  });

  const count = await prisma.tasks.count();
  console.log(`✓ Base de données alimentée : ${count} tâches créées pour 4 utilisateurs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

