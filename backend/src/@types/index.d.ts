import { User } from "../databases/entities/user.entity";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}
