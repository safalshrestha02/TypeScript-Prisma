import { Router } from "express";
import auth from "./routes";

const router = Router();

router.use("/api", auth);

export default router;
