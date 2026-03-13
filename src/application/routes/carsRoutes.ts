import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCar,
  getCars,
  updateCar,
  updateFieldCar,
} from "../controllers/carsController.ts";

const carsRoutes: Router = Router();

carsRoutes.get("/", getCars);
carsRoutes.post("/", createCar);

carsRoutes
  .route("/:id")
  .get(getCar)
  .put(updateCar)
  .patch(updateFieldCar)
  .delete(deleteCar);

export default carsRoutes;
