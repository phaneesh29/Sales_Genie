import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { adminDeleteController, adminGetAllController, adminLoginController, adminLogoutController, adminProfileController, adminRegisterController, adminUpdateController } from "../controllers/admin.controller.js";

const router = Router();

router.post("/register",adminMiddleware, adminRegisterController);
router.post("/login", adminLoginController);
router.get("/get/all", adminMiddleware, adminGetAllController);
router.get("/profile", adminMiddleware, adminProfileController);
router.put("/update/:id", adminMiddleware, adminUpdateController);
router.delete("/delete/:id", adminMiddleware, adminDeleteController);
router.get("/logout", adminMiddleware, adminLogoutController);


export default router;