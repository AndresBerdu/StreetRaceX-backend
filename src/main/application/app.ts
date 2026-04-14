import express, { type Application } from "express";
import "../infrastructure/firebase/firebaseAdmin.ts";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/appRouter.ts";
 
dotenv.config({ path: "./src/infrastructure/.env" });
const app: Application = express();

const PORT = parseInt(process.env.PORT!) || 3000;

app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
