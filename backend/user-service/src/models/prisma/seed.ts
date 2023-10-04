import prisma from "../../lib/prisma";
import { hashPassword } from "../../utils/auth";

async function seed() {
  try {
    // Seed the User and Language tables
    await prisma.user.deleteMany();
    await prisma.language.deleteMany();

    const user1 = await prisma.user.create({
      data: {
        username: "admin_user",
        email: "admin@example.com",
        password: hashPassword("admin_password"),
        role: "ADMIN",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        username: "regular_user",
        email: "user@example.com",
        password: hashPassword("user_password"),
        role: "USER",
      },
    });

    const javaLanguage = await prisma.language.create({
      data: { language: "Java" },
    });

    const pythonLanguage = await prisma.language.create({
      data: { language: "Python" },
    });

    const cPlusPlusLanguage = await prisma.language.create({
      data: { language: "C++" },
    });

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
