import { Router, type Request, type Response } from "express";
import userRouters from "../../../user/infrastructure/routes/userRoutes.ts";
import authRouter from "../../../auth/infrastructure/routes/authRoutes.ts";
import vehicleRoutes from "../../../vehicle/infrastructure/routes/vehicleRoutes.ts";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Api Street Race X");
});

router.use("/api/users", userRouters);
router.use("/api/auth", authRouter);
/* router.use("/vehicles", vehicleRoutes); */

export default router;
