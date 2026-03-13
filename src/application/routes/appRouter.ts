import { Router, type Request, type Response } from "express";
import carsRoutes from "./carsRoutes.ts";

const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Api Street Race X");
});

router.use("/cars", carsRoutes);

export default router;
