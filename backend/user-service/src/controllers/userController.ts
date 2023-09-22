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

// TODO
