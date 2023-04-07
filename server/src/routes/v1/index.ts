import { Router } from "express";
import auth from "./routes"
import addBook from "./routes"

const router = Router();

router.use("/api", auth);
router.use("/api/book", addBook);

export default router;