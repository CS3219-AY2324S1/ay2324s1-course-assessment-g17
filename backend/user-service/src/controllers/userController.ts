import prisma from "../lib/prisma";
import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("error fetching users:", error);
    res.status(500).json({ error: "error fetching users" });
  }
}

export async function getLanguages(req: Request, res: Response) {
  try {
    const languages = await prisma.language.findMany();
    res.json(languages);
  } catch (error) {
    console.error("error fetching languages:", error);
    res.status(500).json({ error: "error fetching languages" });
  }
}
