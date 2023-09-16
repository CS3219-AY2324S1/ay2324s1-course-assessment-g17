import prisma from "../../lib/prisma";

async function seed() {
  try {
    // Seed the User and Language tables
    const user1 = await prisma.user.create({
      data: {
        username: "admin_user",
        email: "admin@example.com",
        password: "admin_password",
        role: "ADMIN",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        username: "regular_user",
        email: "user@example.com",
        password: "user_password",
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

    await prisma.userLanguage.create({
      data: {
        user_id: user1.id,
        language_id: pythonLanguage.id, 
      },
    });

    await prisma.userLanguage.create({
      data: {
        user_id: user2.id,
        language_id: javaLanguage.id, 
      },
    });

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
