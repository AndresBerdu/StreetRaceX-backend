import dotenv from "dotenv";
import { createApp } from "./app.ts";

/* 🔥 DEBUG GLOBAL */
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

/* Configs */
dotenv.config({ path: "./src/.env" });
const PORT = parseInt(process.env.PORT!) || 3000;

/* Inicializer App */
export const app = createApp();

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});