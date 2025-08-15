import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { UserModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const adminMiddleware = async (req, res, next) => {
    try {
        const adminToken = req.cookies.adminToken || req.headers.authorization?.split(" ")[1]

        if (!adminToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(adminToken, ACCESS_TOKEN_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const admin = await UserModel.findById(decoded._id).select("-password")
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }
        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Forbidden - No Admin Privileges" });
        }
        req.admin = admin
        next()
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}