import express from "express";
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors"
import { CORS_ORIGIN, PORT } from "./constants.js"
import { connectDB } from "./db/db.config.js"
import logger from "./utils/logger.js";
import { seedDatabase } from "./seeder.js";

import healthRoute from "./routes/health.route.js";
import adminRoute from "./routes/admin.route.js";
import leadRoute from "./routes/leads.route.js";
import emailRoute from "./routes/email.route.js";

import "./crons/handleExistingLeads.cron.js";
import "./crons/handleNewLeads.cron.js"


connectDB()
seedDatabase();

const app = express();

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} - ${duration}ms`
        );
    });

    next();
});


app.use(cors({
    origin: [CORS_ORIGIN],
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

app.use("/api/health", healthRoute);
app.use("/api/admin", adminRoute);
app.use("/api/leads", leadRoute);
app.use("/api/email", emailRoute);

app.use((err, req, res, next) => {
    logger.error(
        `${err.status || 500} - ${err.message} - ${req.method} ${req.originalUrl} - Stack: ${err.stack || "N/A"}`
    );
    res.status(err.status || 500).send("Server error");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})