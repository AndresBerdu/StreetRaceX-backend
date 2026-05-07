import express, { type Application } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./main/infrastructure/config/firebaseAdmin.ts";
import router from "./main/infrastructure/routes/appRouter.ts";

/* Function for create a App express */
export const createApp = () => {
  const app: Application = express();

  /* Middlewares */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );
  app.use(router);

  return app;
};