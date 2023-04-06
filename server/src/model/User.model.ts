import { Book } from "./Book.model";

export interface User {
  id: number;
  name: String;
  email: String;
  passwod: String;
  Book: Book[];
}
