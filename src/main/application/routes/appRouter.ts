import { Router, type Request, type Response } from "express";
import userRouters from "../../../user/infrastructure/routes/userRoutes.ts";
import authRouter from "../../../auth/infrastructure/routes/authRoutes.ts";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Api Street Race X");
});

router.use("/users", userRouters);
router.use("/auth", authRouter);

export default router;
