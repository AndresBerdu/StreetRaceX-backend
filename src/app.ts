import express, { type Application } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initFirebase } from "./main/infrastructure/config/firebaseAdmin.ts";

/* Function for create a App express */
export const createApp = async () => {
  // ✅ Firebase se inicializa PRIMERO, antes de cargar cualquier repositorio
  initFirebase();

  // ✅ Import dinámico: se ejecuta DESPUÉS de initFirebase()
  const { default: router } = await import("./main/infrastructure/routes/appRouter.ts");

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