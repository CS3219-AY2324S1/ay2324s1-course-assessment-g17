import { User, UserLanguage, Language } from "@prisma/client";
import prisma from "../../lib/prisma";

async function seed(): Promise<void> {
  const users = [
    {
      username: "admin_user",
      password: "admin_password",
      role: "ADMIN",
    },
    {
      username: "regular_user",
      password: "user_password",
      role: "USER",
    },
  ];

  const programmingLanguages = [
    { language: "Java" },
    { language: "Python" },
    { language: "C++" },
  ];

  const userLanguages = [
    {
      user_id: 1,
      language_id: 2,
    },
    {
      user_id: 2,
      language_id: 1,
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData as User,
    });
  }

  for (const languageData of programmingLanguages) {
    await prisma.language.create({
      data: languageData as Language,
    });
  }

  for (const userLanguageData of userLanguages) {
    await prisma.userLanguage.create({
      data: userLanguageData as UserLanguage,
    });
  }
}

async function main() {
  try {
    console.log("creating default database...");
    await seed();
    console.log("database seeded");
  } catch (error) {
    console.error("error with db", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
