import 'reflect-metadata';
import dotenv from "dotenv";
import { createApp } from "./app.ts";

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

dotenv.config({ path: "./src/.env" });
const PORT = parseInt(process.env.PORT!) || 8000;

const app = await createApp();

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});