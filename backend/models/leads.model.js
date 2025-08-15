import { Schema, model } from "mongoose";

const leadSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        age: {
            type: Number,
            min: 0,
            default: null,
        },
        
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        industry: {
            type: String,
            enum: ["Technology", "Finance", "Healthcare", "Education","Retail"],
            trim: true,
            default: "Technology",
        },

        location: {
            type: String,
            trim: true,
            default: "",
        },

        linkedIn: {
            type: String,
            trim: true,
            default: "",
            match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, "Invalid LinkedIn URL"],
        },

        leadSource: {
            type: String,
            trim: true,
            default: "",
        },

        interestedIn: {
            type: [String],
            default: [],
        },

        preferredChannel: {
            type: String,
            default: "email",
            required: true,
        },

        leadScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        category: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: ["new", "contacted", "follow-up", "meeting", "closed"],
            default: "new",
            required: true,
        },

        readyToMeet: {
            type: Boolean,
            default: false,
        },

        meetingLink: {
            type: String,
            trim: true,
            default: "",
            match: [/^https?:\/\/.+$/, "Invalid meeting link URL"],
        },

        meetingDate: {
            type: Date,
            default: null,
        },

        insight: {
            type: String,
            trim: true,
            default: "",
        },
        checked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, }
);


export const LeadModel = model("Lead", leadSchema);
