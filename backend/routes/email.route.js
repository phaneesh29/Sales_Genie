import express from "express";
import { getAllEmailController, sendCustomEmailController } from "../controllers/email.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/send/:id", adminMiddleware, sendCustomEmailController);
router.post("/get/all", adminMiddleware, getAllEmailController);

export default router;