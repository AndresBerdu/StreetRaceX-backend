import { Router, type Request, type Response } from "express";
import userRouters from "../../../user/infrastructure/routes/userRoutes.ts";
import authRouter from "../../../auth/infrastructure/routes/authRoutes.ts";
import vehicleRoutes from "../../../vehicle/infrastructure/routes/vehicleRoutes.ts";
import { validateToken } from "../../../auth/infrastructure/middlewares/token/validateTokenMiddleware.ts";
import { validateSlugToken } from "../../../auth/infrastructure/middlewares/token/validateSlugTokenMiddleware.ts";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Api Street Race X");
});

router.use("/api/auth", authRouter);
router.use("/api/users", validateToken, userRouters);
router.use("/api/vehicles", validateToken, vehicleRoutes);

export default router;
