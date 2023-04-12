import { Router } from "express";
import {
  register,
  login,
  getAllUser,
  activeUser,
} from "../../controller/authController";
import { addBook, getAllBooks } from "../../controller/bookController";
import { registerSchema } from "../../utils/registerValidator";
import { registerValidation } from "../../middleware/checkEmail";
import { searchPaginationSortMiddleware } from "../../middleware/pagination";

import verifyJWT from "../../middleware/verifyJWT";

const router = Router();

router.get(
  "/user",
  searchPaginationSortMiddleware({
    model: "User",
    searchableFields: ["name", "email"],
  }),
  getAllUser
);
router.get(
  "/books",
  searchPaginationSortMiddleware({
    model: "Book",
    searchableFields: ["title", "body"],
  }),
  getAllBooks
);

router.post("/register", registerSchema, registerValidation, register);
router.post("/login", login);
router.post("/addBook/:id", verifyJWT, addBook);
router.post("/me", verifyJWT, activeUser);

export default router;
