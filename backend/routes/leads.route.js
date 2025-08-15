import { Router } from "express";
import multer from "multer";
import { getAllMeetingsController, leadAddController, leadAddCrmController, leadCheckController, leadDeleteController, leadFileUploadController, leadGetAllController, leadGetByIdController, leadMeetingReadyController, leadSearchController, leadSendMailController, leadSendMeetingLinkController, leadUpdateController } from "../controllers/lead.contoller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/import/file",adminMiddleware,upload.single("file"),leadFileUploadController);
router.post("/import/single",adminMiddleware,leadAddController);
router.post("/import/crm",adminMiddleware,leadAddCrmController);
router.get("/get/all",adminMiddleware,leadGetAllController);
router.get("/get/:id",adminMiddleware,leadGetByIdController);
router.post("/search",adminMiddleware,leadSearchController);
router.patch("/update/:id",adminMiddleware,leadUpdateController);
router.patch("/check/:id",adminMiddleware,leadCheckController);
router.get("/send/email",adminMiddleware,leadSendMailController);
router.delete("/delete/:id",adminMiddleware,leadDeleteController);

router.get("/meeting/ready/:id",leadMeetingReadyController);

router.get("/all/meetings",adminMiddleware,getAllMeetingsController);
router.post("/send/meeting-link/:id",adminMiddleware,leadSendMeetingLinkController);



export default router;