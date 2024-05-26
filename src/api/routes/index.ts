import authRoutes from "./auth";
import userRoutes from "./user";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;