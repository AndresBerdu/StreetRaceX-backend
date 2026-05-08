import dotenv from "dotenv";
import { createApp } from "./app.ts";
import http from "http";
import { initSocket } from "./main/infrastructure/config/configSocket.ts";

/* Configs */
dotenv.config({ path: "./src/.env" });
const PORT = parseInt(process.env.PORT!) || 3000;

export const app = createApp();   // aquí exportas la instancia de Express

const server = http.createServer(app);
export const io = initSocket(server); 

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});