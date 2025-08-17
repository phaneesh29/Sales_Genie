import { LeadModel } from "../models/leads.model.js";
import { parseFile } from "../utils/helpers.js";
import { isValidEmail } from "../utils/helpers.js";
import path from "path";
import fs from "fs";
import { mailer } from "../utils/email.service.js";
import { handleNewLeadsCron } from "../crons/handleNewLeads.cron.js";

export const leadFileUploadController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();

        const parsedData = await parseFile(req.file.path, ext);

        if (!parsedData || parsedData.length === 0) {
            return res.status(400).json({ error: "No data found in file" });
        }

        const filteredData = parsedData.filter(
            item => item.name && item.name.trim() && item.email && item.email.trim()
        );

        console.log(filteredData)

        const cleanData = filteredData.map(item => ({
            name: item.name?.trim(),
            email: item.email?.trim().toLowerCase(),
            phone: item.phone?.trim().toLowerCase(),
            age: item?.age ? Number(item.age) : undefined,
            role: item.role?.trim(),
            company: item.company?.trim(),
            industry: item.industry?.trim(),
            experience: Number(item.experience || item.exp || 0),
            location: item.location?.trim(),
            linkedIn: item.linkedIn?.trim(),
            leadSource: item.leadSource?.trim(),
            interestedIn: item.interestedIn ? item.interestedIn.split("|").map(i => i.trim()) : [],
            preferredChannel: item.preferredChannel?.trim() || "email",
            category: item.category?.trim() || "general",
        }));


        const uniqueFileData = cleanData.filter(
            (lead, index, self) =>
                index === self.findIndex(l => l.email === lead.email)
        );


        const existing = await LeadModel.find({
            email: { $in: uniqueFileData.map(l => l.email) }
        }).select("email");

        const existingEmails = new Set(existing.map(e => e.email));


        const finalData = uniqueFileData.filter(
            l => !existingEmails.has(l.email)
        );

        if (finalData.length > 0) {
            await LeadModel.insertMany(finalData);
        }

        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Failed to delete uploaded file:", err);
        });

        handleNewLeadsCron().catch(err => {
            console.error("Error processing new leads:", err);
        })

        res.status(201).json({ message: "File uploaded and data stored", count: finalData.length });
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => { });
        }
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadAddController = async (req, res) => {
    try {
        const { name, email,age, phone, role, company, experience, industry, location, linkedIn, leadSource, interestedIn, preferredChannel, category } = req.body;
        if (!name || !email || !role || !company) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingLead = await LeadModel.findOne({ email: email.trim().toLowerCase() });
        if (existingLead) {
            return res.status(400).json({ error: "Lead with this email already exists" });
        }
        const newLead = await LeadModel.create({
            name: name?.trim(),
            email: email?.trim().toLowerCase(),
            phone: phone?.trim().toLowerCase(),
            age: age ? Number(age) : undefined,
            role: role?.trim(),
            company: company?.trim(),
            industry: industry?.trim(),
            linkedIn: linkedIn?.trim(),
            leadSource: leadSource?.trim(),
            preferredChannel: preferredChannel?.trim(),
            category: category?.trim(),
            interestedIn: interestedIn,
            experience: Number(experience || 0),
            location: location ? location?.trim() : ""
        });

        handleNewLeadsCron().catch(err => {
            console.error("Error processing new leads:", err);
        })

        res.status(201).json({ message: "Lead added successfully", lead: newLead });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadAddCrmController = async (req, res) => {
    // TODO: Implement CRM lead addition logic
    res.status(501).json({ message: "CRM lead addition not implemented yet" });
}

export const leadGetAllController = async (req, res) => {
    try {
        const [newLeads, contactedLeads, followUpLeads, closedLeads, readyToMeetLeads] = await Promise.all([
            LeadModel.find({ status: "new" }).sort({ createdAt: -1, leadScore: -1 }),
            LeadModel.find({ status: "contacted" }).sort({ createdAt: -1, leadScore: -1 }),
            LeadModel.find({ status: "follow-up" }).sort({ createdAt: -1, leadScore: -1 }),
            LeadModel.find({ status: "closed" }).sort({ createdAt: -1, leadScore: -1 }),
            LeadModel.find({ status: "meeting",readyToMeet: true }).sort({ createdAt: -1, leadScore: -1 }),
        ]);

        res.status(200).json({ message: "Fetched all leads", newLeads, contactedLeads, followUpLeads, closedLeads, readyToMeetLeads });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadGetByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }
        const lead = await LeadModel.findById(id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ message: "Lead fetched successfully", lead });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadSearchController = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }
        const regex = new RegExp(query, 'i');
        const leads = await LeadModel.find({
            $or: [
                { name: regex },
                { email: regex },
                { role: regex },
                { company: regex },
                { location: regex },
                { phone: regex },
                { industry: regex },
                { linkedIn: regex },
                { leadSource: regex },
                { preferredChannel: regex },
                { category: regex },

            ]
        }).sort({ createdAt: -1, leadScore: -1 });

        if (leads.length === 0) {
            return res.status(404).json({ message: "No leads found matching the search criteria" });
        }

        res.status(200).json({ message: "Leads found", leads });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }

        const updateData = {};
        if (status) updateData.status = status;

        const updatedLead = await LeadModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedLead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        res.status(200).json({ message: "Lead updated successfully", lead: updatedLead });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadCheckController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }
        const lead = await LeadModel.findById(id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        lead.checked = !lead.checked;
        await lead.save();
        res.status(200).json({ message: "Lead check toggled", lead });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadSendMailController = async (req, res) => {
    try {
        await handleNewLeadsCron()
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const leadDeleteController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }
        const deletedLead = await LeadModel.findByIdAndDelete(id);
        if (!deletedLead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ message: "Lead deleted successfully", lead: deletedLead });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const leadMeetingReadyController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }
        const lead = await LeadModel.findByIdAndUpdate(id, { readyToMeet: true, status: "meeting" }, { new: true });

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json({ message: "Lead is ready for meeting", lead });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const getAllMeetingsController = async (req, res) => {
    try {
        const meetings = await LeadModel.find({ status: "meeting", readyToMeet: true, meetingDate: { $ne: null }, meetingLink: { $ne: "" } })
        if (meetings.length === 0) {
            return res.status(404).json({ message: "No meetings found" });
        }
        res.status(200).json({ message: "Meetings fetched successfully", meetings });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }

}

export const leadSendMeetingLinkController = async (req, res) => {
    try {
        const { id } = req.params;
        const { meetingLink, meetingDate } = req.body;

        if (!meetingLink || !meetingDate) {
            return res.status(400).json({ error: "Meeting link and date are required" });
        }
        if (!id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }

        const lead = await LeadModel.findByIdAndUpdate(id, {
            meetingLink: meetingLink.trim(),
            meetingDate: new Date(meetingDate),
            status: "meeting"
        }, { new: true });

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        const subject = `Meeting Link for Your Lead: ${lead.name}`;
        const text = `Hello ${lead.name},\n\nYour meeting is scheduled for ${meetingDate}.\nHere is your meeting link: ${meetingLink}`;

        await mailer({
            to: lead.email,
            subject,
            text
        })

        return res.status(200).json({ message: "Meeting link sent successfully", lead });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}