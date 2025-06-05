import express from "express";
import { registerCommonMiddilewware } from "./middlewares";
import registerRoutes  from "./routes";


const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

registerCommonMiddilewware(app);
registerRoutes(app);

export default app;
