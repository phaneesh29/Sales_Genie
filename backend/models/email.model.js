import mongoose, { Schema, model } from "mongoose";

const emailSchema = new Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true
    },

    leadEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique:true
    },

    subject: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "sent", "responded"],
        default: "pending",
        required: true,
    },

    nextMailDate: {
        type: Date,
        default: null
    },

}, { timestamps: true });

export const EmailModel = model("Email", emailSchema)
