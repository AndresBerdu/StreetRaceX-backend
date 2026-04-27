import dotenv from "dotenv";
import { createApp } from "./app.ts";

/* Configs */
dotenv.config({ path: "./src/.env" });
const PORT = parseInt(process.env.PORT!) || 3000;

/* Inizializer App */
const app = createApp();

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
