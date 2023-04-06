import { Router } from "express";
const router = Router();
import auth from "./routes"
import addBook from "./routes"

router.use("/api", auth);
router.use("/api/book", addBook);

export default router;