import { User } from "../../middleware/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
