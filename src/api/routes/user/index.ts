import { Router } from "express";
import { getUser } from "../../controllers/user";

const router = Router();

router.get("/profile", getUser);

export default router;