import { Router } from "express";
import {
  register,
  login,
  getAllUser,
  getAllBooks,
} from "../../controller/authController";
import { addBook } from "../../controller/bookController";
import { registerSchema } from "../../utils/registerValidator";
import { registerValidation } from "../../middleware/checkEmail";
import { searchPaginationSortMiddleware } from "../../middleware/pagination";

const router = Router();

router.get(
  "/user",
  searchPaginationSortMiddleware({
    model: "User",
    searchableFields: ["name", "email"],
  }),
  getAllUser
);
router.get("/books", getAllBooks);

router.post("/register", registerSchema, registerValidation, register);

router.post("/login", login);

router.post("/addBook", addBook);

export default router;
