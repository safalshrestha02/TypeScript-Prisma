import { Router } from "express";
import { register, login } from "../../controller/authController";
import { addBook } from "../../controller/bookController";
import { registerSchema } from "../../utils/registerValidator";
import { registerValidation } from "../../middleware/checkEmail";

const router = Router();

router.post("/register", registerSchema, registerValidation, register);
router.post("/login", login);

router.post("/addBook", addBook);

export default router;
