import prisma from "../../lib/prisma";
import { hashPassword } from "../../utils/auth";

export enum EditorLanguageEnum {
  javascript = "javascript",
  typescript = "typescript",
  python = "python",
  java = "java",
  c = "c",
  cpp = "cpp",
  clojure = "clojure",
  csharp = "csharp",
  dart = "dart",
  elixir = "elixir",
  fsharp = "fsharp",
  go = "go",
  julia = "julia",
  kotlin = "kotlin",
  lua = "lua",
  mips = "mips",
  mysql = "mysql",
  objectivec = "objective-c",
  pascal = "pascal",
  perl = "perl",
  php = "php",
  text = "text",
  pgsql = "pgsql",
  r = "r",
  ruby = "ruby",
  rust = "rust",
  scala = "scala",
  sql = "sql",
  swift = "swift",
}

const languages = Object.keys(EditorLanguageEnum);

async function clearLanguageTable() {
  await prisma.language.deleteMany({});
}

async function addLanguages() {
  const languages = Object.keys(EditorLanguageEnum);

  for (const language of languages) {
    await prisma.language.create({
      data: {
        language: language,
      },
    });
  }
}

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
  clearLanguageTable();
  addLanguages();
}

seed();
