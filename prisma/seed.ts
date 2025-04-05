import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Seeding users...");

    await prisma.user.createMany({
      data: [
        { email: "admin@servihub.com", role: "admin", name: "Admin User" },
        { email: "user1@servihub.com", name: "User One" }, // role defaults to 'user'
      ],
    });

    console.log("🌱 Seeding reports...");

    await prisma.report.create({
      data: {
        type: "review",
        target_id: 101,
        reason: "Spam content",
        submitted_by: 2, // assumes this user ID exists
      },
    });

    console.log("✅ Database seeding complete.");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
