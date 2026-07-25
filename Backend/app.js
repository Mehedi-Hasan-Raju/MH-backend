import express from "express";
import dotenv from "dotenv";
import cors from"cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js"
import userRouter from "./router/userRoute.js";
import timelineRouter from "./router/timelineRoute.js";
import applicationRouter from "./router/softwareApplicationRoute.js";
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoute.js";
import educationRoute from "./router/educationRoute.js"
import fs from "fs";
import os from "os";
import path from "path";


const app = express();
dotenv.config({path: "./config/config.env"});
dbConnection();

app.use(cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET","POST","DELETE","PUT"],
    credentials: true,
})
);


app.use (cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// On Vercel the filesystem is read-only except for the OS temp dir (os.tmpdir()).
// On Render/local, this still works fine too, so one config works everywhere.
const tempDir = path.join(os.tmpdir(), "uploads");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareapplication", applicationRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/education", educationRoute); 



app.use(errorMiddleware);
 export default app;