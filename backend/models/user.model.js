import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../constants.js"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "admin",
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export const UserModel = model("User", userSchema)