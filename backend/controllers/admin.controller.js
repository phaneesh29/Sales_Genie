import { UserModel } from "../models/user.model.js";
import { isValidEmail } from "../utils/helpers.js";

export const adminRegisterController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (role !== "admin") {
            return res.status(400).json({ message: "Only Admin can be registered" });
        }

        const existedAdmin = await UserModel.findOne({ email })

        if (existedAdmin) {
            return res.status(409).json({ message: "Admin with email already exists" })
        }
        const admin = await UserModel.create({
            email,
            password,
            name,
            role,
        })
        return res.status(201).json({ message: "New Admin registered Successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const adminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const admin = await UserModel.findOne({ email })

        if (!admin) {
            return res.status(404).json({ message: "User does not exist" })
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Only Admin can login" })
        }

        if (!admin.is_active) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        const isPasswordValid = await admin.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" })
        }


        const adminToken = admin.generateAccessToken()
        const options = {
            httpOnly: false,
            secure: true,
            sameSite: true,
            maxAge: 24 * 60 * 60 * 1000,
        }
        return res.status(200).cookie("adminToken", adminToken, options).json({ message: "User Logged in successfully", adminToken })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const adminGetAllController = async (req, res) => {
    try {
        const admins = await UserModel.find({ role: "admin" }).select("-password -__v");
        return res.status(200).json({ message: "Admins fetched successfully", admins });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const adminProfileController = (req, res) => {
    try {
        const admin = req.admin;
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin profile fetched successfully", admin });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}


export const adminUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, is_active } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Admin ID is required" });
        }

        if (!name && !password && is_active === undefined) {
            return res.status(400).json({ message: "At least one field must be provided" });
        }

        const admin = await UserModel.findById(id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (admin.role !== "admin") {
            return res.status(400).json({ message: "Only Admin can be updated" });
        }

        if (name) admin.name = name.trim();
        if (typeof is_active === "boolean") admin.is_active = is_active;
        if (password) admin.password = password

        await admin.save();

        return res.status(200).json({ message: "Admin updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const adminDeleteController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Admin ID is required" });
        }
        const admin = await UserModel.findById(id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Only Admin can be deleted" });
        }

        if (req.admin._id.equals(admin._id)) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const adminLogoutController = (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        }
        return res.status(200).clearCookie("adminToken", options).json({ message: "User logged Out" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}