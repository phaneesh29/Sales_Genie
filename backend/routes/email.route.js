import express from "express";
import { sendCustomEmailController } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/send/:id", sendCustomEmailController);

export default router;