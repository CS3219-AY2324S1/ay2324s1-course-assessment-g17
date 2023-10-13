import Pair from "../models/pair";
import { Request, Response } from "express";

export const checkAuthorisedUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;

  try {
    const pairs = await Pair.find({ room_id: roomId });
    const userOneId = pairs[0].userOne;
    const userTwoId = pairs[0].userTwo;
    if (userId === String(userOneId) || userId === String(userTwoId)) {
      res.json({ authorised: true });
    } else {
      res.json({ authorised: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

