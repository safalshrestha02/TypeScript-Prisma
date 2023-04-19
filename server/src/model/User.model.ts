import { Role } from "@prisma/client";

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role | undefined;
}
