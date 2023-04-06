import { User } from "./User.model";

export interface Book {
  id: number;
  title: String;
  author: User[];
  userId: number;
  body: String;
  createdAt: Date;
}
