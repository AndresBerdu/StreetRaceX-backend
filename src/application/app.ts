import express, { type Application } from "express";
import dontenv from "dotenv";
import cors from "cors";
import router from "./routes/appRouter.ts";

dontenv.config();
const app: Application = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http//:localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(router);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
